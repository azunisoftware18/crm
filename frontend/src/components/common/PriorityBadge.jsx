import { cn } from '@/utils/cn';

const STYLES = {
  High: 'bg-red-50 text-red-700 ring-red-600/20',
  Medium: 'bg-amber-50 text-amber-800 ring-amber-600/25',
  Low: 'bg-slate-100 text-slate-600 ring-slate-500/20',
};

export default function PriorityBadge({ priority = 'Medium', className }) {
  return (
    <span className={cn('inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-semibold ring-1 ring-inset', STYLES[priority] || STYLES.Low, className)}>
      {priority}
    </span>
  );
}


