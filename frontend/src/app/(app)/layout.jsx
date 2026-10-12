import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { connection } from 'next/server'
import AuthenticatedAppGate from '@/components/layout/AuthenticatedAppGate'
import { getServerAdminSession } from '@/lib/adminAuth'

export default function AppLayoutWrapper({ children }) {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-slate-50 text-sm text-slate-500">Checking your session…</div>}>
      <AuthenticatedSection>{children}</AuthenticatedSection>
    </Suspense>
  )
}

async function AuthenticatedSection({ children }) {
  await connection()
  const session = await getServerAdminSession()
  if (!session) redirect('/login')

  return <AuthenticatedAppGate>{children}</AuthenticatedAppGate>
}
