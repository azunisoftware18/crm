'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/common/PageHeader';
import { Button, Input, FormField, Select, Textarea } from '@/components/common';
import { createDispatch } from '@/services/dispatchApi';
import { useToast } from '@/components/common/Toast';

export default function NewDispatchPage() {
  const router = useRouter();
  const toast = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ customerId: '', customerName: '', invoiceId: '', items: [{ product: '', qty: 1 }], dispatchDate: '', transportMode: 'Road' });

  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));
  const setItem = (i, field) => (e) => setForm((prev) => ({ ...prev, items: prev.items.map((it, idx) => idx === i ? { ...it, [field]: e.target.value } : it) }));
  const addItem = () => setForm((prev) => ({ ...prev, items: [...prev.items, { product: '', qty: 1 }] }));
  const removeItem = (i) => setForm((prev) => ({ ...prev, items: prev.items.filter((_, idx) => idx !== i) }));

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const dispatch = await createDispatch({ ...form, dispatchDate: form.dispatchDate || new Date().toISOString().slice(0, 10) });
      toast.success('Dispatch created', `Dispatch ${dispatch.id} created.`);
      router.push('/dispatch');
    } catch {
      toast.error('Failed', 'Could not create dispatch.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageHeader title="New Dispatch" subtitle="Create a new dispatch record." />
      <form onSubmit={submit} className="card mt-6 p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Customer name" htmlFor="customerName" required><Input id="customerName" value={form.customerName} onChange={set('customerName')} placeholder="Customer name" required /></FormField>
          <FormField label="Invoice ID" htmlFor="invoiceId" required><Input id="invoiceId" value={form.invoiceId} onChange={set('invoiceId')} placeholder="Invoice ID" required /></FormField>
          <FormField label="Dispatch date" htmlFor="dispatchDate" required><Input id="dispatchDate" type="date" value={form.dispatchDate} onChange={set('dispatchDate')} required /></FormField>
          <FormField label="Transport Mode" htmlFor="transportMode" required>
            <Select id="transportMode" value={form.transportMode} onChange={set('transportMode')} options={['Road', 'Rail', 'Air', 'Ship']} />
          </FormField>
        </div>
        <div className="mt-4">
          <h3 className="text-sm font-semibold text-gray-900">Items</h3>
          <div className="mt-2 space-y-2">
            {form.items.map((item, i) => (
              <div key={i} className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                <Input placeholder="Product" value={item.product} onChange={setItem(i, 'product')} required />
                <Input type="number" placeholder="Qty" value={item.qty} onChange={setItem(i, 'qty')} required />
                <Button type="button" variant="danger" onClick={() => removeItem(i)} className="sm:w-auto">Remove</Button>
              </div>
            ))}
          </div>
          <Button type="button" variant="secondary" onClick={addItem} className="mt-2">Add item</Button>
        </div>
        <div className="mt-6 flex items-center justify-end gap-2">
          <Button type="button" variant="secondary" onClick={() => router.push('/dispatch')}>Cancel</Button>
          <Button type="submit" loading={submitting}>Create dispatch</Button>
        </div>
      </form>
    </>
  );
}


