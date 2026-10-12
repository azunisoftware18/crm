'use client'

import { useEffect, useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import DataTable from '@/components/common/DataTable';
import { getBankReceipts } from '@/services/paymentApi';
import Button from '@/components/common/Button';
import { Plus } from 'lucide-react';

export default function TallySyncPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getBankReceipts({ search }).then((data) => {
      if (!cancelled) { setItems(data); setLoading(false); }
    });
    return () => { cancelled = true; };
  }, [search]);

  const columns = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'customer', label: 'Party', sortable: true },
    { key: 'amount', label: 'Amount', sortable: true, align: 'right', render: (value) => value ? `₹ ${Number(value).toLocaleString('en-IN')}` : '—' },
    { key: 'status', label: 'Sync Status', sortable: true },
    { key: 'lastSync', label: 'Last Sync', sortable: true, render: (value) => value ? new Date(value).toLocaleString('en-IN') : '—' },
  ];

  return (
    <>
      <PageHeader title="Tally Sync" subtitle="Synchronization status, timestamp, document reference, result message and retry." actions={<Button icon={Plus}>Sync Now</Button>} />
      <div className="card mt-6 overflow-hidden p-5">
        <div className="mb-4">
          <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search sync records..." className="h-9 w-full max-w-xs rounded-lg border border-slate-200 bg-white px-3 text-sm placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20" />
        </div>
        <DataTable columns={columns} data={items} rowKey="id" loading={loading} emptyTitle="No sync records found" />
      </div>
    </>
  );
}


