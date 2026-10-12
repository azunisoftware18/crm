'use client'

import { useState } from 'react'
import { Mail } from 'lucide-react'
import { Button, Input, Modal } from '@/components/common'
import { requestAdminPasswordReset } from '@/services/authApi'

export default function ForgotPasswordModal({ open, onClose, initialEmail = '', title = 'Forgot password?', successButtonLabel = 'Back to sign in' }) {
  const [email, setEmail] = useState(initialEmail)
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const close = () => {
    if (submitting) return
    setError('')
    setSent(false)
    onClose()
  }

  const submit = async (event) => {
    event.preventDefault()
    setError('')
    const normalizedEmail = email.trim()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setError('Enter a valid email address.')
      return
    }

    setSubmitting(true)
    try {
      await requestAdminPasswordReset(normalizedEmail)
      setSent(true)
    } catch (requestError) {
      setError(requestError.message || 'Unable to send a reset email right now.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal
      open={open}
      onClose={close}
      title={title}
      description="We’ll email you a secure, one-time link to choose a new password."
      footer={sent ? (
        <Button type="button" onClick={close}>{successButtonLabel}</Button>
      ) : (
        <>
          <Button type="button" variant="ghost" onClick={close} disabled={submitting}>Cancel</Button>
          <Button type="submit" form="forgot-password-form" loading={submitting} className="bg-blue-700 text-white hover:bg-blue-800 focus-visible:ring-blue-600">
            Send reset link
          </Button>
        </>
      )}
    >
      {sent ? (
        <p role="status" className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-6 text-emerald-800">
          If that email belongs to the admin account, password reset instructions are on their way.
        </p>
      ) : (
        <form id="forgot-password-form" onSubmit={submit} noValidate className="space-y-3">
          <label htmlFor="reset-email" className="block text-sm font-medium text-slate-700">Admin email</label>
          <Input
            id="reset-email"
            type="email"
            autoComplete="email"
            autoCapitalize="none"
            spellCheck={false}
            required
            maxLength={254}
            placeholder="Enter your admin email"
            icon={Mail}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            disabled={submitting}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? 'reset-email-error' : 'reset-email-help'}
          />
          {error ? (
            <p id="reset-email-error" role="alert" className="text-sm text-red-700">{error}</p>
          ) : (
            <p id="reset-email-help" className="text-xs leading-5 text-slate-500">The reset link expires after 20 minutes.</p>
          )}
        </form>
      )}
    </Modal>
  )
}
