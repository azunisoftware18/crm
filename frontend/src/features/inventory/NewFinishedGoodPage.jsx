'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/common/PageHeader';
import { Button, Input, FormField, Select } from '@/components/common';
import { createInventoryItem } from '@/services/inventoryApi';
import { useToast } from '@/components/common/Toast';

export default function NewFinishedGoodPage() {
  const router = useRouter();
  const toast = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: '', category: 'Finished Goods', unit: 'pcs', reorderLevel: 50, status: 'Active' });

  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const item = await createInventoryItem({ ...form, category: 'Finished Goods' });
      toast.success('Item created', `Item ${item.id} created.`);
      router.push('/inventory/finished-goods');
    } catch {
      toast.error('Failed', 'Could not create finished good.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageHeader title="New Finished Good" subtitle="Add a new finished goods SKU." />
      <form onSubmit={submit} className="card mt-6 p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Name" htmlFor="name" required><Input id="name" value={form.name} onChange={set('name')} placeholder="Product name" required /></FormField>
          <FormField label="Unit" htmlFor="unit" required><Input id="unit" value={form.unit} onChange={set('unit')} placeholder="pcs" required /></FormField>
          <FormField label="Reorder Level" htmlFor="reorderLevel" required><Input id="reorderLevel" type="number" value={form.reorderLevel} onChange={set('reorderLevel')} required /></FormField>
          <FormField label="Status" htmlFor="status" required>
            <Select id="status" value={form.status} onChange={set('status')} options={['Active', 'Inactive']} />
          </FormField>
        </div>
        <div className="mt-6 flex items-center justify-end gap-2">
          <Button type="button" variant="secondary" onClick={() => router.push('/inventory/finished-goods')}>Cancel</Button>
          <Button type="submit" loading={submitting}>Create finished good</Button>
        </div>
      </form>
    </>
  );
}


