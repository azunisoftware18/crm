'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AlertCircle, ArrowRight, Database, RotateCw } from 'lucide-react'
import { cn } from '@/utils/cn'
import { useAuth } from '@/context/AuthContext'
import { useNotifications } from '@/context/NotificationContext'
import { ROLE_META } from '@/config/roles'
import { canAccessPath } from '@/routes/routeConfig'
import { getDashboardSummary } from '@/services/reportApi'
import { Button, EmptyState, KpiCard, LoadingSkeleton, PageHeader, Tabs } from '@/components/common'
import NotificationItem from '@/components/notifications/NotificationItem'

// Business flow from the brief, each step linked to the screen that owns it.
const FLOW = [
  { label: 'Lead', path: '/crm/leads' },
  { label: 'Customer', path: '/crm/customers' },
  { label: 'Quotation', path: '/sales/quotations' },
  { label: 'Proforma Invoice', path: '/sales/proforma-invoices' },
  { label: 'Stock Check', path: '/inventory' },
  { label: 'Purchase', path: '/purchase/requests' },
  { label: 'GRN', path: '/inventory/grn' },
  { label: 'Manufacturing', path: '/manufacturing/production' },
  { label: 'Dispatch', path: '/dispatch' },
  { label: 'Payment', path: '/payments' },
  { label: 'Accounting', path: '/accounting' },
]

export default function DashboardPage() {
  const { user, role } = useAuth()
  const router = useRouter()
  const { items, loading: notifLoading, markRead } = useNotifications()
  const [summary, setSummary] = useState({ role: null, status: 'loading', data: null, error: null })
  const [retryKey, setRetryKey] = useState(0)
  const [tab, setTab] = useState('action')

  useEffect(() => {
    let cancelled = false
    getDashboardSummary(role)
      .then((data) => {
        if (!cancelled) setSummary({ role, status: 'success', data, error: null })
      })
      .catch(() => {
        if (!cancelled) setSummary({ role, status: 'error', data: null, error: 'Dashboard figures could not be loaded. Try again in a moment.' })
      })
    return () => { cancelled = true }
  }, [role, retryKey])

  const groups = useMemo(() => ({
    action: items.filter((n) => n.actionRequired),
    info: items.filter((n) => !n.actionRequired),
    all: items,
  }), [items])

  const tabs = [
    { key: 'action', label: 'Action required', count: groups.action.length },
    { key: 'info', label: 'Information', count: groups.info.length },
    { key: 'all', label: 'All', count: groups.all.length },
  ]

  const openNotification = (notification) => {
    markRead(notification.id)
    router.push(notification.link)
  }

  const activeSummary = summary.role === role ? summary : null
  const loadingSummary = !activeSummary || activeSummary.status === 'loading'
  const kpis = activeSummary?.status === 'success' ? activeSummary.data : null
  const summaryError = activeSummary?.status === 'error' ? activeSummary.error : null
  const shown = groups[tab]

  return (
    <>
      <PageHeader
        title={`Welcome, ${(user?.name || 'Administrator').split(' ')[0]}`}
        subtitle={`You're signed in as ${ROLE_META[role]?.label || 'Administrator'}. Here's your workspace overview.`}
      />

      <section aria-label="Dashboard figures" className="mb-6">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">Operational overview</h2>
            <p className="mt-0.5 text-xs text-slate-500">A quick view of the areas configured for your role.</p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-800">
            <Database className="h-3.5 w-3.5" aria-hidden="true" /> Sample data
          </span>
        </div>
        <p className="mb-3 rounded-lg border border-amber-200/80 bg-amber-50/70 px-3.5 py-2.5 text-xs leading-5 text-amber-900">
          These figures are sample preview values and are not connected to live ERP records.
        </p>

        {summaryError ? (
          <div role="alert" className="flex flex-col items-start gap-3 rounded-xl border border-red-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" aria-hidden="true" />
              <div>
                <p className="text-sm font-semibold text-slate-900">Unable to load dashboard figures</p>
                <p className="mt-0.5 text-sm text-slate-600">{summaryError}</p>
              </div>
            </div>
            <Button variant="secondary" size="sm" icon={RotateCw} onClick={() => setRetryKey((key) => key + 1)}>Try again</Button>
          </div>
        ) : loadingSummary ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Loading dashboard figures" aria-busy="true">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="card h-[132px] animate-pulse bg-white p-5">
                <div className="h-3 w-28 rounded bg-slate-100" />
                <div className="mt-4 h-7 w-24 rounded bg-slate-100" />
                <div className="mt-4 h-3 w-36 rounded bg-slate-100" />
              </div>
            ))}
          </div>
        ) : kpis?.length ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {kpis.map((kpi) => <KpiCard key={kpi.label} {...kpi} className="min-h-[132px] p-5 transition-shadow hover:shadow-md" />)}
          </div>
        ) : (
          <div className="card"><EmptyState title="No overview figures yet" description="Dashboard figures will appear here when available for this role." /></div>
        )}
      </section>

      <section aria-label="Notifications" className="card mt-6 overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-5 py-4 sm:px-6">
          <div>
            <h2 className="text-base font-semibold text-slate-900">Notifications</h2>
            <p className="mt-0.5 text-xs text-slate-500">Action-required items are separated from information-only updates.</p>
          </div>
          <Link href="/notifications" className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-sm font-medium text-brand-700 hover:bg-brand-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500">
            View all <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>
        <Tabs tabs={tabs} value={tab} onChange={setTab} className="px-3 sm:px-4" />
        <div className="max-h-[440px] divide-y divide-slate-100 overflow-y-auto scroll-thin">
          {notifLoading ? (
            <div className="p-5"><LoadingSkeleton rows={4} /></div>
          ) : shown.length === 0 ? (
            <EmptyState title="Nothing in this tab" description="You have no notifications of this kind right now." />
          ) : (
            shown.map((notification) => <NotificationItem key={notification.id} notification={notification} onOpen={openNotification} />)
          )}
        </div>
      </section>

      <section aria-label="Business workflow" className="card mt-6 p-5 sm:p-6">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-base font-semibold text-slate-900">Business workflow</h2>
            <p className="mt-0.5 text-xs text-slate-500">Move from lead through fulfillment and accounting.</p>
          </div>
          <span className="text-xs text-slate-400">Steps outside your role are muted</span>
        </div>
        <ol className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-3">
          {FLOW.map((step, index) => {
            const allowed = canAccessPath(role, step.path)
            return (
              <li key={step.label} className="flex items-center gap-2">
                {allowed ? (
                  <Link href={step.path} className="rounded-lg border border-brand-200 bg-brand-50 px-3 py-2 text-xs font-semibold text-brand-800 transition-colors hover:border-brand-300 hover:bg-brand-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500">
                    {step.label}
                  </Link>
                ) : (
                  <span className={cn('rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-400')}>{step.label}</span>
                )}
                {index < FLOW.length - 1 && <ArrowRight className="h-3.5 w-3.5 text-slate-300" aria-hidden="true" />}
              </li>
            )
          })}
        </ol>
      </section>
    </>
  )
}
