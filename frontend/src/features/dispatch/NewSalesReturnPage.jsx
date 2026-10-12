'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/common/PageHeader';
import { Button, Input, FormField, Select, Textarea } from '@/components/common';
import { createSalesReturn } from '@/services/dispatchApi';
import { useToast } from '@/components/common/Toast';

export default function NewSalesReturnPage() {
  const router = useRouter();
  const toast = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ invoiceId: '', customerId: '', reason: 'Damaged', items: [{ product: '', qty: 1 }], returnDate: '' });

  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));
  const setItem = (i, field) => (e) => setForm((prev) => ({ ...prev, items: prev.items.map((it, idx) => idx === i ? { ...it, [field]: e.target.value } : it) }));
  const addItem = () => setForm((prev) => ({ ...prev, items: [...prev.items, { product: '', qty: 1 }] }));
  const removeItem = (i) => setForm((prev) => ({ ...prev, items: prev.items.filter((_, idx) => idx !== i) }));

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const sr = await createSalesReturn({ ...form, returnDate: form.returnDate || new Date().toISOString().slice(0, 10) });
      toast.success('Return created', `Return ${sr.id} created.`);
      router.push('/dispatch/returns');
    } catch {
      toast.error('Failed', 'Could not create sales return.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageHeader title="New Sales Return" subtitle="Record a sales return." />
      <form onSubmit={submit} className="card mt-6 p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Invoice ID" htmlFor="invoiceId" required><Input id="invoiceId" value={form.invoiceId} onChange={set('invoiceId')} placeholder="Invoice ID" required /></FormField>
          <FormField label="Customer ID" htmlFor="customerId" required><Input id="customerId" value={form.customerId} onChange={set('customerId')} placeholder="Customer ID" required /></FormField>
          <FormField label="Reason" htmlFor="reason" required>
            <Select id="reason" value={form.reason} onChange={set('reason')} options={['Damaged', 'Wrong Item', 'Expired', 'Customer Request']} />
          </FormField>
          <FormField label="Return date" htmlFor="returnDate" required><Input id="returnDate" type="date" value={form.returnDate} onChange={set('returnDate')} required /></FormField>
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
          <Button type="button" variant="secondary" onClick={() => router.push('/dispatch/returns')}>Cancel</Button>
          <Button type="submit" loading={submitting}>Create return</Button>
        </div>
      </form>
    </>
  );
}


