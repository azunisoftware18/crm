'use client'

import { useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Bell } from 'lucide-react';
import { useNotifications } from '@/context/NotificationContext';
import useClickOutside from '@/hooks/useClickOutside';
import NotificationItem from '@/components/notifications/NotificationItem';
import LoadingSkeleton from '@/components/common/LoadingSkeleton';
import EmptyState from '@/components/common/EmptyState';

export default function NotificationBell() {
  const { items, loading, unreadCount, markRead, markAllRead } = useNotifications();
  const router = useRouter();
  const ref = useRef(null);
  const [open, setOpen] = useState(false);
  useClickOutside(ref, () => setOpen(false), open);

  const openItem = (n) => {
    markRead(n.id);
    setOpen(false);
    router.push(n.link); // spec §9: open the linked transaction directly from the notification
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ''}`}
        aria-expanded={open}
        className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute right-1 top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white ring-2 ring-white">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="fixed right-3 top-[4.25rem] z-50 w-[calc(100vw-1.5rem)] max-w-[420px] animate-fade-in overflow-hidden rounded-xl border border-slate-200 bg-white shadow-pop sm:absolute sm:right-0 sm:top-12 sm:w-[calc(100vw-2rem)]">
          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Notifications</h3>
              <p className="text-xs text-slate-500">{unreadCount} unread</p>
            </div>
            <button type="button" onClick={markAllRead} disabled={!unreadCount} className="text-xs font-medium text-brand-700 hover:underline disabled:cursor-not-allowed disabled:text-slate-400 disabled:no-underline">Mark all as read</button>
          </div>
          <div className="scroll-thin max-h-[420px] divide-y divide-slate-100 overflow-y-auto">
            {loading ? (
              <div className="p-4"><LoadingSkeleton rows={4} /></div>
            ) : items.length === 0 ? (
              <EmptyState title="You're all caught up" description="New approvals, alerts and tasks will appear here." />
            ) : (
              items.slice(0, 8).map((n) => <NotificationItem key={n.id} notification={n} onOpen={openItem} compact />)
            )}
          </div>
          <Link href="/notifications" onClick={() => setOpen(false)} className="block border-t border-slate-200 bg-slate-50 px-4 py-2.5 text-center text-sm font-medium text-brand-700 hover:bg-slate-100">View all notifications</Link>
        </div>
      )}
    </div>
  );
}


