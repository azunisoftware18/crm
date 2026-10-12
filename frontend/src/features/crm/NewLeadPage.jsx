'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/common/PageHeader';
import { Button, Input, FormField, Select } from '@/components/common';
import { createLead } from '@/services/crmApi';
import { STATUS_SETS } from '@/config/statusConfig';
import { useToast } from '@/components/common/Toast';

const STATUS_OPTIONS = STATUS_SETS.lead.filter((s) => !['Converted', 'Lost'].includes(s));

export default function NewLeadPage() {
  const router = useRouter();
  const toast = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    company: '',
    contact: '',
    phone: '',
    source: 'IndiaMART',
    products: '',
    status: 'New',
    priority: 'Medium',
    assignedTo: '',
    nextAction: '',
    nextActionDate: '',
  });

  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const lead = await createLead({
        ...form,
        createdAt: new Date().toISOString(),
        read: false,
        actionRequired: false,
        linkedRecord: '',
        responsible: '',
        dueDate: null,
      });
      toast.success('Lead created', `Lead ${lead.id} has been created.`);
      router.push('/crm/leads');
    } catch {
      toast.error('Failed', 'Could not create lead.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageHeader title="New Lead" subtitle="Capture lead source, contact details and next action." />
      <form onSubmit={submit} className="card mt-6 p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Company" htmlFor="company" required><Input id="company" value={form.company} onChange={set('company')} placeholder="Company name" required /></FormField>
          <FormField label="Contact person" htmlFor="contact" required><Input id="contact" value={form.contact} onChange={set('contact')} placeholder="Full name" required /></FormField>
          <FormField label="Phone" htmlFor="phone" required><Input id="phone" value={form.phone} onChange={set('phone')} placeholder="+91 ..." required /></FormField>
          <FormField label="Source" htmlFor="source" required>
            <Select id="source" value={form.source} onChange={set('source')} options={['IndiaMART', 'TradeIndia', 'Justdial', 'Instagram', 'Website', 'Phone Calls', 'Manual']} />
          </FormField>
          <FormField label="Products of interest" htmlFor="products" required><Input id="products" value={form.products} onChange={set('products')} placeholder="Soap noodles, colours..." required /></FormField>
          <FormField label="Status" htmlFor="status" required>
            <Select id="status" value={form.status} onChange={set('status')} options={STATUS_OPTIONS} />
          </FormField>
          <FormField label="Priority" htmlFor="priority" required>
            <Select id="priority" value={form.priority} onChange={set('priority')} options={['Low', 'Medium', 'High']} />
          </FormField>
          <FormField label="Assigned To" htmlFor="assignedTo" required><Input id="assignedTo" value={form.assignedTo} onChange={set('assignedTo')} placeholder="Sales rep name" required /></FormField>
          <FormField label="Next action" htmlFor="nextAction" required><Input id="nextAction" value={form.nextAction} onChange={set('nextAction')} placeholder="Call / share quotation" required /></FormField>
          <FormField label="Next action date" htmlFor="nextActionDate" required><Input id="nextActionDate" type="date" value={form.nextActionDate} onChange={set('nextActionDate')} required /></FormField>
        </div>
        <div className="mt-6 flex items-center justify-end gap-2">
          <Button type="button" variant="secondary" onClick={() => router.push('/crm/leads')}>Cancel</Button>
          <Button type="submit" loading={submitting}>Create lead</Button>
        </div>
      </form>
    </>
  );
}


