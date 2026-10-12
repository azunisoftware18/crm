'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { KeyRound, LockKeyhole } from 'lucide-react'
import { Button, Input, Modal } from '@/components/common'
import { useToast } from '@/components/common/Toast'
import { useAuth } from '@/context/AuthContext'
import { changeAdminPassword } from '@/services/authApi'

export default function ChangePasswordModal({ open, onClose }) {
  const { logout } = useAuth()
  const toast = useToast()
  const router = useRouter()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const close = () => {
    if (submitting) return
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
    setError('')
    onClose()
  }

  const submit = async (event) => {
    event.preventDefault()
    setError('')
    if (!currentPassword) {
      setError('Enter your current password.')
      return
    }
    if (newPassword.length < 10) {
      setError('Use a new password with at least 10 characters.')
      return
    }
    if (newPassword !== confirmPassword) {
      setError('The new password and confirmation do not match.')
      return
    }

    setSubmitting(true)
    try {
      await changeAdminPassword({ currentPassword, newPassword, confirmPassword })
      try {
        await logout()
      } catch {
        // The password-change endpoint has already invalidated the current cookie.
      }
      toast.success('Password changed', 'Sign in again with your new password.')
      onClose()
      router.replace('/login')
      router.refresh()
    } catch (requestError) {
      setError(requestError.message || 'Unable to change your password. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal
      open={open}
      onClose={close}
      title="Reset password"
      description="Enter your current password, then choose a new password."
      footer={(
        <>
          <Button type="button" variant="ghost" onClick={close} disabled={submitting}>Cancel</Button>
          <Button type="submit" form="change-password-form" icon={KeyRound} loading={submitting} className="bg-blue-700 text-white hover:bg-blue-800 focus-visible:ring-blue-600">
            Update password
          </Button>
        </>
      )}
    >
      <form id="change-password-form" onSubmit={submit} noValidate className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="current-password" className="block text-sm font-medium text-slate-700">Old password</label>
          <Input
            id="current-password"
            type="password"
            autoComplete="current-password"
            maxLength={1024}
            required
            placeholder="Enter your old password"
            icon={LockKeyhole}
            value={currentPassword}
            onChange={(event) => setCurrentPassword(event.target.value)}
            disabled={submitting}
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="new-password" className="block text-sm font-medium text-slate-700">New password</label>
          <Input
            id="new-password"
            type="password"
            autoComplete="new-password"
            minLength={10}
            maxLength={1024}
            required
            placeholder="At least 10 characters"
            icon={LockKeyhole}
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            disabled={submitting}
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="confirm-new-password" className="block text-sm font-medium text-slate-700">Confirm password</label>
          <Input
            id="confirm-new-password"
            type="password"
            autoComplete="new-password"
            minLength={10}
            maxLength={1024}
            required
            placeholder="Re-enter your new password"
            icon={LockKeyhole}
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            disabled={submitting}
          />
        </div>
        {error && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-3 text-sm leading-5 text-red-700">{error}</p>}
        <p className="text-xs leading-5 text-slate-500">Your new password must contain at least 10 characters. You will need to sign in again after changing it.</p>
      </form>
    </Modal>
  )
}
