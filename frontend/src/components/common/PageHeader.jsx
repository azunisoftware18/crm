'use client'

import Breadcrumb from './Breadcrumb';
import useBreadcrumbs from '@/hooks/useBreadcrumbs';

/** Breadcrumbs default to the current route; pass `breadcrumbs` to override (e.g. record names). */
export default function PageHeader({ title, subtitle, actions, badge, breadcrumbs }) {
  const auto = useBreadcrumbs();
  return (
    <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
      <div className="min-w-0">
        <Breadcrumb items={breadcrumbs || auto} />
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="max-w-full break-words text-xl font-semibold leading-tight tracking-tight text-slate-900 sm:text-2xl">{title}</h1>
          {badge}
        </div>
        {subtitle && <p className="mt-1 max-w-3xl text-sm text-slate-600">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2 md:shrink-0 md:justify-end">{actions}</div>}
    </div>
  );
}


