'use client'

import { useEffect, useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import DataTable from '@/components/common/DataTable';
import { getFollowUps, createFollowUp } from '@/services/crmApi';
import Button from '@/components/common/Button';
import { Plus } from 'lucide-react';

export default function FollowUpsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getFollowUps({ search }).then((data) => {
      if (!cancelled) { setItems(data); setLoading(false); }
    });
    return () => { cancelled = true; };
  }, [search]);

  const columns = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'customer', label: 'Customer', sortable: true },
    { key: 'contact', label: 'Contact', sortable: true },
    { key: 'type', label: 'Type', sortable: true },
    { key: 'dueDate', label: 'Due Date', sortable: true, render: (value) => value ? new Date(value).toLocaleDateString('en-IN') : '—' },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'notes', label: 'Notes', sortable: false },
  ];

  return (
    <>
      <PageHeader title="Follow-ups" subtitle="Follow-up dates, reminders and overdue alerts." actions={<Button icon={Plus}>New Follow-up</Button>} />
      <div className="card mt-6 overflow-hidden p-5">
        <div className="mb-4">
          <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search follow-ups..." className="h-9 w-full max-w-xs rounded-lg border border-slate-200 bg-white px-3 text-sm placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20" />
        </div>
        <DataTable columns={columns} data={items} rowKey="id" loading={loading} emptyTitle="No follow-ups found" emptyDescription="Create a follow-up to stay on top of leads and customers." />
      </div>
    </>
  );
}


