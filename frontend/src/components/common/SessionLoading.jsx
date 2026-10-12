import { LoaderCircle, ShieldCheck } from 'lucide-react'

export default function SessionLoading({ title = 'Checking your secure session', message = 'This should only take a moment.' }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div role="status" aria-live="polite" aria-busy="true" className="flex w-full max-w-sm items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_12px_40px_-24px_rgba(15,23,42,0.22)]">
        <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
          <ShieldCheck className="h-5 w-5" aria-hidden="true" />
          <LoaderCircle className="absolute -right-1 -top-1 h-4 w-4 animate-spin text-brand-600 motion-reduce:animate-none" aria-hidden="true" />
        </span>
        <span className="min-w-0">
          <span className="block text-sm font-semibold text-slate-900">{title}</span>
          <span className="mt-1 block text-xs leading-5 text-slate-500">{message}</span>
        </span>
      </div>
    </div>
  )
}
