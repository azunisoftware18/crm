'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AppLayout from '@/components/layout/AppLayout'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/components/common/Toast'
import SessionLoading from '@/components/common/SessionLoading'

export default function AuthenticatedAppGate({ children }) {
  const { isAuthenticated, mounted, sessionEnded } = useAuth()
  const router = useRouter()
  const toast = useToast()

  useEffect(() => {
    if (!mounted || isAuthenticated) return
    if (sessionEnded) {
      toast.warning('Session ended', 'For your security, sign in again to continue.')
    }
    router.replace('/login')
  }, [mounted, isAuthenticated, sessionEnded, router, toast])

  if (!mounted || !isAuthenticated) {
    return <SessionLoading title="Opening your workspace" message="Verifying your secure admin session." />
  }

  return <AppLayout>{children}</AppLayout>
}
