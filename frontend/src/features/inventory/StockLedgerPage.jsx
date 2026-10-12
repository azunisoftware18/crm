'use client'

import { useEffect, useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import DataTable from '@/components/common/DataTable';
import { getStockMovements } from '@/services/inventoryApi';
import Button from '@/components/common/Button';
import { Plus } from 'lucide-react';

export default function StockLedgerPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getStockMovements({ search }).then((data) => {
      if (!cancelled) { setItems(data); setLoading(false); }
    });
    return () => { cancelled = true; };
  }, [search]);

  const columns = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'item', label: 'Item', sortable: true },
    { key: 'type', label: 'Type', sortable: true },
    { key: 'quantity', label: 'Quantity', sortable: true, align: 'right' },
    { key: 'reference', label: 'Reference', sortable: true },
    { key: 'date', label: 'Date', sortable: true, render: (value) => value ? new Date(value).toLocaleDateString('en-IN') : '—' },
  ];

  return (
    <>
      <PageHeader title="Stock Ledger" subtitle="Opening, receipts, issues, production consumption, sampling, dispatch, returns, reprocessing, adjustments and closing balance." actions={<Button icon={Plus}>Add Entry</Button>} />
      <div className="card mt-6 overflow-hidden p-5">
        <div className="mb-4">
          <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search stock movements..." className="h-9 w-full max-w-xs rounded-lg border border-slate-200 bg-white px-3 text-sm placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20" />
        </div>
        <DataTable columns={columns} data={items} rowKey="id" loading={loading} emptyTitle="No stock movements found" />
      </div>
    </>
  );
}


