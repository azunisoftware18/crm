'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/common/PageHeader';
import { Button, Input, FormField, Select, Textarea } from '@/components/common';
import { createStockVerification } from '@/services/inventoryApi';
import { useToast } from '@/components/common/Toast';

export default function NewStockVerificationPage() {
  const router = useRouter();
  const toast = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ location: '', items: [{ item: '', systemQty: 0, physicalQty: 0 }], verifiedBy: '', status: 'Draft' });

  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));
  const setItem = (i, field) => (e) => setForm((prev) => ({ ...prev, items: prev.items.map((it, idx) => idx === i ? { ...it, [field]: e.target.value } : it) }));
  const addItem = () => setForm((prev) => ({ ...prev, items: [...prev.items, { item: '', systemQty: 0, physicalQty: 0 }] }));
  const removeItem = (i) => setForm((prev) => ({ ...prev, items: prev.items.filter((_, idx) => idx !== i) }));

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const sv = await createStockVerification(form);
      toast.success('Verification created', `SV ${sv.id} created.`);
      router.push('/inventory/stock-verification');
    } catch {
      toast.error('Failed', 'Could not create stock verification.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageHeader title="New Stock Verification" subtitle="Record stock verification results." />
      <form onSubmit={submit} className="card mt-6 p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Location" htmlFor="location" required><Input id="location" value={form.location} onChange={set('location')} placeholder="Warehouse / Godown" required /></FormField>
          <FormField label="Verified By" htmlFor="verifiedBy" required><Input id="verifiedBy" value={form.verifiedBy} onChange={set('verifiedBy')} placeholder="Name" required /></FormField>
        </div>
        <div className="mt-4">
          <h3 className="text-sm font-semibold text-gray-900">Items</h3>
          <div className="mt-2 space-y-2">
            {form.items.map((item, i) => (
              <div key={i} className="grid gap-2 sm:grid-cols-2 xl:grid-cols-5">
                <Input placeholder="Item" value={item.item} onChange={setItem(i, 'item')} required />
                <Input type="number" placeholder="System Qty" value={item.systemQty} onChange={setItem(i, 'systemQty')} required />
                <Input type="number" placeholder="Physical Qty" value={item.physicalQty} onChange={setItem(i, 'physicalQty')} required />
                <Button type="button" variant="danger" onClick={() => removeItem(i)} className="sm:w-auto">Remove</Button>
              </div>
            ))}
          </div>
          <Button type="button" variant="secondary" onClick={addItem} className="mt-2">Add item</Button>
        </div>
        <div className="mt-6 flex items-center justify-end gap-2">
          <Button type="button" variant="secondary" onClick={() => router.push('/inventory/stock-verification')}>Cancel</Button>
          <Button type="submit" loading={submitting}>Create verification</Button>
        </div>
      </form>
    </>
  );
}


