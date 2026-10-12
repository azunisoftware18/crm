import { randomBytes } from 'node:crypto'
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises'
import path from 'node:path'

const PROFILE_DIRECTORY = path.resolve(
  /*turbopackIgnore: true*/ process.env.ADMIN_PROFILE_STORE_PATH || path.join(process.cwd(), '.private', 'admin-profiles'),
)
const ALLOWED_CONTENT_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])
let writeQueue = Promise.resolve()

function getAvatarPath(userId) {
  if (typeof userId !== 'string' || !/^[a-zA-Z0-9_-]{1,64}$/.test(userId)) {
    throw new Error('Invalid profile identifier.')
  }
  return path.join(PROFILE_DIRECTORY, `${userId}.json`)
}

export async function getAdminAvatar(userId) {
  let raw
  try {
    raw = await readFile(getAvatarPath(userId), 'utf8')
  } catch (error) {
    if (error.code === 'ENOENT') return null
    throw error
  }

  try {
    const stored = JSON.parse(raw)
    if (!ALLOWED_CONTENT_TYPES.has(stored?.contentType) || typeof stored?.image !== 'string') return null
    const buffer = Buffer.from(stored.image, 'base64')
    if (!buffer.length || buffer.toString('base64') !== stored.image) return null
    return { buffer, contentType: stored.contentType }
  } catch {
    return null
  }
}

export async function saveAdminAvatar(userId, buffer, contentType) {
  if (!ALLOWED_CONTENT_TYPES.has(contentType) || !Buffer.isBuffer(buffer) || !buffer.length) {
    throw new Error('Invalid profile image.')
  }

  const operation = writeQueue.then(async () => {
    await mkdir(PROFILE_DIRECTORY, { recursive: true, mode: 0o700 })
    const avatarPath = getAvatarPath(userId)
    const temporaryPath = `${avatarPath}.${randomBytes(8).toString('hex')}.tmp`
    await writeFile(temporaryPath, JSON.stringify({ contentType, image: buffer.toString('base64') }), {
      encoding: 'utf8',
      mode: 0o600,
      flag: 'wx',
    })
    await rename(temporaryPath, avatarPath)
  })
  writeQueue = operation.catch(() => {})
  return operation
}
