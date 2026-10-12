'use client'

import { useEffect, useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import DataTable from '@/components/common/DataTable';
import { getTransportEntries } from '@/services/dispatchApi';
import Button from '@/components/common/Button';
import { Plus } from 'lucide-react';

export default function TransportFreightPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getTransportEntries({ search }).then((data) => {
      if (!cancelled) { setItems(data); setLoading(false); }
    });
    return () => { cancelled = true; };
  }, [search]);

  const columns = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'invoice', label: 'Invoice', sortable: true },
    { key: 'carrier', label: 'Carrier', sortable: true },
    { key: 'agreedFreight', label: 'Agreed Freight', sortable: true, align: 'right', render: (value) => value ? `₹ ${Number(value).toLocaleString('en-IN')}` : '—' },
    { key: 'actualFreight', label: 'Actual Freight', sortable: true, align: 'right', render: (value) => value ? `₹ ${Number(value).toLocaleString('en-IN')}` : '—' },
    { key: 'balance', label: 'Balance', sortable: true, align: 'right', render: (value) => value ? `₹ ${Number(value).toLocaleString('en-IN')}` : '—' },
    { key: 'lr', label: 'LR / Consignment', sortable: true },
  ];

  return (
    <>
      <PageHeader title="Transport & Freight Ledger" subtitle="Invoice-wise transport ledger: agreed vs actual freight, paid, balance and LR / consignment reference." actions={<Button icon={Plus}>Add Entry</Button>} />
      <div className="card mt-6 overflow-hidden p-5">
        <div className="mb-4">
          <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search transport entries..." className="h-9 w-full max-w-xs rounded-lg border border-slate-200 bg-white px-3 text-sm placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20" />
        </div>
        <DataTable columns={columns} data={items} rowKey="id" loading={loading} emptyTitle="No transport entries found" />
      </div>
    </>
  );
}


