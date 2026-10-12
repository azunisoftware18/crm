'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import * as authApi from '@/services/authApi'
import { ADMIN_AVATAR_ENDPOINT } from '@/config/profile'
import { ROLE_META } from '@/config/roles'

const AuthContext = createContext(null)
const DEV_ADMIN_PREVIEW = process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_DEV_ADMIN_PREVIEW === 'true'
const DEV_PREVIEW_NAMES = {
  sales: 'Aarav Mehta',
  manager: 'Local Manager',
  purchase: 'Local Purchase',
  plant: 'Local Plant',
  accounts: 'Local Accounts',
  dispatch: 'Local Dispatch',
  admin: 'Local Administrator',
}

function createDevPreviewSession(role = 'sales') {
  const selectedRole = Object.hasOwn(ROLE_META, role) ? role : 'sales'
  return {
    user: {
      id: `${selectedRole}-preview`,
      name: DEV_PREVIEW_NAMES[selectedRole],
      email: `${selectedRole}@preview.local`,
      role: selectedRole,
      avatarUrl: ADMIN_AVATAR_ENDPOINT,
    },
    expiresAt: null,
  }
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(DEV_ADMIN_PREVIEW ? createDevPreviewSession() : null)
  const [mounted, setMounted] = useState(DEV_ADMIN_PREVIEW)
  const [sessionEnded, setSessionEnded] = useState(false)
  const authChangeVersion = useRef(0)
  const user = session?.user ?? null

  useEffect(() => {
    if (DEV_ADMIN_PREVIEW) return undefined

    let active = true
    const versionAtStart = authChangeVersion.current
    try {
      // Remove the previous demo's forgeable localStorage session during migration.
      localStorage.removeItem('sne.session')
    } catch {
      // Storage may be unavailable in privacy-restricted browsers.
    }

    authApi.getSession()
      .then((currentSession) => {
        if (active && authChangeVersion.current === versionAtStart) setSession(currentSession)
      })
      .catch(() => {
        if (active && authChangeVersion.current === versionAtStart) setSession(null)
      })
      .finally(() => {
        if (active) setMounted(true)
      })

    return () => { active = false }
  }, [])

  useEffect(() => {
    if (!session?.expiresAt) return undefined
    const timeout = window.setTimeout(() => {
      authChangeVersion.current += 1
      setSession(null)
      setSessionEnded(true)
    }, Math.max(0, session.expiresAt - Date.now()))
    return () => window.clearTimeout(timeout)
  }, [session])

  useEffect(() => {
    if (DEV_ADMIN_PREVIEW || !mounted || !session) return undefined

    let active = true
    let checking = false
    const checkSession = async () => {
      if (checking || document.visibilityState === 'hidden') return
      checking = true
      try {
        const latestSession = await authApi.getSession()
        if (!active) return
        if (!latestSession) {
          authChangeVersion.current += 1
          setSession(null)
          setSessionEnded(true)
          return
        }
        setSession((current) => current?.expiresAt === latestSession.expiresAt ? current : latestSession)
      } catch {
        // Keep the current UI session during transient connectivity failures.
      } finally {
        checking = false
      }
    }

    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') checkSession()
    }
    window.addEventListener('focus', checkSession)
    document.addEventListener('visibilitychange', onVisibilityChange)
    return () => {
      active = false
      window.removeEventListener('focus', checkSession)
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [mounted, session])

  const login = useCallback(async (credentials) => {
    const nextSession = await authApi.login(credentials)
    authChangeVersion.current += 1
    setSessionEnded(false)
    setSession(nextSession)
    return nextSession.user
  }, [])

  const logout = useCallback(async () => {
    await authApi.logout()
    authChangeVersion.current += 1
    setSessionEnded(false)
    setSession(null)
  }, [])

  const switchPreviewRole = useCallback((nextRole) => {
    if (!DEV_ADMIN_PREVIEW || !Object.hasOwn(ROLE_META, nextRole)) return
    setSession(createDevPreviewSession(nextRole))
  }, [])

  const updateProfileAvatar = useCallback((avatarUrl) => {
    setSession((current) => current ? { ...current, user: { ...current.user, avatarUrl } } : current)
  }, [])

  const value = useMemo(
    () => ({
      user,
      role: user?.role ?? null,
      isAuthenticated: !!user,
      isPreviewMode: DEV_ADMIN_PREVIEW,
      sessionExpiresAt: session?.expiresAt ?? null,
      sessionEnded,
      login,
      logout,
      switchPreviewRole,
      updateProfileAvatar,
      mounted,
    }),
    [user, session?.expiresAt, sessionEnded, login, logout, switchPreviewRole, updateProfileAvatar, mounted],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
