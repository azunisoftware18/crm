'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/common/PageHeader';
import { Button, Input, FormField, Select } from '@/components/common';
import { createQuotation } from '@/services/salesApi';
import { useToast } from '@/components/common/Toast';

export default function NewQuotationPage() {
  const router = useRouter();
  const toast = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    customerId: '',
    customerName: '',
    validUntil: '',
    items: [{ product: '', qty: 1, rate: 0 }],
    discount: 0,
    gst: 18,
    notes: '',
  });

  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));
  const setItem = (i, field) => (e) => setForm((prev) => ({ ...prev, items: prev.items.map((it, idx) => idx === i ? { ...it, [field]: e.target.value } : it) }));
  const addItem = () => setForm((prev) => ({ ...prev, items: [...prev.items, { product: '', qty: 1, rate: 0 }] }));
  const removeItem = (i) => setForm((prev) => ({ ...prev, items: prev.items.filter((_, idx) => idx !== i) }));

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const quote = await createQuotation(form);
      toast.success('Quotation created', `Quotation ${quote.id} created.`);
      router.push('/sales/quotations');
    } catch {
      toast.error('Failed', 'Could not create quotation.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageHeader title="New Quotation" subtitle="Prepare a quotation for the customer." />
      <form onSubmit={submit} className="card mt-6 p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Customer name" htmlFor="customerName" required><Input id="customerName" value={form.customerName} onChange={set('customerName')} placeholder="Customer name" required /></FormField>
          <FormField label="Valid until" htmlFor="validUntil" required><Input id="validUntil" type="date" value={form.validUntil} onChange={set('validUntil')} required /></FormField>
        </div>
        <div className="mt-4">
          <h3 className="text-sm font-semibold text-gray-900">Items</h3>
          <div className="mt-2 space-y-2">
            {form.items.map((item, i) => (
              <div key={i} className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                <Input placeholder="Product" value={item.product} onChange={setItem(i, 'product')} required />
                <Input type="number" placeholder="Qty" value={item.qty} onChange={setItem(i, 'qty')} required />
                <Input type="number" placeholder="Rate" value={item.rate} onChange={setItem(i, 'rate')} required />
                <Button type="button" variant="danger" onClick={() => removeItem(i)} className="sm:w-auto">Remove</Button>
              </div>
            ))}
          </div>
          <Button type="button" variant="secondary" onClick={addItem} className="mt-2">Add item</Button>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <FormField label="Discount" htmlFor="discount"><Input id="discount" type="number" value={form.discount} onChange={set('discount')} /></FormField>
          <FormField label="GST %" htmlFor="gst"><Input id="gst" type="number" value={form.gst} onChange={set('gst')} /></FormField>
        </div>
        <FormField label="Notes" htmlFor="notes" className="mt-4"><Input id="notes" value={form.notes} onChange={set('notes')} /></FormField>
        <div className="mt-6 flex items-center justify-end gap-2">
          <Button type="button" variant="secondary" onClick={() => router.push('/sales/quotations')}>Cancel</Button>
          <Button type="submit" loading={submitting}>Create quotation</Button>
        </div>
      </form>
    </>
  );
}


