'use client'

import { useMemo } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import PageHeader from '@/components/common/PageHeader';
import StatusBadge from '@/components/common/StatusBadge';
import PriorityBadge from '@/components/common/PriorityBadge';
import Button from '@/components/common/Button';
import { getLead } from '@/services/crmApi';

export default function LeadDetailPage() {
  const { id } = useParams();
  const lead = useMemo(() => getLead(id), [id]);

  if (!lead) return <PageHeader title="Lead not found" subtitle="The requested lead could not be found." />;

  const fields = [
    { label: 'Company', value: lead.company },
    { label: 'Contact', value: lead.contact },
    { label: 'Phone', value: lead.phone },
    { label: 'Source', value: lead.source },
    { label: 'Products', value: lead.products },
    { label: 'Status', value: <StatusBadge status={lead.status} /> },
    { label: 'Priority', value: <PriorityBadge priority={lead.priority} /> },
    { label: 'Assigned To', value: lead.assignedTo },
    { label: 'Next Action', value: lead.nextAction },
    { label: 'Next Action Date', value: lead.nextActionDate ? new Date(lead.nextActionDate).toLocaleDateString('en-IN') : '—' },
  ];

  return (
    <>
      <PageHeader
        title={`Lead ${lead.id}`}
        subtitle={lead.company}
        actions={
          <div className="flex items-center gap-2">
            <Link href="/crm/leads"><Button variant="secondary">Back</Button></Link>
          </div>
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


