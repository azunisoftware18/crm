import { NextResponse } from 'next/server';
import { clearAdminSessionCookie, getAdminSessionFromCookieHeader } from '@/lib/adminAuth';

export async function GET(request) {
  const session = getAdminSessionFromCookieHeader(request.headers.get('cookie'));
  if (!session) {
    const response = NextResponse.json(
      { error: 'Not authenticated.' },
      { status: 401, headers: { 'Cache-Control': 'no-store' } },
    );
    return clearAdminSessionCookie(response);
  }

  return NextResponse.json(
    session,
    { headers: { 'Cache-Control': 'no-store' } },
  );
}
