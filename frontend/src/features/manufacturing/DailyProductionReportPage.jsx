'use client'

import { useEffect, useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import DataTable from '@/components/common/DataTable';
import { getDailyProductionReports } from '@/services/manufacturingApi';
import Button from '@/components/common/Button';
import { Plus } from 'lucide-react';

export default function DailyProductionReportPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getDailyProductionReports({ search }).then((data) => {
      if (!cancelled) { setItems(data); setLoading(false); }
    });
    return () => { cancelled = true; };
  }, [search]);

  const columns = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'date', label: 'Date', sortable: true, render: (value) => value ? new Date(value).toLocaleDateString('en-IN') : '—' },
    { key: 'line', label: 'Production Line', sortable: true },
    { key: 'planned', label: 'Planned', sortable: true, align: 'right' },
    { key: 'produced', label: 'Produced', sortable: true, align: 'right' },
    { key: 'rejected', label: 'Rejected', sortable: true, align: 'right' },
    { key: 'status', label: 'Status', sortable: true },
  ];

  return (
    <>
      <PageHeader title="Daily Production Report (DPR)" subtitle="Planned vs produced, rejected, scrap, actual consumption, manpower/machine remarks and closing status." actions={<Button icon={Plus}>New DPR</Button>} />
      <div className="card mt-6 overflow-hidden p-5">
        <div className="mb-4">
          <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search DPR..." className="h-9 w-full max-w-xs rounded-lg border border-slate-200 bg-white px-3 text-sm placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20" />
        </div>
        <DataTable columns={columns} data={items} rowKey="id" loading={loading} emptyTitle="No DPRs found" />
      </div>
    </>
  );
}


