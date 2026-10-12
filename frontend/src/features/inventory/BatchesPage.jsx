'use client'

import { useEffect, useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import DataTable from '@/components/common/DataTable';
import { getBatches } from '@/services/inventoryApi';
import Button from '@/components/common/Button';
import { Plus } from 'lucide-react';

export default function BatchesPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getBatches({ search }).then((data) => {
      if (!cancelled) { setItems(data); setLoading(false); }
    });
    return () => { cancelled = true; };
  }, [search]);

  const columns = [
    { key: 'id', label: 'Batch', sortable: true },
    { key: 'product', label: 'Product', sortable: true },
    { key: 'quantity', label: 'Quantity', sortable: true, align: 'right' },
    { key: 'manufacturingDate', label: 'Mfg Date', sortable: true, render: (value) => value ? new Date(value).toLocaleDateString('en-IN') : '—' },
    { key: 'expiryDate', label: 'Expiry', sortable: true, render: (value) => value ? new Date(value).toLocaleDateString('en-IN') : '—' },
    { key: 'status', label: 'Status', sortable: true },
  ];

  return (
    <>
      <PageHeader title="Batches" subtitle="Batch and lot tracking with traceability." actions={<Button icon={Plus}>New Batch</Button>} />
      <div className="card mt-6 overflow-hidden p-5">
        <div className="mb-4">
          <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search batches..." className="h-9 w-full max-w-xs rounded-lg border border-slate-200 bg-white px-3 text-sm placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20" />
        </div>
        <DataTable columns={columns} data={items} rowKey="id" loading={loading} emptyTitle="No batches found" />
      </div>
    </>
  );
}


