'use client'

import { useEffect, useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import DataTable from '@/components/common/DataTable';
import { getCustomerPayments } from '@/services/paymentApi';
import { STATUS_SETS } from '@/config/statusConfig';
import { getTone } from '@/config/statusConfig';
import Button from '@/components/common/Button';
import { Plus } from 'lucide-react';

const STATUS_OPTIONS = ['All', ...STATUS_SETS.buyerCollection];

export default function OverduePaymentsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getCustomerPayments({ search, status: status === 'All' ? undefined : status }).then((data) => {
      if (!cancelled) { setItems(data); setLoading(false); }
    });
    return () => { cancelled = true; };
  }, [search, status]);

  const columns = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'invoice', label: 'Invoice', sortable: true },
    { key: 'customer', label: 'Customer', sortable: true },
    { key: 'amount', label: 'Amount', sortable: true, align: 'right', render: (value) => value ? `₹ ${Number(value).toLocaleString('en-IN')}` : '—' },
    { key: 'dueDate', label: 'Due Date', sortable: true, render: (value) => value ? new Date(value).toLocaleDateString('en-IN') : '—' },
    { key: 'status', label: 'Status', sortable: true, render: (value) => {
      const tone = getTone(value);
      const cls = tone === 'success' ? 'bg-emerald-50 text-emerald-700' : tone === 'warning' ? 'bg-amber-50 text-amber-800' : tone === 'danger' ? 'bg-red-50 text-red-700' : 'bg-slate-100 text-slate-600';
      return <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${cls}`}>{value}</span>;
    } },
  ];

  return (
    <>
      <PageHeader title="Overdue Payments" subtitle="Overdue payments with reason, responsible user and Manager review." actions={<Button icon={Plus}>Follow Up</Button>} />
      <div className="card mt-6 overflow-hidden p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-2">
            {STATUS_OPTIONS.map((s) => (
              <button key={s} type="button" onClick={() => setStatus(s)} className={`rounded-lg px-3 py-1.5 text-xs font-medium ${status === s ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-100'}`}>{s}</button>
            ))}
          </div>
        </div>
        <DataTable columns={columns} data={items} rowKey="id" loading={loading} emptyTitle="No overdue payments found" />
      </div>
    </>
  );
}


