'use client'

import { useEffect, useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import DataTable from '@/components/common/DataTable';
import { getAuditLogs } from '@/services/adminApi';
import Button from '@/components/common/Button';
import { Plus } from 'lucide-react';

export default function AuditLogsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getAuditLogs({ search }).then((data) => {
      if (!cancelled) { setItems(data); setLoading(false); }
    });
    return () => { cancelled = true; };
  }, [search]);

  const columns = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'user', label: 'User', sortable: true },
    { key: 'action', label: 'Action', sortable: true },
    { key: 'module', label: 'Module', sortable: true },
    { key: 'recordId', label: 'Record ID', sortable: true },
    { key: 'timestamp', label: 'Timestamp', sortable: true, render: (value) => value ? new Date(value).toLocaleString('en-IN') : '—' },
  ];

  return (
    <>
      <PageHeader title="Audit Logs" subtitle="Every create, edit, approval, rejection, deletion, stock adjustment, payment, credit note and synchronization event." actions={<Button icon={Plus}>Export</Button>} />
      <div className="card mt-6 overflow-hidden p-5">
        <div className="mb-4">
          <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search audit logs..." className="h-9 w-full max-w-xs rounded-lg border border-slate-200 bg-white px-3 text-sm placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20" />
        </div>
        <DataTable columns={columns} data={items} rowKey="id" loading={loading} emptyTitle="No audit logs found" />
      </div>
    </>
  );
}


