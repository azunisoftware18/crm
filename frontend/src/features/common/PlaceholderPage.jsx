'use client'

import { usePathname } from 'next/navigation'
import { Hammer } from 'lucide-react'
import { findRoute } from '@/routes/routeConfig'
import { STATUS_SETS } from '@/config/statusConfig'
import { ROLE_META } from '@/config/roles'
import { PageHeader, StatusBadge } from '@/components/common'

const PHASES = {
  2: 'Phase 2 · Dashboard and CRM', 3: 'Phase 3 · Sales and approvals', 4: 'Phase 4 · Purchase', 5: 'Phase 5 · Inventory',
  6: 'Phase 6 · Manufacturing', 7: 'Phase 7 · Dispatch and returns', 8: 'Phase 8 · Payments and accounting',
  9: 'Phase 9 · Notifications, tasks and reports', 10: 'Phase 10 · Administration',
};

/** Stands in for every screen not yet built. Shows what the screen is for, who may open it and its statuses. */
export default function PlaceholderPage() {
  const pathname = usePathname();
  const route = findRoute(pathname);
  if (!route) return null;
  const statuses = route.statusKey ? STATUS_SETS[route.statusKey] : null;

  return (
    <>
      <PageHeader title={route.title} subtitle={route.desc} />
      <div className="card overflow-hidden">
        <div className="flex items-start gap-4 border-b border-slate-200 bg-amber-50/60 px-6 py-4">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-700"><Hammer className="h-5 w-5" /></span>
          <div>
            <p className="text-sm font-semibold text-slate-900">This screen is planned for {PHASES[route.phase]}</p>
            <p className="mt-0.5 text-sm text-slate-600">The route, access rules and navigation are already wired. The working screen replaces this page.</p>
          </div>
        </div>
        <dl className="grid gap-6 px-6 py-5 md:grid-cols-2">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wider text-slate-500">Roles with access</dt>
            <dd className="mt-2 flex flex-wrap gap-1.5">
              {route.roles.map((r) => (
                <span key={r} className={`rounded-md px-2 py-0.5 text-xs font-semibold ${ROLE_META[r].tone}`}>{ROLE_META[r].short}</span>
              ))}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wider text-slate-500">Route</dt>
            <dd className="mt-2"><code className="rounded bg-slate-100 px-2 py-1 text-xs text-slate-700">{route.path}</code></dd>
          </div>
          {statuses && (
            <div className="md:col-span-2">
              <dt className="text-xs font-semibold uppercase tracking-wider text-slate-500">Workflow statuses (from the requirement spec)</dt>
              <dd className="mt-2 flex flex-wrap gap-2">{statuses.map((s) => <StatusBadge key={s} status={s} />)}</dd>
            </div>
          )}
        </dl>
      </div>
    </>
  );
}



