'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, LockKeyhole, UserRound } from 'lucide-react'
import { Button, FormField, Input } from '@/components/common'
import Logo from '@/components/layout/Logo'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/components/common/Toast'
import ForgotPasswordModal from './ForgotPasswordModal'

const DEVELOPMENT_DEMO_CREDENTIALS = process.env.NODE_ENV === 'development'
  ? { identifier: 'demo.admin', password: 'Demo@12345' }
  : { identifier: '', password: '' }

const schema = z.object({
  identifier: z.string().trim().min(1, 'Enter your username, email or phone number.').max(254, 'This sign-in ID is too long.'),
  password: z.string().min(1, 'Enter your password.').max(1024, 'Password is too long.'),
})

export default function LoginForm() {
  const { login } = useAuth()
  const toast = useToast()
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [serverError, setServerError] = useState('')
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false)
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('')
  const submissionInProgress = useRef(false)
  const { register, handleSubmit, getValues, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: DEVELOPMENT_DEMO_CREDENTIALS,
  })

  const submit = async (values) => {
    setServerError('')
    try {
      const user = await login(values)
      toast.success('Signed in', `Welcome, ${user.name}.`)
      router.replace('/dashboard')
      router.refresh()
    } catch (error) {
      if (error.status === 401 || error.status === 400) {
        setServerError(error.message || 'Invalid username or password.')
      } else if (error.status >= 500) {
        setServerError('The sign-in service is temporarily unavailable. Please try again shortly.')
      } else if (!error.status) {
        setServerError('Unable to reach the sign-in service. Check your connection and try again.')
      } else {
        setServerError(error.message || 'Unable to sign in. Please try again.')
      }
    }
  }

  const submitForm = async (event) => {
    if (submissionInProgress.current) {
      event.preventDefault()
      return
    }
    submissionInProgress.current = true
    try {
      await handleSubmit(submit)(event)
    } finally {
      submissionInProgress.current = false
    }
  }

  const openForgotPassword = () => {
    const identifier = getValues('identifier')?.trim() || ''
    setForgotPasswordEmail(identifier.includes('@') ? identifier : '')
    setForgotPasswordOpen(true)
  }

  return (
    <div className="min-h-screen bg-[#f6f8fc] lg:grid lg:grid-cols-[minmax(0,0.96fr)_minmax(0,1.04fr)]">
      <aside className="hidden min-h-screen flex-col justify-between bg-gradient-to-br from-[#101a2d] to-[#192a49] px-10 py-9 text-slate-300 lg:flex xl:px-16 xl:py-12">
        <div className="relative flex items-center">
          <Logo dark />
        </div>

        <div className="w-full max-w-xl py-12">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-300">SHREE NATH · BUSINESS WORKSPACE</p>
          <h2 className="mt-5 max-w-lg text-[2.65rem] font-semibold leading-[1.1] tracking-tight text-white xl:text-5xl">
            Your workday,<br />all in one place.
          </h2>
          <p className="mt-5 max-w-lg text-sm leading-7 text-slate-400">
            Sign in to access the tools and information your team uses every day.
          </p>
          <div className="mt-8 h-px w-16 bg-blue-400/70" aria-hidden="true" />
        </div>

        <div className="relative flex items-center justify-between gap-4 border-t border-white/10 pt-5 text-[11px] text-slate-500">
          <span>SHREE NATH EXPORTS · ERP</span>
          <span>Authorized team members</span>
        </div>
      </aside>

      <main className="flex min-h-screen items-center justify-center bg-[#f5f7fb] px-5 py-10 sm:px-8 lg:px-10 xl:px-16">
        <div className="relative w-full max-w-[452px]">
          <div className="relative overflow-hidden rounded-[1.35rem] border border-slate-200/80 bg-white p-6 shadow-[0_24px_75px_-35px_rgba(15,23,42,0.3)] sm:p-9">
            <span className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-blue-900 via-blue-700 to-sky-400" aria-hidden="true" />
            <div className="mb-8">
              <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
                <Logo />
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50/70 px-3 py-1.5 text-[11px] font-semibold text-emerald-800">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Secure sign-in
                </span>
              </div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-800">Administrator access</p>
              <h1 className="mt-2 text-[1.8rem] font-semibold tracking-tight text-slate-950">Welcome Back</h1>
              <p className="mt-2 text-sm leading-6 text-slate-500">Sign in to access your admin dashboard.</p>
            </div>

            <form onSubmit={submitForm} noValidate className="space-y-5">
              <FormField label="Username, email or phone number" htmlFor="identifier" error={errors.identifier?.message} required>
                <Input
                  id="identifier"
                  type="text"
                  required
                  autoComplete="username"
                  autoCapitalize="none"
                  spellCheck={false}
                  placeholder="Enter username, email or phone number"
                  icon={UserRound}
                  error={errors.identifier}
                  disabled={isSubmitting}
                  className="h-11 bg-slate-50/70 focus:border-blue-500 focus:bg-white focus:ring-blue-500/20"
                  {...register('identifier')}
                />
              </FormField>

              <FormField label="Password" htmlFor="password" error={errors.password?.message} required>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    icon={LockKeyhole}
                    error={errors.password}
                    disabled={isSubmitting}
                    className="h-11 bg-slate-50/70 pr-11 focus:border-blue-500 focus:bg-white focus:ring-blue-500/20"
                    {...register('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((visible) => !visible)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    aria-pressed={showPassword}
                    disabled={isSubmitting}
                    className="absolute inset-y-0 right-0 flex w-10 items-center justify-center rounded-r-lg text-slate-400 transition-colors hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <div className="mt-2 flex justify-end">
                  <button type="button" onClick={openForgotPassword} className="text-sm font-medium text-blue-700 underline-offset-4 transition-colors hover:text-blue-900 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2">
                    Forgot password?
                  </button>
                </div>
              </FormField>

              {serverError && (
                <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-3 text-sm leading-5 text-red-700">
                  {serverError}
                </p>
              )}

              <Button type="submit" size="lg" className="mt-1 h-12 w-full bg-blue-700 text-white hover:bg-blue-800 focus-visible:ring-blue-600" loading={isSubmitting} aria-busy={isSubmitting}>
                {isSubmitting ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

          </div>
        </div>
      </main>
      {forgotPasswordOpen && (
        <ForgotPasswordModal
          open={forgotPasswordOpen}
          initialEmail={forgotPasswordEmail}
          onClose={() => setForgotPasswordOpen(false)}
        />
      )}
    </div>
  )
}
