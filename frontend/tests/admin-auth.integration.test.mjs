import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { createHmac, pbkdf2Sync, randomBytes } from 'node:crypto';
import { once } from 'node:events';
import net from 'node:net';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const iterations = 310_000;
const password = randomBytes(24).toString('base64url');
const username = `admin-${randomBytes(6).toString('hex')}`;
const emailAlias = `security-${randomBytes(6).toString('hex')}@example.test`;
const phoneAlias = '+14155552671';
const sessionSecret = randomBytes(32).toString('base64url');
const salt = randomBytes(16);
const passwordDigest = pbkdf2Sync(password, salt, iterations, 32, 'sha256');
const passwordHash = `pbkdf2$${iterations}$${salt.toString('hex')}$${passwordDigest.toString('hex')}`;
const cookieName = 'sne_admin_session';

async function assertRedirectTo(response, pathname, message) {
  if ([301, 302, 303, 307, 308].includes(response.status)) {
    assert.match(response.headers.get('location') || '', new RegExp(`${pathname.replaceAll('/', '\\/')}$`), message);
    return null;
  }

  // Cache Components may stream a Server Component redirect as a meta refresh after its Suspense fallback.
  assert.equal(response.status, 200, message);
  const body = await response.text();
  assert.match(body, /http-equiv="refresh"/i, message);
  assert.ok(body.includes(pathname), `Expected the streamed redirect to ${pathname}.`);
  return body;
}

async function getFreePort() {
  const server = net.createServer();
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve);
  });
  const { port } = server.address();
  await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  return port;
}

function createExpiredCookie() {
  const now = Math.floor(Date.now() / 1000);
  const payload = Buffer.from(JSON.stringify({
    sub: username,
    name: 'Temporary Admin',
    role: 'admin',
    iat: now - 120,
    exp: now - 1,
  })).toString('base64url');
  const signature = createHmac('sha256', sessionSecret).update(payload).digest('base64url');
  return `${cookieName}=${payload}.${signature}`;
}

