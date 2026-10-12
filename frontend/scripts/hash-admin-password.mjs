import { pbkdf2Sync, randomBytes } from 'node:crypto';

const ITERATIONS = 310_000;
const PASSWORD_BYTES = 32;

function readHiddenPassword(label) {
  return new Promise((resolve, reject) => {
    const input = process.stdin;
    if (!input.isTTY || typeof input.setRawMode !== 'function') {
      reject(new Error('Run this command in an interactive terminal so the password stays hidden.'));
      return;
    }

    let value = '';
    const finish = (error) => {
      input.off('data', onData);
      input.setRawMode(false);
      input.pause();
      process.stdout.write('\n');
      if (error) reject(error);
      else resolve(value);
    };
    const onData = (buffer) => {
      const text = buffer.toString('utf8');
      for (const character of text) {
        if (character === '\u0003') {
          finish(new Error('Password entry cancelled.'));
          return;
        }
        if (character === '\r' || character === '\n') {
          finish();
          return;
        }
        if (character === '\u007f' || character === '\b') {
          value = value.slice(0, -1);
        } else if (character >= ' ' && value.length < 1024) {
          value += character;
        }
      }
    };

    process.stdout.write(label);
    input.setRawMode(true);
    input.resume();
    input.on('data', onData);
  });
}

try {
  const password = await readHiddenPassword('New admin password (minimum 10 characters): ');
  const confirmation = await readHiddenPassword('Confirm admin password: ');
  if (password.length < 10) throw new Error('Use a password with at least 10 characters.');
  if (password !== confirmation) throw new Error('The passwords did not match.');

  const salt = randomBytes(16);
  const digest = pbkdf2Sync(password, salt, ITERATIONS, PASSWORD_BYTES, 'sha256');
  const hash = `pbkdf2$${ITERATIONS}$${salt.toString('hex')}$${digest.toString('hex')}`;
  // Escape dollar signs so Next.js dotenv-expand preserves the hash when pasted into .env.local.
  process.stdout.write(`\nADMIN_PASSWORD_HASH=${hash.replaceAll('$', '\\$')}\n`);
} catch (error) {
  process.stderr.write(`${error.message}\n`);
  process.exitCode = 1;
}
