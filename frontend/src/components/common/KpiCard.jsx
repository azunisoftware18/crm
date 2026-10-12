import { cn } from '@/utils/cn';
import { getIcon } from './iconMap';

const TONES = {
  brand: 'bg-brand-50 text-brand-600',
  info: 'bg-sky-50 text-sky-600',
  warning: 'bg-amber-50 text-amber-600',
  danger: 'bg-red-50 text-red-600',
  success: 'bg-emerald-50 text-emerald-600',
};

/** `icon` may be a Lucide component or an icon name registered in iconMap. */
export default function KpiCard({ label, value, hint, icon, tone = 'brand', className }) {
  const Icon = typeof icon === 'string' ? getIcon(icon) : icon;
  return (
    <div className={cn('card p-5', className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 truncate text-2xl font-semibold tracking-tight text-slate-900">{value}</p>
        </div>
        {Icon && (
          <span className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-lg', TONES[tone])}>
            <Icon className="h-5 w-5" />
          </span>
        )}
      </div>
      {hint && <p className="mt-3 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}


