'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/common/PageHeader';
import { Button, Input, FormField, Select, Textarea } from '@/components/common';
import { createPurchaseOrder } from '@/services/purchaseApi';
import { useToast } from '@/components/common/Toast';

export default function NewPurchaseOrderPage() {
  const router = useRouter();
  const toast = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ supplierId: '', supplierName: '', expectedDelivery: '', items: [{ item: '', qty: 1, rate: 0 }], notes: '' });

  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));
  const setItem = (i, field) => (e) => setForm((prev) => ({ ...prev, items: prev.items.map((it, idx) => idx === i ? { ...it, [field]: e.target.value } : it) }));
  const addItem = () => setForm((prev) => ({ ...prev, items: [...prev.items, { item: '', qty: 1, rate: 0 }] }));
  const removeItem = (i) => setForm((prev) => ({ ...prev, items: prev.items.filter((_, idx) => idx !== i) }));

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const po = await createPurchaseOrder(form);
      toast.success('PO created', `PO ${po.id} created.`);
      router.push('/purchase/orders');
    } catch {
      toast.error('Failed', 'Could not create purchase order.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageHeader title="New Purchase Order" subtitle="Create a purchase order to supplier." />
      <form onSubmit={submit} className="card mt-6 p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Supplier name" htmlFor="supplierName" required><Input id="supplierName" value={form.supplierName} onChange={set('supplierName')} placeholder="Supplier name" required /></FormField>
          <FormField label="Expected delivery" htmlFor="expectedDelivery" required><Input id="expectedDelivery" type="date" value={form.expectedDelivery} onChange={set('expectedDelivery')} required /></FormField>
        </div>
        <div className="mt-4">
          <h3 className="text-sm font-semibold text-gray-900">Items</h3>
          <div className="mt-2 space-y-2">
            {form.items.map((item, i) => (
              <div key={i} className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                <Input placeholder="Item" value={item.item} onChange={setItem(i, 'item')} required />
                <Input type="number" placeholder="Qty" value={item.qty} onChange={setItem(i, 'qty')} required />
                <Input type="number" placeholder="Rate" value={item.rate} onChange={setItem(i, 'rate')} required />
                <Button type="button" variant="danger" onClick={() => removeItem(i)} className="sm:w-auto">Remove</Button>
              </div>
            ))}
          </div>
          <Button type="button" variant="secondary" onClick={addItem} className="mt-2">Add item</Button>
        </div>
        <FormField label="Notes" htmlFor="notes" className="mt-4"><Input id="notes" value={form.notes} onChange={set('notes')} /></FormField>
        <div className="mt-6 flex items-center justify-end gap-2">
          <Button type="button" variant="secondary" onClick={() => router.push('/purchase/orders')}>Cancel</Button>
          <Button type="submit" loading={submitting}>Create purchase order</Button>
        </div>
      </form>
    </>
  );
}


