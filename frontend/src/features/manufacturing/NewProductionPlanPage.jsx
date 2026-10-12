'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/common/PageHeader';
import { Button, Input, FormField, Select, Textarea } from '@/components/common';
import { createProductionPlan } from '@/services/manufacturingApi';
import { useToast } from '@/components/common/Toast';

export default function NewProductionPlanPage() {
  const router = useRouter();
  const toast = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ product: '', plannedQty: 0, startDate: '', endDate: '', priority: 'Medium', notes: '' });

  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const plan = await createProductionPlan(form);
      toast.success('Plan created', `Plan ${plan.id} created.`);
      router.push('/manufacturing/plans');
    } catch {
      toast.error('Failed', 'Could not create production plan.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageHeader title="New Production Plan" subtitle="Create a production plan." />
      <form onSubmit={submit} className="card mt-6 p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Product" htmlFor="product" required><Input id="product" value={form.product} onChange={set('product')} placeholder="Product name" required /></FormField>
          <FormField label="Planned Qty" htmlFor="plannedQty" required><Input id="plannedQty" type="number" value={form.plannedQty} onChange={set('plannedQty')} required /></FormField>
          <FormField label="Start Date" htmlFor="startDate" required><Input id="startDate" type="date" value={form.startDate} onChange={set('startDate')} required /></FormField>
          <FormField label="End Date" htmlFor="endDate" required><Input id="endDate" type="date" value={form.endDate} onChange={set('endDate')} required /></FormField>
          <FormField label="Priority" htmlFor="priority" required>
            <Select id="priority" value={form.priority} onChange={set('priority')} options={['Low', 'Medium', 'High']} />
          </FormField>
        </div>
        <FormField label="Notes" htmlFor="notes" className="mt-4"><Input id="notes" value={form.notes} onChange={set('notes')} /></FormField>
        <div className="mt-6 flex items-center justify-end gap-2">
          <Button type="button" variant="secondary" onClick={() => router.push('/manufacturing/plans')}>Cancel</Button>
          <Button type="submit" loading={submitting}>Create plan</Button>
        </div>
      </form>
    </>
  );
}


