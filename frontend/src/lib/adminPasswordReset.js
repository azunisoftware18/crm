import { createHash, pbkdf2, randomBytes, timingSafeEqual } from 'node:crypto';
import { mkdir, rename, writeFile } from 'node:fs/promises';
import { readFileSync } from 'node:fs';
import path from 'node:path';

const PASSWORD_HASH_ITERATIONS = 310_000;
const PASSWORD_HASH_BYTES = 32;
const RESET_TOKEN_TTL_MS = 20 * 60 * 1000;
const RESET_RESEND_COOLDOWN_MS = 60 * 1000;
const STORE_PATH = path.resolve(
  /*turbopackIgnore: true*/ process.env.ADMIN_AUTH_STORE_PATH || path.join(process.cwd(), '.private', 'admin-auth.json'),
);

let writeQueue = Promise.resolve();

function emptyState() {
  return {
    passwordHash: null,
    passwordVersion: 0,
    demoPasswordHash: null,
    demoPasswordVersion: 0,
    reset: null,
    lastResetRequestAt: 0,
  };
}

function readState() {
  let raw;
  try {
    raw = readFileSync(/*turbopackIgnore: true*/ STORE_PATH, 'utf8');
  } catch (error) {
    if (error.code === 'ENOENT') return emptyState();
    throw error;
  }

  const state = JSON.parse(raw);
  if (
    !state ||
    (state.passwordHash !== null && typeof state.passwordHash !== 'string') ||
    !Number.isFinite(state.passwordVersion) ||
    (state.demoPasswordHash !== undefined && state.demoPasswordHash !== null && typeof state.demoPasswordHash !== 'string') ||
    (state.demoPasswordVersion !== undefined && !Number.isFinite(state.demoPasswordVersion)) ||
    !Number.isFinite(state.lastResetRequestAt) ||
    (state.reset !== null && (
      typeof state.reset?.tokenHash !== 'string' ||
      !Number.isFinite(state.reset?.expiresAt)
    ))
  ) {
    throw new Error('The admin credential store is invalid.');
  }
  return { ...emptyState(), ...state };
}

async function writeState(state) {
  await mkdir(path.dirname(STORE_PATH), { recursive: true, mode: 0o700 });
  const temporaryPath = `${STORE_PATH}.${randomBytes(8).toString('hex')}.tmp`;
  await writeFile(temporaryPath, JSON.stringify(state), { encoding: 'utf8', mode: 0o600, flag: 'wx' });
  await rename(temporaryPath, STORE_PATH);
}

function updateState(update) {
  const operation = writeQueue.then(async () => {
    const state = readState();
    const result = await update(state);
    return result;
  });
  writeQueue = operation.catch(() => {});
  return operation;
}

function sha256(value) {
  return createHash('sha256').update(value).digest();
}

function safeDigestEqual(leftHex, rightDigest) {
  if (!/^[a-f0-9]{64}$/i.test(leftHex || '')) return false;
  const left = Buffer.from(leftHex, 'hex');
  return left.length === rightDigest.length && timingSafeEqual(left, rightDigest);
}

function derivePassword(password, salt, iterations = PASSWORD_HASH_ITERATIONS) {
  return new Promise((resolve, reject) => {
    pbkdf2(password, salt, iterations, PASSWORD_HASH_BYTES, 'sha256', (error, digest) => {
      if (error) reject(error);
      else resolve(digest);
    });
  });
}

function parsePasswordHash(value) {
  if (typeof value !== 'string') return null;
  const [algorithm, iterationText, saltHex, digestHex, extra] = value.split('$');
  const iterations = Number(iterationText);
  if (
    algorithm !== 'pbkdf2' ||
    extra !== undefined ||
    !Number.isInteger(iterations) ||
    iterations < 100_000 ||
    iterations > 1_000_000 ||
    !/^[a-f0-9]{32}$/i.test(saltHex || '') ||
    !/^[a-f0-9]{64}$/i.test(digestHex || '')
  ) return null;
  return { iterations, salt: Buffer.from(saltHex, 'hex'), digest: Buffer.from(digestHex, 'hex') };
}

async function createPasswordHash(password) {
  const salt = randomBytes(16);
  const digest = await derivePassword(password, salt);
  return `pbkdf2$${PASSWORD_HASH_ITERATIONS}$${salt.toString('hex')}$${digest.toString('hex')}`;
}

export function getAdminPasswordHash() {
  return readState().passwordHash || process.env.ADMIN_PASSWORD_HASH;
}

