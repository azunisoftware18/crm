'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Eye, EyeOff, LockKeyhole, ShieldCheck } from 'lucide-react'
import { Button, Input } from '@/components/common'
import Logo from '@/components/layout/Logo'
import { completeAdminPasswordReset } from '@/services/authApi'

export default function ResetPasswordForm({ token }) {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [completed, setCompleted] = useState(false)

  const submit = async (event) => {
    event.preventDefault()
    setError('')
    if (password.length < 10) {
      setError('Use a password with at least 10 characters.')
      return
    }
    if (password !== confirmPassword) {
      setError('The passwords do not match.')
      return
    }

    setSubmitting(true)
    try {
      await completeAdminPasswordReset({ token, password })
      setCompleted(true)
      setPassword('')
      setConfirmPassword('')
    } catch (requestError) {
      setError(requestError.message || 'Unable to reset the password. Please request a new link.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f5f7fb] px-4 py-8 sm:px-6">
      <section className="w-full max-w-md overflow-hidden rounded-[1.35rem] border border-slate-200/80 bg-white shadow-[0_24px_75px_-35px_rgba(15,23,42,0.3)]">
        <div className="h-[3px] bg-gradient-to-r from-blue-900 via-blue-700 to-sky-400" aria-hidden="true" />
        <div className="p-6 sm:p-9">
          <Logo />
          <div className="mb-6 mt-8 flex h-12 w-12 items-center justify-center rounded-xl bg-[#172746] text-blue-200 shadow-sm">
            <ShieldCheck className="h-5 w-5" aria-hidden="true" />
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-800">Admin password</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
            {completed ? 'Password updated' : 'Choose a new password'}
          </h1>

          {completed ? (
            <div className="mt-5 space-y-4">
              <p role="status" className="text-sm leading-6 text-slate-600">Your password has been changed. You can now sign in with the new password.</p>
              <Link href="/login" className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-blue-700 px-5 text-sm font-medium text-white transition-colors hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2">
                Go to sign in
              </Link>
            </div>
          ) : !token ? (
            <div className="mt-5 space-y-4">
              <p role="alert" className="text-sm leading-6 text-slate-600">This reset link is missing or invalid. Request a new one from the sign-in page.</p>
              <Link href="/login" className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-blue-700 px-5 text-sm font-medium text-white transition-colors hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2">
                Back to sign in
              </Link>
            </div>
          ) : (
            <form onSubmit={submit} className="mt-5 space-y-4">
              <label htmlFor="new-password" className="block text-sm font-medium text-slate-700">New password</label>
              <div className="relative">
                <Input
                  id="new-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  minLength={10}
                  maxLength={1024}
                  required
                  placeholder="At least 10 characters"
                  icon={LockKeyhole}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  disabled={submitting}
                  className="pr-11"
                />
                <button type="button" onClick={() => setShowPassword((current) => !current)} aria-label={showPassword ? 'Hide new password' : 'Show new password'} aria-pressed={showPassword} className="absolute inset-y-0 right-0 flex w-10 items-center justify-center rounded-r-lg text-slate-400 hover:text-slate-700">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              <label htmlFor="confirm-new-password" className="block text-sm font-medium text-slate-700">Confirm new password</label>
              <div className="relative">
                <Input
                  id="confirm-new-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  minLength={10}
                  maxLength={1024}
                  required
                  placeholder="Re-enter your new password"
                  icon={LockKeyhole}
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  disabled={submitting}
                  className="pr-11"
                />
                <button type="button" onClick={() => setShowConfirmPassword((current) => !current)} aria-label={showConfirmPassword ? 'Hide confirmation password' : 'Show confirmation password'} aria-pressed={showConfirmPassword} className="absolute inset-y-0 right-0 flex w-10 items-center justify-center rounded-r-lg text-slate-400 hover:text-slate-700">
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              {error && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-3 text-sm leading-5 text-red-700">{error}</p>}
              <p className="text-xs leading-5 text-slate-500">Use at least 10 characters. Your current sessions will be signed out.</p>
              <Button type="submit" size="lg" className="h-12 w-full bg-blue-700 text-white hover:bg-blue-800 focus-visible:ring-blue-600" loading={submitting} aria-busy={submitting}>
                {submitting ? 'Updating password...' : 'Update password'}
              </Button>
            </form>
          )}
        </div>
      </section>
    </main>
  )
}
