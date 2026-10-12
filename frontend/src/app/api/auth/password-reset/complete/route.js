import { NextResponse } from 'next/server';
import { completeAdminPasswordReset } from '@/lib/adminPasswordReset';

function response(body, status = 200) {
  return NextResponse.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return response({ error: 'This reset link is invalid or has expired.' }, 400);
  }

  const { token, password } = body || {};
  if (typeof token !== 'string' || !/^[A-Za-z0-9_-]{43}$/.test(token)) {
    return response({ error: 'This reset link is invalid or has expired.' }, 400);
  }
  if (typeof password !== 'string' || password.length < 10 || password.length > 1024) {
    return response({ error: 'Use a new password with at least 10 characters.' }, 400);
  }

  try {
    const updated = await completeAdminPasswordReset(token, password);
    if (!updated) return response({ error: 'This reset link is invalid or has expired.' }, 400);
    return response({ message: 'Your password has been changed. Sign in with your new password.' });
  } catch {
    return response({ error: 'Unable to reset the password right now. Please try again later.' }, 500);
  }
}
