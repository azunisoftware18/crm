import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { getServerAdminSession } from '@/lib/adminAuth'

export default function Home() {
  return <Suspense fallback={<p className="p-8 text-sm text-slate-500">Checking your session…</p>}><HomeRedirect /></Suspense>
}

async function HomeRedirect() {
  const session = await getServerAdminSession()
  redirect(session ? '/dashboard' : '/login')
}
