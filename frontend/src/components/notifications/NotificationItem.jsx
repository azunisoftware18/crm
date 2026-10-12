import { Clock } from 'lucide-react';
import { cn } from '@/utils/cn';
import { timeAgo, formatDate } from '@/utils/format';
import PriorityBadge from '@/components/common/PriorityBadge';
import { NOTIFICATION_TYPES } from './notificationMeta';

/** One notification row: type icon, title, message, linked record, due date, priority and read state. */
export default function NotificationItem({ notification: n, onOpen, compact = false }) {
  const meta = NOTIFICATION_TYPES[n.type] || NOTIFICATION_TYPES.task;
  const Icon = meta.icon;
  return (
    <button
      type="button"
      onClick={() => onOpen(n)}
      className={cn(
        'flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-slate-50',
        !n.read && 'bg-brand-50/40',
      )}
    >
      <span className={cn('mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg', meta.tone)}>
        <Icon className="h-4 w-4" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span className={cn('truncate text-sm', n.read ? 'font-medium text-slate-700' : 'font-semibold text-slate-900')}>{n.title}</span>
          {!n.read && <span className="h-2 w-2 shrink-0 rounded-full bg-brand-600" aria-label="Unread" />}
        </span>
        <span className={cn('mt-0.5 block text-xs text-slate-500', compact && 'line-clamp-2')}>{n.message}</span>
        <span className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-slate-500">
          <span className="font-medium text-slate-600">{n.linkedRecord}</span>
          <span aria-hidden="true">·</span>
          <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" />{timeAgo(n.createdAt)}</span>
          {n.dueDate && <><span aria-hidden="true">·</span><span>Due {formatDate(n.dueDate)}</span></>}
          <PriorityBadge priority={n.priority} />
          {n.actionRequired && <span className="rounded-md bg-amber-100 px-1.5 py-0.5 font-semibold text-amber-800">Action required</span>}
        </span>
      </span>
    </button>
  );
}


