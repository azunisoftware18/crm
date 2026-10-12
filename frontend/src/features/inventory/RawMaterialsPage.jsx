'use client'

import { useEffect, useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import DataTable from '@/components/common/DataTable';
import { getRawMaterials } from '@/services/inventoryApi';
import Button from '@/components/common/Button';
import { Plus } from 'lucide-react';

export default function RawMaterialsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getRawMaterials({ search }).then((data) => {
      if (!cancelled) { setItems(data); setLoading(false); }
    });
    return () => { cancelled = true; };
  }, [search]);

  const columns = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'name', label: 'Item', sortable: true },
    { key: 'category', label: 'Category', sortable: true },
    { key: 'unit', label: 'Unit', sortable: true },
    { key: 'stock', label: 'Stock', sortable: true, align: 'right' },
    { key: 'reorderLevel', label: 'Reorder Level', sortable: true, align: 'right' },
    { key: 'status', label: 'Status', sortable: true },
  ];

  return (
    <>
      <PageHeader title="Raw Materials" subtitle="Raw material stock by item, category, batch, location and supplier." actions={<Button icon={Plus}>Add Item</Button>} />
      <div className="card mt-6 overflow-hidden p-5">
        <div className="mb-4">
          <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search raw materials..." className="h-9 w-full max-w-xs rounded-lg border border-slate-200 bg-white px-3 text-sm placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20" />
        </div>
        <DataTable columns={columns} data={items} rowKey="id" loading={loading} emptyTitle="No raw materials found" />
      </div>
    </>
  );
}


