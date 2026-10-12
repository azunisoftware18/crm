'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/common/PageHeader';
import { Button, Input, FormField, Select, Textarea } from '@/components/common';
import { createGrn } from '@/services/inventoryApi';
import { useToast } from '@/components/common/Toast';

export default function NewGrnPage() {
  const router = useRouter();
  const toast = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ poId: '', supplierName: '', items: [{ item: '', qty: 1 }], grnDate: '', inspected: false });

  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));
  const setItem = (i, field) => (e) => setForm((prev) => ({ ...prev, items: prev.items.map((it, idx) => idx === i ? { ...it, [field]: e.target.value } : it) }));
  const addItem = () => setForm((prev) => ({ ...prev, items: [...prev.items, { item: '', qty: 1 }] }));
  const removeItem = (i) => setForm((prev) => ({ ...prev, items: prev.items.filter((_, idx) => idx !== i) }));

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const grn = await createGrn({ ...form, grnDate: form.grnDate || new Date().toISOString().slice(0, 10) });
      toast.success('GRN created', `GRN ${grn.id} created.`);
      router.push('/inventory/grn');
    } catch {
      toast.error('Failed', 'Could not create GRN.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageHeader title="New GRN" subtitle="Record goods receipt against PO." />
      <form onSubmit={submit} className="card mt-6 p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="PO ID" htmlFor="poId" required><Input id="poId" value={form.poId} onChange={set('poId')} placeholder="PO ID" required /></FormField>
          <FormField label="Supplier name" htmlFor="supplierName" required><Input id="supplierName" value={form.supplierName} onChange={set('supplierName')} placeholder="Supplier" required /></FormField>
        </div>
        <div className="mt-4">
          <h3 className="text-sm font-semibold text-gray-900">Items</h3>
          <div className="mt-2 space-y-2">
            {form.items.map((item, i) => (
              <div key={i} className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                <Input placeholder="Item" value={item.item} onChange={setItem(i, 'item')} required />
                <Input type="number" placeholder="Qty" value={item.qty} onChange={setItem(i, 'qty')} required />
                <Button type="button" variant="danger" onClick={() => removeItem(i)} className="sm:w-auto">Remove</Button>
              </div>
            ))}
          </div>
          <Button type="button" variant="secondary" onClick={addItem} className="mt-2">Add item</Button>
        </div>
        <FormField label="GRN Date" htmlFor="grnDate" className="mt-4"><Input id="grnDate" type="date" value={form.grnDate} onChange={set('grnDate')} /></FormField>
        <div className="mt-6 flex items-center justify-end gap-2">
          <Button type="button" variant="secondary" onClick={() => router.push('/inventory/grn')}>Cancel</Button>
          <Button type="submit" loading={submitting}>Create GRN</Button>
        </div>
      </form>
    </>
  );
}


