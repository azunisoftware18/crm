'use client'

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import DataTable from '@/components/common/DataTable';
import { getCustomers, deleteCustomer } from '@/services/crmApi';
import Button from '@/components/common/Button';
import ConfirmDialog from '@/components/common/ConfirmDialog';

export default function CustomersPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getCustomers({ search }).then((data) => {
      if (!cancelled) { setItems(data); setLoading(false); }
    });
    return () => { cancelled = true; };
  }, [search]);

  const columns = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'name', label: 'Customer', sortable: true },
    { key: 'contact', label: 'Contact', sortable: true },
    { key: 'city', label: 'City', sortable: true },
    { key: 'gstin', label: 'GSTIN', sortable: true },
    { key: 'paymentTerms', label: 'Payment Terms', sortable: true },
    { key: 'creditLimit', label: 'Credit Limit', sortable: true, align: 'right', render: (value) => `₹ ${Number(value).toLocaleString('en-IN')}` },
    { key: 'status', label: 'Status', sortable: true },
  ];

  const confirmDelete = async () => {
    if (!deleteId) return;
    await deleteCustomer(deleteId);
    setDeleteId(null);
  };

  return (
    <>
      <PageHeader
        title="Customers"
        subtitle="Customer contacts, addresses, GST details, payment terms and credit information."
        actions={
          <Link href="/crm/customers/new"><Button icon={Plus}>New Customer</Button></Link>
        }
      />
      <div className="card mt-6 overflow-hidden p-5">
        <div className="mb-4">
          <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search customers..." className="h-9 w-full max-w-xs rounded-lg border border-slate-200 bg-white px-3 text-sm placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20" />
        </div>
        <DataTable
          columns={columns}
          data={items}
          rowKey="id"
          loading={loading}
          emptyTitle="No customers found"
          emptyDescription="Create a new customer or adjust your search."
          actions={(row) => (
            <>
              <Link href={`/crm/customers/${row.id}`} className="text-xs font-medium text-brand-700 hover:underline">View</Link>
              <button type="button" onClick={() => setDeleteId(row.id)} className="text-xs font-medium text-red-700 hover:underline">Delete</button>
            </>
          )}
        />
      </div>
      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={confirmDelete} title="Delete customer?" message="This action cannot be undone." confirmLabel="Delete" tone="danger" />
    </>
  );
}


