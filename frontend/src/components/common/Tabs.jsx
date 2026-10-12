import { cn } from '@/utils/cn';

/** Controlled tab bar. tabs: [{ key, label, count? }]. The caller renders the active panel. */
export default function Tabs({ tabs, value, onChange, className }) {
  return (
    <div role="tablist" className={cn('flex gap-1 overflow-x-auto border-b border-slate-200 scroll-thin', className)}>
      {tabs.map((t) => {
        const active = t.key === value;
        return (
          <button
            key={t.key}
            role="tab"
            type="button"
            aria-selected={active}
            onClick={() => onChange(t.key)}
            className={cn(
              '-mb-px flex min-h-11 items-center gap-2 whitespace-nowrap border-b-2 px-3.5 py-2.5 text-sm font-medium transition-colors',
              active ? 'border-brand-600 text-brand-700' : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700',
            )}
          >
            {t.label}
            {t.count !== undefined && (
              <span className={cn('rounded-full px-1.5 py-0.5 text-[11px] font-semibold', active ? 'bg-brand-100 text-brand-700' : 'bg-slate-100 text-slate-600')}>
                {t.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}


