import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import LoginForm from '@/features/auth/LoginForm'
import { getServerAdminSession } from '@/lib/adminAuth'
import SessionLoading from '@/components/common/SessionLoading'

export default function LoginPage() {
  return <Suspense fallback={<SessionLoading title="Preparing secure sign-in" message="Checking whether you already have an active session." />}><LoginPageContent /></Suspense>
}

async function LoginPageContent() {
  const session = await getServerAdminSession()
  if (session) redirect('/dashboard')
  return <LoginForm />
}
