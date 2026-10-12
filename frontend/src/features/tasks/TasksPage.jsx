'use client'

import { useEffect, useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import DataTable from '@/components/common/DataTable';
import { getNotifications } from '@/services/notificationApi';
import { useAuth } from '@/context/AuthContext';
import { STATUS_SETS } from '@/config/statusConfig';
import { getTone } from '@/config/statusConfig';
import Button from '@/components/common/Button';
import { Plus } from 'lucide-react';

const STATUS_OPTIONS = ['All', ...STATUS_SETS.task];

export default function TasksPage() {
  const { role } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getNotifications(role).then((data) => {
      if (!cancelled) { setItems(data); setLoading(false); }
    });
    return () => { cancelled = true; };
  }, [role, search, status]);

  const columns = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'title', label: 'Title', sortable: true },
    { key: 'message', label: 'Message', sortable: false },
    { key: 'priority', label: 'Priority', sortable: true },
    { key: 'status', label: 'Status', sortable: true, render: (value) => {
      const tone = getTone(value);
      const cls = tone === 'success' ? 'bg-emerald-50 text-emerald-700' : tone === 'warning' ? 'bg-amber-50 text-amber-800' : tone === 'danger' ? 'bg-red-50 text-red-700' : 'bg-slate-100 text-slate-600';
      return <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${cls}`}>{value}</span>;
    } },
  ];

  return (
    <>
      <PageHeader title="Tasks" subtitle="Tasks and pending work: assigned to me, awaiting my action, overdue, approval pending and information-only." actions={<Button icon={Plus}>New Task</Button>} />
      <div className="card mt-6 overflow-hidden p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-2">
            {STATUS_OPTIONS.map((s) => (
              <button key={s} type="button" onClick={() => setStatus(s)} className={`rounded-lg px-3 py-1.5 text-xs font-medium ${status === s ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-100'}`}>{s}</button>
            ))}
          </div>
        </div>
        <DataTable columns={columns} data={items} rowKey="id" loading={loading} emptyTitle="No tasks found" />
      </div>
    </>
  );
}


