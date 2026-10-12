'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/common/PageHeader';
import { Button, Input, FormField, Select, Textarea } from '@/components/common';
import { createPurchaseRequest } from '@/services/purchaseApi';
import { useToast } from '@/components/common/Toast';

export default function NewPurchaseRequestPage() {
  const router = useRouter();
  const toast = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    item: '',
    category: 'Raw Material',
    qty: 1,
    uom: 'kg',
    requiredBy: '',
    notes: '',
  });

  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const pr = await createPurchaseRequest(form);
      toast.success('Request created', `PR ${pr.id} created.`);
      router.push('/purchase/requests');
    } catch {
      toast.error('Failed', 'Could not create purchase request.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageHeader title="New Purchase Request" subtitle="Request procurement of material or packaging." />
      <form onSubmit={submit} className="card mt-6 p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Item" htmlFor="item" required><Input id="item" value={form.item} onChange={set('item')} placeholder="Item name" required /></FormField>
          <FormField label="Category" htmlFor="category" required>
            <Select id="category" value={form.category} onChange={set('category')} options={['Raw Material', 'Packaging', 'Spare', 'Consumable']} />
          </FormField>
          <FormField label="Quantity" htmlFor="qty" required><Input id="qty" type="number" value={form.qty} onChange={set('qty')} required /></FormField>
          <FormField label="UOM" htmlFor="uom" required><Input id="uom" value={form.uom} onChange={set('uom')} placeholder="kg / pcs / L" required /></FormField>
          <FormField label="Required by" htmlFor="requiredBy" required><Input id="requiredBy" type="date" value={form.requiredBy} onChange={set('requiredBy')} required /></FormField>
        </div>
        <FormField label="Notes" htmlFor="notes" className="mt-4"><Input id="notes" value={form.notes} onChange={set('notes')} /></FormField>
        <div className="mt-6 flex items-center justify-end gap-2">
          <Button type="button" variant="secondary" onClick={() => router.push('/purchase/requests')}>Cancel</Button>
          <Button type="submit" loading={submitting}>Create request</Button>
        </div>
      </form>
    </>
  );
}


