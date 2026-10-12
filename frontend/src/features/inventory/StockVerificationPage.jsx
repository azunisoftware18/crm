'use client'

import { useEffect, useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import DataTable from '@/components/common/DataTable';
import { getStockMovements } from '@/services/inventoryApi';
import Button from '@/components/common/Button';
import { Plus } from 'lucide-react';

export default function StockVerificationPage() {
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
    { key: 'batch', label: 'Batch', sortable: true },
    { key: 'systemQty', label: 'System Qty', sortable: true, align: 'right' },
    { key: 'physicalQty', label: 'Physical Qty', sortable: true, align: 'right' },
    { key: 'variance', label: 'Variance', sortable: true, align: 'right' },
    { key: 'reason', label: 'Reason', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
  ];

  return (
    <>
      <PageHeader title="Physical Stock Verification" subtitle="Fortnightly verification by item, batch and location with variance reasons and Manager approval beyond limits." actions={<Button icon={Plus}>New Verification</Button>} />
      <div className="card mt-6 overflow-hidden p-5">
        <div className="mb-4">
          <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search verifications..." className="h-9 w-full max-w-xs rounded-lg border border-slate-200 bg-white px-3 text-sm placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20" />
        </div>
        <DataTable columns={columns} data={items} rowKey="id" loading={loading} emptyTitle="No verifications found" />
      </div>
    </>
  );
}


