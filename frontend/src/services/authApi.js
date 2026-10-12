async function requestJson(path, options = {}) {
  const response = await fetch(path, {
    ...options,
    credentials: 'same-origin',
    cache: 'no-store',
    headers: { 'Content-Type': 'application/json', ...options.headers },
  })
  const payload = await response.json().catch(() => ({}))
  if (!response.ok) {
    const error = new Error(payload.error || 'The request could not be completed.')
    error.status = response.status
    throw error
  }
  return payload
}

export async function login({ identifier, username, password }) {
  return requestJson('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ identifier: identifier ?? username, password }),
  })
}

export async function getSession() {
  const response = await fetch('/api/auth/session', {
    credentials: 'same-origin',
    cache: 'no-store',
  })
  if (response.status === 401) return null
  const payload = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(payload.error || 'Unable to check the admin session.')
  return payload
}

export async function logout() {
  return requestJson('/api/auth/logout', { method: 'POST' })
}

export async function uploadAdminAvatar(file) {
  const formData = new FormData()
  formData.append('avatar', file)
  const response = await fetch('/api/auth/profile/avatar', {
    method: 'POST',
    credentials: 'same-origin',
    cache: 'no-store',
    body: formData,
  })
  const payload = await response.json().catch(() => ({}))
  if (!response.ok) {
    const error = new Error(payload.error || 'Unable to update the profile image.')
    error.status = response.status
    throw error
  }
  return payload
}

export async function requestAdminPasswordReset(email) {
  return requestJson('/api/auth/password-reset/request', {
    method: 'POST',
    body: JSON.stringify({ email }),
  })
}

export async function completeAdminPasswordReset({ token, password }) {
  return requestJson('/api/auth/password-reset/complete', {
    method: 'POST',
    body: JSON.stringify({ token, password }),
  })
}

export async function changeAdminPassword({ currentPassword, newPassword, confirmPassword }) {
  return requestJson('/api/auth/password-change', {
    method: 'POST',
    body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
  })
}