async function waitForServer(child, baseUrl, getOutput) {
  for (let attempt = 0; attempt < 90; attempt += 1) {
    if (child.exitCode !== null) throw new Error(`App server exited early. ${getOutput()}`);
    try {
      const response = await fetch(`${baseUrl}/api/auth/session`, { signal: AbortSignal.timeout(1000) });
      if (response.status === 401) return;
    } catch {
      // The production server is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error(`App server did not become ready. ${getOutput()}`);
}

test('admin login, protected routes, session expiry, and logout', async () => {
  const port = await getFreePort();
  const baseUrl = `http://127.0.0.1:${port}`;
  const nextCli = path.join(projectRoot, 'node_modules', 'next', 'dist', 'bin', 'next');
  const child = spawn(process.execPath, [nextCli, 'start', '--hostname', '127.0.0.1', '--port', String(port)], {
    cwd: projectRoot,
    env: {
      ...process.env,
      NODE_ENV: 'production',
      ADMIN_USERNAME: username,
      ADMIN_EMAIL: emailAlias,
      ADMIN_PHONE: phoneAlias,
      ADMIN_NAME: 'Temporary Test Admin',
      // Next's dotenv expansion processes dollar signs in env values; preserve the PBKDF2 separators.
      ADMIN_PASSWORD_HASH: passwordHash.replaceAll('$', '\\$'),
      AUTH_SESSION_SECRET: sessionSecret,
    },
    stdio: ['ignore', 'ignore', 'pipe'],
  });

  let serverOutput = '';
  child.stderr.setEncoding('utf8');
  child.stderr.on('data', (chunk) => { serverOutput += chunk; });
  const output = () => serverOutput.slice(-4000);

  try {
    await waitForServer(child, baseUrl, output);

    const loginPage = await fetch(`${baseUrl}/login`);
    assert.equal(loginPage.status, 200);
    const loginHtml = await loginPage.text();
    assert.match(loginHtml, /Username, email or phone number/);
    assert.match(loginHtml, /Enter username, email or phone number/);
    assert.match(loginHtml, /Welcome Back/);
    assert.match(loginHtml, /Sign in to access your admin dashboard\./);
    assert.match(loginHtml, /Forgot password\?/);
    assert.doesNotMatch(loginHtml, /Secure Admin Access|Local demo login is ready/);
    assert.match(loginHtml, /Sign In/);
    assert.match(loginHtml, /Show password/);
    assert.match(loginHtml, /name="identifier"/);
    assert.match(loginHtml, /name="password"/);
    assert.match(loginHtml, /placeholder="Enter username, email or phone number"/);
    assert.match(loginHtml, /placeholder="Enter your password"/);
    assert.doesNotMatch(loginHtml, /demo dashboard|demo workspace|quick demo access/i);

    const removedDemoLogin = await fetch(`${baseUrl}/api/auth/demo-login`, { method: 'POST' });
    assert.equal(removedDemoLogin.status, 404, 'No demo sign-in endpoint should be available');

    for (const path of ['/admin/users', '/admin/roles', '/admin/permissions', '/admin/audit-logs', '/admin/settings']) {
      const protectedRoute = await fetch(`${baseUrl}${path}`, { redirect: 'manual' });
      const body = await assertRedirectTo(protectedRoute, '/login', `Unauthenticated ${path} should redirect on the server`);
      if (body) assert.doesNotMatch(body, /Search users|New User/, `${path} must not stream admin page content to guests`);
    }

    const invalidLogin = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password: 'incorrect-password' }),
    });
    const invalidLoginBody = await invalidLogin.json();
    assert.equal(invalidLogin.status, 401, `Invalid password should be rejected (${invalidLoginBody.error || invalidLogin.status})`);
    assert.equal(invalidLogin.headers.get('set-cookie'), null, 'Failed login must not issue a session cookie');

    const invalidUsername = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'sales@sne.local', password }),
    });
    assert.equal(invalidUsername.status, 401, 'Ordinary usernames must not be granted admin access');

    const validLogin = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: username, password }),
    });
    assert.equal(validLogin.status, 200, 'Configured admin credentials should sign in');
    const loginData = await validLogin.json();
    assert.equal(loginData.user.role, 'admin');
    assert.equal(loginData.user.name, 'Temporary Test Admin');
    assert.equal('token' in loginData, false, 'Session tokens must not be returned to client JavaScript');

    const setCookie = validLogin.headers.get('set-cookie') || '';
    assert.match(setCookie, new RegExp(`^${cookieName}=`));
    assert.match(setCookie, /HttpOnly/i);
    assert.match(setCookie, /Secure/i);
    assert.match(setCookie, /SameSite=Lax/i);
    const cookie = setCookie.split(';', 1)[0];

    const persistedSession = await fetch(`${baseUrl}/api/auth/session`, { headers: { Cookie: cookie } });
    assert.equal(persistedSession.status, 200, 'A page reload should keep a valid cookie session');
    assert.equal((await persistedSession.json()).user.email, emailAlias);

    const emailAliasLogin = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: emailAlias, password }),
    });
    assert.equal(emailAliasLogin.status, 200, 'The configured admin email should sign in');

    const phoneAliasLogin = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: '+1 (415) 555-2671', password }),
    });
    assert.equal(phoneAliasLogin.status, 200, 'The configured admin phone should sign in despite formatting');

    const authenticatedAdminPage = await fetch(`${baseUrl}/admin/users`, {
      headers: { Cookie: cookie },
      redirect: 'manual',
    });
    assert.equal(authenticatedAdminPage.status, 200, 'An authenticated admin should reach the admin page');

    const authenticatedDashboard = await fetch(`${baseUrl}/dashboard`, {
      headers: { Cookie: cookie },
      redirect: 'manual',
    });
    assert.equal(authenticatedDashboard.status, 200, 'An authenticated admin should reach the dashboard');

    const authenticatedLoginPage = await fetch(`${baseUrl}/login`, {
      headers: { Cookie: cookie },
      redirect: 'manual',
    });
    await assertRedirectTo(authenticatedLoginPage, '/dashboard', 'An authenticated admin should leave the login page');

    const expiredSession = await fetch(`${baseUrl}/api/auth/session`, {
      headers: { Cookie: createExpiredCookie() },
    });
    assert.equal(expiredSession.status, 401, 'Expired cookies must not authenticate');

    const logout = await fetch(`${baseUrl}/api/auth/logout`, {
      method: 'POST',
      headers: { Cookie: cookie },
    });
    assert.equal(logout.status, 200);
    assert.match(logout.headers.get('set-cookie') || '', /Max-Age=0/i, 'Logout must clear the browser cookie');

    const afterLogout = await fetch(`${baseUrl}/api/auth/session`);
    assert.equal(afterLogout.status, 401, 'A cleared browser session must no longer authenticate');
  } finally {
    if (child.exitCode === null) {
      child.kill();
      await Promise.race([
        once(child, 'exit'),
        new Promise((resolve) => setTimeout(resolve, 5000)),
      ]);
    }
  }
});
