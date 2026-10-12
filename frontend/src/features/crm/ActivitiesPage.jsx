'use client'

import { useEffect, useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import DataTable from '@/components/common/DataTable';
import { getActivities, createActivity } from '@/services/crmApi';
import Button from '@/components/common/Button';
import { Plus } from 'lucide-react';

export default function ActivitiesPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getActivities({ search }).then((data) => {
      if (!cancelled) { setItems(data); setLoading(false); }
    });
    return () => { cancelled = true; };
  }, [search]);

  const columns = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'subject', label: 'Subject', sortable: true },
    { key: 'type', label: 'Type', sortable: true },
    { key: 'customer', label: 'Customer', sortable: true },
    { key: 'user', label: 'User', sortable: true },
    { key: 'date', label: 'Date', sortable: true, render: (value) => value ? new Date(value).toLocaleDateString('en-IN') : '—' },
    { key: 'summary', label: 'Summary', sortable: false },
  ];

  return (
    <>
      <PageHeader title="Activities" subtitle="Calls, messages, WhatsApp, emails and meetings." actions={<Button icon={Plus}>Log Activity</Button>} />
      <div className="card mt-6 overflow-hidden p-5">
        <div className="mb-4">
          <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search activities..." className="h-9 w-full max-w-xs rounded-lg border border-slate-200 bg-white px-3 text-sm placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20" />
        </div>
        <DataTable columns={columns} data={items} rowKey="id" loading={loading} emptyTitle="No activities found" emptyDescription="Log calls, messages, emails and meetings here." />
      </div>
    </>
  );
}


