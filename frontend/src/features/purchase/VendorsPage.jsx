'use client'

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import DataTable from '@/components/common/DataTable';
import { getVendors, deleteVendor } from '@/services/purchaseApi';
import { STATUS_SETS } from '@/config/statusConfig';
import { getTone } from '@/config/statusConfig';
import Button from '@/components/common/Button';
import ConfirmDialog from '@/components/common/ConfirmDialog';

const STATUS_OPTIONS = ['All', ...STATUS_SETS.vendor];

export default function VendorsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getVendors({ search, status: status === 'All' ? undefined : status }).then((data) => {
      if (!cancelled) { setItems(data); setLoading(false); }
    });
    return () => { cancelled = true; };
  }, [search, status]);

  const columns = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'name', label: 'Vendor', sortable: true },
    { key: 'category', label: 'Category', sortable: true },
    { key: 'contact', label: 'Contact', sortable: true },
    { key: 'status', label: 'Status', sortable: true, render: (value) => {
      const tone = getTone(value);
      const cls = tone === 'success' ? 'bg-emerald-50 text-emerald-700' : tone === 'warning' ? 'bg-amber-50 text-amber-800' : tone === 'danger' ? 'bg-red-50 text-red-700' : 'bg-slate-100 text-slate-600';
      return <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${cls}`}>{value}</span>;
    } },
  ];

  const confirmDelete = async () => {
    if (!deleteId) return;
    await deleteVendor(deleteId);
    setDeleteId(null);
  };

  return (
    <>
      <PageHeader title="Vendors" subtitle="Vendor proposals approved by Manager before PO release." actions={<Link href="/purchase/vendors/new"><Button icon={Plus}>New Vendor</Button></Link>} />
      <div className="card mt-6 overflow-hidden p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-2">
            {STATUS_OPTIONS.map((s) => (
              <button key={s} type="button" onClick={() => setStatus(s)} className={`rounded-lg px-3 py-1.5 text-xs font-medium ${status === s ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-100'}`}>{s}</button>
            ))}
          </div>
        </div>
        <DataTable columns={columns} data={items} rowKey="id" loading={loading} emptyTitle="No vendors found" actions={(row) => (
          <>
            <Link href={`/purchase/vendors/${row.id}`} className="text-xs font-medium text-brand-700 hover:underline">View</Link>
            <button type="button" onClick={() => setDeleteId(row.id)} className="text-xs font-medium text-red-600 hover:underline">Delete</button>
          </>
        )} />
      </div>
      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={confirmDelete} title="Delete vendor?" message="This action cannot be undone." confirmLabel="Delete" tone="danger" />
    </>
  );
}


