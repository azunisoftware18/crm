'use client'

import { useEffect, useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import DataTable from '@/components/common/DataTable';
import { getFormulations } from '@/services/manufacturingApi';
import Button from '@/components/common/Button';
import { Plus } from 'lucide-react';

export default function FormulationsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getFormulations({ search }).then((data) => {
      if (!cancelled) { setItems(data); setLoading(false); }
    });
    return () => { cancelled = true; };
  }, [search]);

  const columns = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'name', label: 'Formulation', sortable: true },
    { key: 'product', label: 'Product', sortable: true },
    { key: 'version', label: 'Version', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'createdAt', label: 'Created', sortable: true, render: (value) => value ? new Date(value).toLocaleDateString('en-IN') : '—' },
  ];

  return (
    <>
      <PageHeader title="Formulations / BOM" subtitle="Percentage or kg entry with four-decimal precision. Release requires exactly 100.0000%." actions={<Button icon={Plus}>New Formulation</Button>} />
      <div className="card mt-6 overflow-hidden p-5">
        <div className="mb-4">
          <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search formulations..." className="h-9 w-full max-w-xs rounded-lg border border-slate-200 bg-white px-3 text-sm placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20" />
        </div>
        <DataTable columns={columns} data={items} rowKey="id" loading={loading} emptyTitle="No formulations found" />
      </div>
    </>
  );
}


