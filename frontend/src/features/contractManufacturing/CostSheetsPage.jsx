'use client'

import { useEffect, useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import DataTable from '@/components/common/DataTable';
import { getProductionPlans } from '@/services/manufacturingApi';
import Button from '@/components/common/Button';
import { Plus } from 'lucide-react';

export default function CostSheetsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getProductionPlans({ search }).then((data) => {
      if (!cancelled) { setItems(data); setLoading(false); }
    });
    return () => { cancelled = true; };
  }, [search]);

  const columns = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'title', label: 'Title', sortable: true },
    { key: 'product', label: 'Product', sortable: true },
    { key: 'effectiveDate', label: 'Effective Date', sortable: true, render: (value) => value ? new Date(value).toLocaleDateString('en-IN') : '—' },
    { key: 'cost', label: 'Cost', sortable: true, align: 'right', render: (value) => value ? `₹ ${Number(value).toLocaleString('en-IN')}` : '—' },
  ];

  return (
    <>
      <PageHeader title="Cost Sheets" subtitle="Versioned cost-sheet library with rate effective dates and per-order cost snapshots." actions={<Button icon={Plus}>New Cost Sheet</Button>} />
      <div className="card mt-6 overflow-hidden p-5">
        <div className="mb-4">
          <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search cost sheets..." className="h-9 w-full max-w-xs rounded-lg border border-slate-200 bg-white px-3 text-sm placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20" />
        </div>
        <DataTable columns={columns} data={items} rowKey="id" loading={loading} emptyTitle="No cost sheets found" />
      </div>
    </>
  );
}


