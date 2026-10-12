import { NextResponse } from 'next/server'
import { ADMIN_AVATAR_ENDPOINT } from '@/config/profile'
import { getAdminSessionFromCookieHeader, getConfiguredAdminAvatarUrl } from '@/lib/adminAuth'
import { getAdminAvatar, saveAdminAvatar } from '@/lib/adminProfile'

const MAX_AVATAR_BYTES = 2 * 1024 * 1024
const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])

function isSupportedImage(buffer, contentType) {
  if (contentType === 'image/png') return buffer.subarray(0, PNG_SIGNATURE.length).equals(PNG_SIGNATURE)
  if (contentType === 'image/jpeg') return buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff
  return contentType === 'image/webp' && buffer.length >= 12 && buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP'
}

function imageResponse(buffer, contentType) {
  return new Response(buffer, {
    headers: {
      'Cache-Control': 'private, no-store',
      'Content-Type': contentType,
      'X-Content-Type-Options': 'nosniff',
    },
  })
}

export async function GET(request) {
  const session = getAdminSessionFromCookieHeader(request.headers.get('cookie'))
  if (!session) return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 })

  try {
    const avatar = await getAdminAvatar(session.user.id)
    if (avatar) return imageResponse(avatar.buffer, avatar.contentType)
    const fallbackPath = getConfiguredAdminAvatarUrl(session.user.id) || '/user-avatar.svg'
    return new Response(null, {
      status: 302,
      headers: {
        'Cache-Control': 'private, no-store',
        Location: new URL(fallbackPath, request.url).toString(),
      },
    })
  } catch {
    return NextResponse.json({ error: 'Unable to load the profile image.' }, { status: 500 })
  }
}

export async function POST(request) {
  const session = getAdminSessionFromCookieHeader(request.headers.get('cookie'))
  if (!session) return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 })

  const contentLength = Number(request.headers.get('content-length') || 0)
  if (contentLength > MAX_AVATAR_BYTES + 64 * 1024) {
    return NextResponse.json({ error: 'Choose an image smaller than 2 MB.' }, { status: 413 })
  }

  let formData
  try {
    formData = await request.formData()
  } catch {
    return NextResponse.json({ error: 'Choose a PNG, JPG, or WebP image.' }, { status: 400 })
  }

  const file = formData.get('avatar')
  if (!file || typeof file.arrayBuffer !== 'function' || !file.size) {
    return NextResponse.json({ error: 'Choose an image to upload.' }, { status: 400 })
  }
  if (file.size > MAX_AVATAR_BYTES) {
    return NextResponse.json({ error: 'Choose an image smaller than 2 MB.' }, { status: 413 })
  }
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
    return NextResponse.json({ error: 'Use a PNG, JPG, or WebP image.' }, { status: 415 })
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer())
    if (!isSupportedImage(buffer, file.type)) {
      return NextResponse.json({ error: 'The selected file is not a valid image.' }, { status: 415 })
    }
    await saveAdminAvatar(session.user.id, buffer, file.type)
    return NextResponse.json(
      { avatarUrl: `${ADMIN_AVATAR_ENDPOINT}?v=${Date.now()}` },
      { headers: { 'Cache-Control': 'no-store' } },
    )
  } catch {
    return NextResponse.json({ error: 'Unable to save the profile image right now.' }, { status: 500 })
  }
}
