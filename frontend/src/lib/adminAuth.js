import { createHmac, pbkdf2, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';
import { ADMIN_AVATAR_ENDPOINT } from '@/config/profile';
import {
  getAdminPasswordHash,
  getAdminPasswordVersion,
  getDevelopmentDemoPasswordHash,
  getDevelopmentDemoPasswordVersion,
} from '@/lib/adminPasswordReset';

export const ADMIN_SESSION_COOKIE = 'sne_admin_session';
export const ADMIN_SESSION_TTL_SECONDS = 60 * 60 * 8;
export const PASSWORD_HASH_ITERATIONS = 310_000;

const PASSWORD_HASH_BYTES = 32;
const MIN_SESSION_SECRET_BYTES = 32;

export function isAdminDevelopmentPreviewEnabled() {
  return process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_DEV_ADMIN_PREVIEW === 'true';
}

export function getConfiguredAdminAvatarUrl(id) {
  const configuredPath = (id === 'admin-demo'
    ? process.env.DEV_DEMO_ADMIN_AVATAR_URL
    : process.env.ADMIN_AVATAR_URL)?.trim();
  if (
    !configuredPath ||
    !configuredPath.startsWith('/') ||
    configuredPath.startsWith('//') ||
    configuredPath.includes('\\') ||
    configuredPath.split('/').includes('..')
  ) {
    return null;
  }
  return configuredPath;
}

function getDevelopmentDemoAdmin() {
  if (process.env.NODE_ENV !== 'development') return null;

  const username = process.env.DEV_DEMO_ADMIN_USERNAME?.trim();
  const passwordHash = parsePasswordHash(getDevelopmentDemoPasswordHash());
  if (!username || !passwordHash) return null;

  return {
    username,
    email: process.env.DEV_DEMO_ADMIN_EMAIL?.trim() || '',
    phone: process.env.DEV_DEMO_ADMIN_PHONE?.trim() || '',
    passwordHash,
  };
}

function getAdminDevelopmentPreviewSession() {
  return {
    user: {
      id: 'admin-preview',
      name: process.env.ADMIN_NAME?.trim() || 'Local Administrator',
      email: process.env.ADMIN_EMAIL?.trim() || process.env.ADMIN_USERNAME?.trim() || 'admin@localhost',
      role: 'admin',
      avatarUrl: ADMIN_AVATAR_ENDPOINT,
    },
    expiresAt: null,
  };
}

export class AdminAuthConfigurationError extends Error {
  constructor() {
    super('Admin authentication is not configured on this server.');
    this.name = 'AdminAuthConfigurationError';
  }
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
  ) {
    return null;
  }
  return { iterations, salt: Buffer.from(saltHex, 'hex'), digest: Buffer.from(digestHex, 'hex') };
}

function getSessionSecret() {
  const secret = process.env.AUTH_SESSION_SECRET;
  if (typeof secret !== 'string' || Buffer.byteLength(secret, 'utf8') < MIN_SESSION_SECRET_BYTES) return null;
  return secret;
}

function hasRequiredConfiguration() {
  return Boolean(
    process.env.ADMIN_USERNAME?.trim() &&
      parsePasswordHash(process.env.ADMIN_PASSWORD_HASH) &&
      getSessionSecret(),
  );
}

