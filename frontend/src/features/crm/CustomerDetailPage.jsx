'use client'

import { useMemo } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import PageHeader from '@/components/common/PageHeader';
import StatusBadge from '@/components/common/StatusBadge';
import Button from '@/components/common/Button';
import { getCustomer } from '@/services/crmApi';

export default function CustomerDetailPage() {
  const { id } = useParams();
  const customer = useMemo(() => getCustomer(id), [id]);

  if (!customer) return <PageHeader title="Customer not found" subtitle="The requested customer could not be found." />;

  const fields = [
    { label: 'Name', value: customer.name },
    { label: 'Contact', value: customer.contact },
    { label: 'Phone', value: customer.phone },
    { label: 'City', value: customer.city },
    { label: 'GSTIN', value: customer.gstin },
    { label: 'Payment Terms', value: customer.paymentTerms },
    { label: 'Credit Limit', value: `₹ ${Number(customer.creditLimit).toLocaleString('en-IN')}` },
    { label: 'Status', value: <StatusBadge status={customer.status} /> },
  ];

  return (
    <>
      <PageHeader
        title={`Customer ${customer.id}`}
        subtitle={customer.name}
        actions={
          <Link href="/crm/customers"><Button variant="secondary">Back</Button></Link>
        }
      />
      <div className="card mt-6 p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          {fields.map((field) => (
            <div key={field.label} className="rounded-lg border border-slate-200 bg-slate-50/60 p-3">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">{field.label}</p>
              <p className="mt-1 text-sm font-medium text-slate-900">{typeof field.value === 'string' ? field.value : field.value}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}


