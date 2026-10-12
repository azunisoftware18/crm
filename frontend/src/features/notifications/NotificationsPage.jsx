'use client'

import { useEffect, useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import DataTable from '@/components/common/DataTable';
import { getNotifications } from '@/services/notificationApi';
import { useAuth } from '@/context/AuthContext';
import { getTone } from '@/config/statusConfig';
import Button from '@/components/common/Button';

export default function NotificationsPage() {
  const { role } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getNotifications(role).then((data) => {
      if (!cancelled) { setItems(data); setLoading(false); }
    });
    return () => { cancelled = true; };
  }, [role, search]);

  const columns = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'title', label: 'Title', sortable: true },
    { key: 'message', label: 'Message', sortable: false },
    { key: 'priority', label: 'Priority', sortable: true },
    { key: 'read', label: 'Read', sortable: true, render: (value) => value ? 'Yes' : 'No' },
  ];

  return (
    <>
      <PageHeader title="Notifications" subtitle="Notification history with linked record, required action, responsible user, due date, priority and read status." actions={<Button>Mark all read</Button>} />
      <div className="card mt-6 overflow-hidden p-5">
        <div className="mb-4">
          <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search notifications..." className="h-9 w-full max-w-xs rounded-lg border border-slate-200 bg-white px-3 text-sm placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20" />
        </div>
        <DataTable columns={columns} data={items} rowKey="id" loading={loading} emptyTitle="No notifications found" />
      </div>
    </>
  );
}


