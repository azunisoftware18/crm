'use client'

import { useEffect, useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import DataTable from '@/components/common/DataTable';
import { getRawMaterials, getFinishedGoods } from '@/services/inventoryApi';
import { STATUS_SETS } from '@/config/statusConfig';
import { getTone } from '@/config/statusConfig';
import Button from '@/components/common/Button';
import { Plus } from 'lucide-react';

export default function InventoryOverviewPage() {
  const [rawItems, setRawItems] = useState([]);
  const [fgItems, setFgItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    Promise.all([getRawMaterials({}), getFinishedGoods({})]).then(([raw, fg]) => {
      if (!cancelled) { setRawItems(raw); setFgItems(fg); setLoading(false); }
    });
    return () => { cancelled = true; };
  }, []);

  const columns = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'name', label: 'Item', sortable: true },
    { key: 'stock', label: 'Stock', sortable: true, align: 'right' },
    { key: 'status', label: 'Status', sortable: true, render: (value) => {
      const tone = getTone(value);
      const cls = tone === 'success' ? 'bg-emerald-50 text-emerald-700' : tone === 'warning' ? 'bg-amber-50 text-amber-800' : tone === 'danger' ? 'bg-red-50 text-red-700' : 'bg-slate-100 text-slate-600';
      return <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${cls}`}>{value}</span>;
    } },
  ];

  return (
    <>
      <PageHeader title="Inventory Overview" subtitle="Owned-factory stock summary with low-stock and reorder alerts. FIFO valuation." actions={<Button icon={Plus}>Adjust Stock</Button>} />
      <div className="card mt-6 overflow-hidden p-5">
        <h3 className="text-sm font-semibold text-slate-900">Raw Materials</h3>
        <DataTable columns={columns} data={rawItems} rowKey="id" loading={loading} emptyTitle="No raw materials found" className="mt-3" />
        <h3 className="mt-6 text-sm font-semibold text-slate-900">Finished Goods</h3>
        <DataTable columns={columns} data={fgItems} rowKey="id" loading={loading} emptyTitle="No finished goods found" className="mt-3" />
      </div>
    </>
  );
}


