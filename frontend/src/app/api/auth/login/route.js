import { NextResponse } from 'next/server';
import {
  AdminAuthConfigurationError,
  authenticateAdmin,
  createAdminSession,
  setAdminSessionCookie,
} from '@/lib/adminAuth';

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Enter a valid username, email or phone number and password.' }, { status: 400 });
  }

  const identifier = body?.identifier ?? body?.username;
  const { password } = body || {};
  if (
    typeof identifier !== 'string' ||
    identifier.trim().length < 1 ||
    identifier.trim().length > 254 ||
    typeof password !== 'string' ||
    password.length < 1 ||
    password.length > 1024
  ) {
    return NextResponse.json({ error: 'Enter a valid username, email or phone number and password.' }, { status: 400 });
  }

  try {
    const user = await authenticateAdmin(identifier, password);
    if (!user) return NextResponse.json({ error: 'Invalid username or password.' }, { status: 401 });

    const session = createAdminSession(user);
    const response = NextResponse.json(
      { user, expiresAt: session.expiresAt },
      { headers: { 'Cache-Control': 'no-store' } },
    );
    return setAdminSessionCookie(response, session.token);
  } catch (error) {
    if (error instanceof AdminAuthConfigurationError) {
      return NextResponse.json({ error: error.message }, { status: 503 });
    }
    return NextResponse.json({ error: 'Unable to sign in right now.' }, { status: 500 });
  }
}