export function getAdminPasswordVersion() {
  return readState().passwordVersion;
}

export function getDevelopmentDemoPasswordHash() {
  return readState().demoPasswordHash || process.env.DEV_DEMO_ADMIN_PASSWORD_HASH;
}

export function getDevelopmentDemoPasswordVersion() {
  return readState().demoPasswordVersion || 0;
}

export async function changeAdminPassword(principalId, currentPassword, newPassword) {
  if (
    !['admin', 'admin-demo'].includes(principalId) ||
    typeof currentPassword !== 'string' ||
    currentPassword.length < 1 ||
    currentPassword.length > 1024 ||
    typeof newPassword !== 'string' ||
    newPassword.length < 10 ||
    newPassword.length > 1024
  ) return { status: 'invalid-input' };

  const demo = principalId === 'admin-demo';
  const hashKey = demo ? 'demoPasswordHash' : 'passwordHash';
  const versionKey = demo ? 'demoPasswordVersion' : 'passwordVersion';
  const environmentHash = demo ? process.env.DEV_DEMO_ADMIN_PASSWORD_HASH : process.env.ADMIN_PASSWORD_HASH;
  const state = readState();
  const currentHash = state[hashKey] || environmentHash;
  const parsedHash = parsePasswordHash(currentHash);
  if (!parsedHash) return { status: 'not-configured' };

  const suppliedDigest = await derivePassword(currentPassword, parsedHash.salt, parsedHash.iterations);
  if (suppliedDigest.length !== parsedHash.digest.length || !timingSafeEqual(suppliedDigest, parsedHash.digest)) {
    return { status: 'invalid-current-password' };
  }

  const nextHash = await createPasswordHash(newPassword);
  return updateState(async (latestState) => {
    if ((latestState[hashKey] || environmentHash) !== currentHash) {
      return { status: 'credentials-changed' };
    }

    latestState[hashKey] = nextHash;
    latestState[versionKey] = Math.max(Date.now(), Number(latestState[versionKey] || 0) + 1);
    if (!demo) {
      latestState.reset = null;
      latestState.lastResetRequestAt = 0;
    }
    await writeState(latestState);
    return { status: 'updated' };
  });
}

export function getAdminResetEmail() {
  const configuredEmail = process.env.ADMIN_EMAIL?.trim();
  const loginName = process.env.ADMIN_USERNAME?.trim();
  const email = configuredEmail || (loginName?.includes('@') ? loginName : '');
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email.toLowerCase() : null;
}

export async function createAdminPasswordReset() {
  return updateState(async (state) => {
    const now = Date.now();
    if (now - state.lastResetRequestAt < RESET_RESEND_COOLDOWN_MS) {
      return { rateLimited: true, token: null };
    }

    const token = randomBytes(32).toString('base64url');
    state.reset = { tokenHash: sha256(token).toString('hex'), expiresAt: now + RESET_TOKEN_TTL_MS };
    state.lastResetRequestAt = now;
    await writeState(state);
    return { rateLimited: false, token };
  });
}

export async function cancelAdminPasswordReset(token) {
  if (typeof token !== 'string' || !/^[A-Za-z0-9_-]{43}$/.test(token)) return;
  const suppliedHash = sha256(token);
  await updateState(async (state) => {
    if (state.reset && safeDigestEqual(state.reset.tokenHash, suppliedHash)) {
      state.reset = null;
      await writeState(state);
    }
  });
}

export async function completeAdminPasswordReset(token, password) {
  if (
    typeof token !== 'string' ||
    !/^[A-Za-z0-9_-]{43}$/.test(token) ||
    typeof password !== 'string' ||
    password.length < 10 ||
    password.length > 1024
  ) return false;
  const initialState = readState();
  if (!initialState.reset || initialState.reset.expiresAt <= Date.now() || !safeDigestEqual(initialState.reset.tokenHash, sha256(token))) {
    return false;
  }
  const passwordHash = await createPasswordHash(password);
  const suppliedHash = sha256(token);

  return updateState(async (state) => {
    if (!state.reset || state.reset.expiresAt <= Date.now() || !safeDigestEqual(state.reset.tokenHash, suppliedHash)) {
      return false;
    }

    state.passwordHash = passwordHash;
    state.passwordVersion = Date.now();
    state.reset = null;
    state.lastResetRequestAt = 0;
    await writeState(state);
    return true;
  });
}
