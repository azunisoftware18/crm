import { NextResponse } from 'next/server';
import { clearAdminSessionCookie, getAdminSessionFromCookieHeader } from '@/lib/adminAuth';
import { changeAdminPassword } from '@/lib/adminPasswordReset';

function response(body, status = 200) {
  return NextResponse.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
}

export async function POST(request) {
  const session = getAdminSessionFromCookieHeader(request.headers.get('cookie'));
  if (!session) return response({ error: 'Sign in again to change your password.' }, 401);
  if (!['admin', 'admin-demo'].includes(session.user.id)) {
    return response({ error: 'Password changes are unavailable for this preview session.' }, 403);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return response({ error: 'Enter your current password and a valid new password.' }, 400);
  }

  const { currentPassword, newPassword, confirmPassword } = body || {};
  if (typeof currentPassword !== 'string' || currentPassword.length < 1 || currentPassword.length > 1024) {
    return response({ error: 'Enter your current password.' }, 400);
  }
  if (typeof newPassword !== 'string' || newPassword.length < 10 || newPassword.length > 1024) {
    return response({ error: 'Use a new password with at least 10 characters.' }, 400);
  }
  if (newPassword !== confirmPassword) {
    return response({ error: 'The new password and confirmation do not match.' }, 400);
  }

  try {
    const result = await changeAdminPassword(session.user.id, currentPassword, newPassword);
    if (result.status === 'invalid-current-password') {
      return response({ error: 'Your current password is incorrect.' }, 400);
    }
    if (result.status === 'credentials-changed') {
      return response({ error: 'Your password changed in another request. Sign in again and retry.' }, 409);
    }
    if (result.status === 'not-configured') {
      return response({ error: 'Password changes are not configured for this account.' }, 503);
    }
    if (result.status !== 'updated') {
      return response({ error: 'Enter a valid current and new password.' }, 400);
    }

    return clearAdminSessionCookie(response({ message: 'Password changed. Sign in again with your new password.' }));
  } catch {
    return response({ error: 'Unable to change your password right now. Please try again.' }, 500);
  }
}