function safeTextEqual(left, right) {
  const leftBuffer = Buffer.from(left, 'utf8');
  const rightBuffer = Buffer.from(right, 'utf8');
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

function normalizeLoginIdentifier(value) {
  const normalized = value.trim();
  if (normalized.includes('@')) return `email:${normalized.toLowerCase()}`;
  if (/^[+\d().\-\s]+$/.test(normalized)) {
    const digits = normalized.replace(/\D/g, '');
    if (digits.length >= 7 && digits.length <= 15) return `phone:${digits}`;
  }
  return `username:${normalized.toLowerCase()}`;
}

function matchesAnyIdentifier(identifier, configuredIdentifiers) {
  const normalizedIdentifier = normalizeLoginIdentifier(identifier);
  return configuredIdentifiers
    .filter((value) => typeof value === 'string' && value.trim())
    .reduce((matched, value) => safeTextEqual(normalizedIdentifier, normalizeLoginIdentifier(value)) || matched, false);
}

function getSessionPrincipals() {
  const adminUsername = process.env.ADMIN_USERNAME?.trim();
  const adminEmail = process.env.ADMIN_EMAIL?.trim() || adminUsername;
  const principals = adminUsername
    ? [{ id: 'admin', subject: adminEmail, email: adminEmail }]
    : [];
  const demoAdmin = getDevelopmentDemoAdmin();
  if (demoAdmin) {
    const email = demoAdmin.email || demoAdmin.username;
    principals.push({ id: 'admin-demo', subject: email, email });
  }
  return principals;
}

function derivePassword(password, salt, iterations) {
  return new Promise((resolve, reject) => {
    pbkdf2(password, salt, iterations, PASSWORD_HASH_BYTES, 'sha256', (error, digest) => {
      if (error) reject(error);
      else resolve(digest);
    });
  });
}

export async function authenticateAdmin(identifier, password) {
  const adminUsername = process.env.ADMIN_USERNAME?.trim();
  const storedHash = parsePasswordHash(getAdminPasswordHash());
  if (!adminUsername || !storedHash || !getSessionSecret()) {
    throw new AdminAuthConfigurationError();
  }

  if (typeof identifier !== 'string' || typeof password !== 'string' || password.length > 1024) {
    return null;
  }

  // Derive the password even when the sign-in ID differs so both failure paths do comparable work.
  const candidateDigest = await derivePassword(password, storedHash.salt, storedHash.iterations);
  const passwordMatches = timingSafeEqual(candidateDigest, storedHash.digest);
  const adminIdentifiers = [adminUsername, process.env.ADMIN_EMAIL?.trim(), process.env.ADMIN_PHONE?.trim()];
  const adminIdentifierMatches = matchesAnyIdentifier(identifier, adminIdentifiers);
  if (passwordMatches && adminIdentifierMatches) {
    const email = process.env.ADMIN_EMAIL?.trim() || adminUsername;
    return {
      id: 'admin',
      name: process.env.ADMIN_NAME?.trim() || 'System Administrator',
      email,
      role: 'admin',
      avatarUrl: ADMIN_AVATAR_ENDPOINT,
    };
  }

  const demoAdmin = getDevelopmentDemoAdmin();
  if (demoAdmin) {
    const demoDigest = await derivePassword(password, demoAdmin.passwordHash.salt, demoAdmin.passwordHash.iterations);
    const demoPasswordMatches = timingSafeEqual(demoDigest, demoAdmin.passwordHash.digest);
    const demoIdentifierMatches = matchesAnyIdentifier(identifier, [demoAdmin.username, demoAdmin.email, demoAdmin.phone]);
    if (demoPasswordMatches && demoIdentifierMatches) {
      const email = demoAdmin.email || demoAdmin.username;
      return {
        id: 'admin-demo',
        name: 'Local Demo Admin',
        email,
        role: 'admin',
        avatarUrl: ADMIN_AVATAR_ENDPOINT,
      };
    }
  }

  return null;
}

function signPayload(payload) {
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = createHmac('sha256', getSessionSecret()).update(encodedPayload).digest('base64url');
  return `${encodedPayload}.${signature}`;
}

export function createAdminSession(user, now = Date.now()) {
  const secret = getSessionSecret();
  if (!secret || !hasRequiredConfiguration()) throw new AdminAuthConfigurationError();

  const issuedAt = Math.floor(now / 1000);
  const expiresAt = issuedAt + ADMIN_SESSION_TTL_SECONDS;
  const token = signPayload({
    sub: user.email,
    name: user.name,
    role: 'admin',
    pwdv: user.id === 'admin-demo' ? getDevelopmentDemoPasswordVersion() : getAdminPasswordVersion(),
    iat: issuedAt,
    exp: expiresAt,
  });

  return { token, expiresAt: expiresAt * 1000 };
}

export function verifyAdminSessionToken(token, now = Date.now()) {
  if (typeof token !== 'string' || token.length > 4096 || !hasRequiredConfiguration()) return null;

  const [encodedPayload, encodedSignature, extra] = token.split('.');
  if (!encodedPayload || !encodedSignature || extra !== undefined) return null;

  let suppliedSignature;
  let payload;
  try {
    suppliedSignature = Buffer.from(encodedSignature, 'base64url');
    payload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf8'));
  } catch {
    return null;
  }

  const expectedSignature = createHmac('sha256', getSessionSecret()).update(encodedPayload).digest();
  if (suppliedSignature.length !== expectedSignature.length || !timingSafeEqual(suppliedSignature, expectedSignature)) {
    return null;
  }

  const currentTime = Math.floor(now / 1000);
  const principal = typeof payload?.sub === 'string'
    ? getSessionPrincipals().find((candidate) => safeTextEqual(payload.sub.toLowerCase(), candidate.subject.toLowerCase()))
    : null;
  const passwordVersion = principal?.id === 'admin-demo'
    ? getDevelopmentDemoPasswordVersion()
    : getAdminPasswordVersion();
  if (
    payload?.role !== 'admin' ||
    payload?.pwdv !== passwordVersion ||
    !principal ||
    typeof payload.name !== 'string' ||
    !Number.isInteger(payload.iat) ||
    !Number.isInteger(payload.exp) ||
    payload.iat > currentTime + 60 ||
    payload.exp <= currentTime ||
    payload.exp - payload.iat > ADMIN_SESSION_TTL_SECONDS
  ) {
    return null;
  }

  return {
    user: {
      id: principal.id,
      name: payload.name,
      email: principal.email,
      role: 'admin',
      avatarUrl: ADMIN_AVATAR_ENDPOINT,
    },
    expiresAt: payload.exp * 1000,
  };
}

export function getAdminSessionFromCookieHeader(cookieHeader) {
  if (isAdminDevelopmentPreviewEnabled()) return getAdminDevelopmentPreviewSession();
  if (typeof cookieHeader !== 'string') return null;
  const cookie = cookieHeader.split(';').map((part) => part.trim()).find((part) => part.startsWith(`${ADMIN_SESSION_COOKIE}=`));
  return verifyAdminSessionToken(cookie?.slice(ADMIN_SESSION_COOKIE.length + 1));
}

export async function getServerAdminSession() {
  if (isAdminDevelopmentPreviewEnabled()) return getAdminDevelopmentPreviewSession();
  const cookieStore = await cookies();
  return verifyAdminSessionToken(cookieStore.get(ADMIN_SESSION_COOKIE)?.value);
}

export function setAdminSessionCookie(response, token) {
  response.cookies.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: ADMIN_SESSION_TTL_SECONDS,
  });
  return response;
}

export function clearAdminSessionCookie(response) {
  response.cookies.set(ADMIN_SESSION_COOKIE, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: new Date(0),
    maxAge: 0,
  });
  return response;
}
