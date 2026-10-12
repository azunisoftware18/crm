'use client'

import { useEffect, useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import DataTable from '@/components/common/DataTable';
import { getProducts } from '@/services/salesApi';
import Button from '@/components/common/Button';
import { Plus } from 'lucide-react';

export default function PurchaseItemsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getProducts({}).then((data) => {
      if (!cancelled) { setItems(data); setLoading(false); }
    });
    return () => { cancelled = true; };
  }, []);

  const columns = [
    { key: 'code', label: 'Code', sortable: true },
    { key: 'name', label: 'Item', sortable: true },
    { key: 'category', label: 'Section', sortable: true },
    { key: 'unit', label: 'Unit', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
  ];

  return (
    <>
      <PageHeader title="Purchase Item Library" subtitle="Section-wise items: Perfume, Minerals, Soap Noodles, Chemicals, Colours, Wrappers, Bottles and more." actions={<Button icon={Plus}>New Item</Button>} />
      <div className="card mt-6 overflow-hidden p-5">
        <DataTable columns={columns} data={items} rowKey="id" loading={loading} emptyTitle="No items found" />
      </div>
    </>
  );
}


