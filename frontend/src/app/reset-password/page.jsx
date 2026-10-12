import { Suspense } from 'react'
import ResetPasswordPageContent from '@/features/auth/ResetPasswordPageContent'
import SessionLoading from '@/components/common/SessionLoading'

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<SessionLoading title="Opening password reset" message="Preparing your secure reset form." />}>
      <ResetPasswordPageContent />
    </Suspense>
  )
}
