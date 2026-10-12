'use client'

import { useEffect, useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import DataTable from '@/components/common/DataTable';
import { getGatePasses } from '@/services/inventoryApi';
import Button from '@/components/common/Button';
import { Plus } from 'lucide-react';

export default function GatePassPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getGatePasses({ search }).then((data) => {
      if (!cancelled) { setItems(data); setLoading(false); }
    });
    return () => { cancelled = true; };
  }, [search]);

  const columns = [
    { key: 'id', label: 'Gate Pass', sortable: true },
    { key: 'item', label: 'Item', sortable: true },
    { key: 'quantity', label: 'Quantity', sortable: true, align: 'right' },
    { key: 'purpose', label: 'Purpose', sortable: true },
    { key: 'issuedTo', label: 'Issued To', sortable: true },
    { key: 'date', label: 'Date', sortable: true, render: (value) => value ? new Date(value).toLocaleDateString('en-IN') : '—' },
    { key: 'status', label: 'Status', sortable: true },
  ];

  return (
    <>
      <PageHeader title="Gate Pass (Free Sampling)" subtitle="Free-of-cost sampling issues with returnable tracking. No sales invoice or receivable is created." actions={<Button icon={Plus}>New Gate Pass</Button>} />
      <div className="card mt-6 overflow-hidden p-5">
        <div className="mb-4">
          <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search gate passes..." className="h-9 w-full max-w-xs rounded-lg border border-slate-200 bg-white px-3 text-sm placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20" />
        </div>
        <DataTable columns={columns} data={items} rowKey="id" loading={loading} emptyTitle="No gate passes found" />
      </div>
    </>
  );
}


