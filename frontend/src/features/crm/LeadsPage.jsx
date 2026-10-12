'use client'

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import DataTable from '@/components/common/DataTable';
import { useAuth } from '@/context/AuthContext';
import { getLeads, deleteLead } from '@/services/crmApi';
import { STATUS_SETS } from '@/config/statusConfig';
import { getTone } from '@/config/statusConfig';
import Button from '@/components/common/Button';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { cn } from '@/utils/cn';

const STATUS_OPTIONS = ['All', ...STATUS_SETS.lead];

export default function LeadsPage() {
  const { role } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getLeads({ search, status: status === 'All' ? undefined : status }).then((data) => {
      if (!cancelled) { setItems(data); setLoading(false); }
    });
    return () => { cancelled = true; };
  }, [role, search, status]);

  const columns = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'company', label: 'Company', sortable: true },
    { key: 'contact', label: 'Contact', sortable: true },
    { key: 'source', label: 'Source', sortable: true },
    { key: 'status', label: 'Status', sortable: true, render: (value) => {
      const tone = getTone(value);
      const cls = tone === 'success' ? 'bg-emerald-50 text-emerald-700' : tone === 'warning' ? 'bg-amber-50 text-amber-800' : tone === 'danger' ? 'bg-red-50 text-red-700' : 'bg-slate-100 text-slate-600';
      return <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${cls}`}>{value}</span>;
    } },
    { key: 'priority', label: 'Priority', sortable: true },
    { key: 'assignedTo', label: 'Assigned To', sortable: true },
  ];

  const confirmDelete = async () => {
    if (!deleteId) return;
    await deleteLead(deleteId);
    setDeleteId(null);
  };

  return (
    <>
      <PageHeader
        title="Leads"
        subtitle="Inbound leads from IndiaMART, TradeIndia, Justdial, Instagram, website, phone and manual entry."
        actions={
          <Link href="/crm/leads/new"><Button icon={Plus}>New Lead</Button></Link>
        }
      />
      <div className="card mt-6 overflow-hidden p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            {STATUS_OPTIONS.map((s) => (
              <button key={s} type="button" onClick={() => setStatus(s)} className={cn('rounded-lg px-3 py-1.5 text-xs font-medium', status === s ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-100')}>{s}</button>
            ))}
          </div>
        </div>
        <DataTable
          columns={columns}
          data={items}
          rowKey="id"
          loading={loading}
          emptyTitle="No leads found"
          emptyDescription="Create a new lead or adjust your filters."
          actions={(row) => (
            <>
              <Link href={`/crm/leads/${row.id}`} className="text-xs font-medium text-brand-700 hover:underline">View</Link>
              <button type="button" onClick={() => setDeleteId(row.id)} className="text-xs font-medium text-red-600 hover:underline">Delete</button>
            </>
          )}
        />
      </div>
      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={confirmDelete} title="Delete lead?" message="This action cannot be undone." confirmLabel="Delete" tone="danger" />
    </>
  );
}


