'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/common/PageHeader';
import { Button, Input, FormField, Select } from '@/components/common';
import { createProduction } from '@/services/manufacturingApi';
import { useToast } from '@/components/common/Toast';

export default function NewProductionPage() {
  const router = useRouter();
  const toast = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ batchId: '', product: '', plannedQty: 0, producedQty: 0, startDate: '', endDate: '', status: 'Planned' });

  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const prod = await createProduction(form);
      toast.success('Production created', `Production ${prod.id} created.`);
      router.push('/manufacturing/production');
    } catch {
      toast.error('Failed', 'Could not create production record.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageHeader title="New Production" subtitle="Create a new production record." />
      <form onSubmit={submit} className="card mt-6 p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Batch ID" htmlFor="batchId" required><Input id="batchId" value={form.batchId} onChange={set('batchId')} placeholder="Batch ID" required /></FormField>
          <FormField label="Product" htmlFor="product" required><Input id="product" value={form.product} onChange={set('product')} placeholder="Product name" required /></FormField>
          <FormField label="Planned Qty" htmlFor="plannedQty" required><Input id="plannedQty" type="number" value={form.plannedQty} onChange={set('plannedQty')} required /></FormField>
          <FormField label="Produced Qty" htmlFor="producedQty" required><Input id="producedQty" type="number" value={form.producedQty} onChange={set('producedQty')} required /></FormField>
          <FormField label="Start Date" htmlFor="startDate" required><Input id="startDate" type="date" value={form.startDate} onChange={set('startDate')} required /></FormField>
          <FormField label="End Date" htmlFor="endDate" required><Input id="endDate" type="date" value={form.endDate} onChange={set('endDate')} required /></FormField>
          <FormField label="Status" htmlFor="status" required>
            <Select id="status" value={form.status} onChange={set('status')} options={['Planned', 'In Progress', 'Completed', 'Cancelled']} />
          </FormField>
        </div>
        <div className="mt-6 flex items-center justify-end gap-2">
          <Button type="button" variant="secondary" onClick={() => router.push('/manufacturing/production')}>Cancel</Button>
          <Button type="submit" loading={submitting}>Create production</Button>
        </div>
      </form>
    </>
  );
}


