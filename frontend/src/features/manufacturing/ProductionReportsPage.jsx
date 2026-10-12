'use client'

import { useEffect, useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import DataTable from '@/components/common/DataTable';
import { getProductionPlans } from '@/services/manufacturingApi';
import Button from '@/components/common/Button';
import { Plus } from 'lucide-react';

export default function ProductionReportsPage() {
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
    { key: 'title', label: 'Report', sortable: true },
    { key: 'product', label: 'Product', sortable: true },
    { key: 'yield', label: 'Yield', sortable: true, align: 'right' },
    { key: 'scrap', label: 'Scrap', sortable: true, align: 'right' },
    { key: 'consumption', label: 'Consumption', sortable: true, align: 'right' },
    { key: 'output', label: 'Output', sortable: true, align: 'right' },
  ];

  return (
    <>
      <PageHeader title="Production Reports" subtitle="Yield, scrap, consumption and finished-goods output." actions={<Button icon={Plus}>Generate Report</Button>} />
      <div className="card mt-6 overflow-hidden p-5">
        <div className="mb-4">
          <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search reports..." className="h-9 w-full max-w-xs rounded-lg border border-slate-200 bg-white px-3 text-sm placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20" />
        </div>
        <DataTable columns={columns} data={items} rowKey="id" loading={loading} emptyTitle="No reports found" />
      </div>
    </>
  );
}


