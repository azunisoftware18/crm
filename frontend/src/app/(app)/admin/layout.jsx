import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { getServerAdminSession } from '@/lib/adminAuth'

export default function AdminLayout({ children }) {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-slate-50 text-sm text-slate-500">Checking admin access…</div>}>
      <AdminSection>{children}</AdminSection>
    </Suspense>
  )
}

async function AdminSection({ children }) {
  const session = await getServerAdminSession()
  if (!session) redirect('/login')
  if (session.user.role !== 'admin') redirect('/dashboard')
  return children
}
