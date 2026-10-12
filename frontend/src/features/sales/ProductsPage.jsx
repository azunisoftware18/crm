'use client'

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import DataTable from '@/components/common/DataTable';
import { getProducts, deleteProduct } from '@/services/salesApi';
import Button from '@/components/common/Button';
import ConfirmDialog from '@/components/common/ConfirmDialog';

export default function ProductsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getProducts({ search }).then((data) => {
      if (!cancelled) { setItems(data); setLoading(false); }
    });
    return () => { cancelled = true; };
  }, [search]);

  const columns = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'code', label: 'Code', sortable: true },
    { key: 'name', label: 'Product', sortable: true },
    { key: 'category', label: 'Category', sortable: true },
    { key: 'unit', label: 'Unit', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
  ];

  const confirmDelete = async () => {
    if (!deleteId) return;
    await deleteProduct(deleteId);
    setDeleteId(null);
  };

  return (
    <>
      <PageHeader title="Products" subtitle="Product master with specifications, packaging details and reference images." actions={<Link href="/sales/products/new"><Button icon={Plus}>New Product</Button></Link>} />
      <div className="card mt-6 overflow-hidden p-5">
        <div className="mb-4">
          <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..." className="h-9 w-full max-w-xs rounded-lg border border-slate-200 bg-white px-3 text-sm placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20" />
        </div>
        <DataTable columns={columns} data={items} rowKey="id" loading={loading} emptyTitle="No products found" actions={(row) => (
          <>
            <Link href={`/sales/products/${row.id}`} className="text-xs font-medium text-brand-700 hover:underline">View</Link>
            <button type="button" onClick={() => setDeleteId(row.id)} className="text-xs font-medium text-red-600 hover:underline">Delete</button>
          </>
        )} />
      </div>
      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={confirmDelete} title="Delete product?" message="This action cannot be undone." confirmLabel="Delete" tone="danger" />
    </>
  );
}


