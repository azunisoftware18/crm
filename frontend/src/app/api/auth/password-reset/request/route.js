import { NextResponse } from 'next/server';
import {
  cancelAdminPasswordReset,
  createAdminPasswordReset,
  getAdminResetEmail,
} from '@/lib/adminPasswordReset';
import {
  isPasswordResetEmailConfigured,
  sendAdminPasswordResetEmail,
} from '@/lib/adminPasswordResetEmail';

const GENERIC_MESSAGE = 'If that email belongs to the admin account, password reset instructions will be sent.';
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function response(body, status = 200) {
  return NextResponse.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
}

function getTrustedBaseUrl(request) {
  const configured = process.env.APP_BASE_URL?.trim();
  if (!configured && process.env.NODE_ENV === 'production') {
    throw new Error('The application base URL is not configured.');
  }

  const baseUrl = new URL(configured || new URL(request.url).origin);
  if (process.env.NODE_ENV === 'production' && baseUrl.protocol !== 'https:') {
    throw new Error('Password reset requires an HTTPS application URL.');
  }
  return baseUrl.origin;
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return response({ error: 'Enter a valid email address.' }, 400);
  }

  const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';
  if (email.length > 254 || !EMAIL_PATTERN.test(email)) {
    return response({ error: 'Enter a valid email address.' }, 400);
  }

  const adminEmail = getAdminResetEmail();
  if (!adminEmail || !isPasswordResetEmailConfigured()) {
    return response({ error: 'Password reset email is not configured on this server yet.' }, 503);
  }

  if (email !== adminEmail) return response({ message: GENERIC_MESSAGE });

  let reset;
  try {
    reset = await createAdminPasswordReset();
    if (reset.rateLimited) return response({ message: GENERIC_MESSAGE });

    const baseUrl = getTrustedBaseUrl(request);
    const resetUrl = new URL('/reset-password', baseUrl);
    resetUrl.searchParams.set('token', reset.token);
    await sendAdminPasswordResetEmail({ to: adminEmail, resetUrl: resetUrl.toString() });
    return response({ message: GENERIC_MESSAGE });
  } catch {
    if (reset?.token) await cancelAdminPasswordReset(reset.token).catch(() => {});
    return response({ error: 'Unable to send the reset email right now. Please try again later.' }, 502);
  }
}
