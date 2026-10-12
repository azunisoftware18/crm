'use client'

import { useEffect, useState } from 'react';
import Link from 'next/link';
import PageHeader from '@/components/common/PageHeader';
import DataTable from '@/components/common/DataTable';
import { getProductionRuns } from '@/services/manufacturingApi';
import Button from '@/components/common/Button';
import { Plus } from 'lucide-react';

export default function ReprocessingPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getProductionRuns({ search }).then((data) => {
      if (!cancelled) { setItems(data); setLoading(false); }
    });
    return () => { cancelled = true; };
  }, [search]);

  const columns = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'product', label: 'Product', sortable: true },
    { key: 'batch', label: 'Batch', sortable: true },
    { key: 'quantity', label: 'Quantity', sortable: true, align: 'right' },
    { key: 'status', label: 'Status', sortable: true },
  ];

  return (
    <>
      <PageHeader title="Reprocessing" subtitle="Reprocessing production orders with approved formula. Prevents double counting of returned input." actions={<Link href="/returns/reprocessing/new"><Button icon={Plus}>New Reprocessing</Button></Link>} />
      <div className="card mt-6 overflow-hidden p-5">
        <div className="mb-4">
          <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search reprocessing..." className="h-9 w-full max-w-xs rounded-lg border border-slate-200 bg-white px-3 text-sm placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20" />
        </div>
        <DataTable columns={columns} data={items} rowKey="id" loading={loading} emptyTitle="No reprocessing orders found" />
      </div>
    </>
  );
}


