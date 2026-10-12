'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/common/PageHeader';
import { Button, Input, FormField, Select } from '@/components/common';
import { createBatch } from '@/services/inventoryApi';
import { useToast } from '@/components/common/Toast';

export default function NewBatchPage() {
  const router = useRouter();
  const toast = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ product: '', batchNo: '', qty: 0, mfgDate: '', expiryDate: '', status: 'Active' });

  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const batch = await createBatch(form);
      toast.success('Batch created', `Batch ${batch.id} created.`);
      router.push('/inventory/batches');
    } catch {
      toast.error('Failed', 'Could not create batch.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageHeader title="New Batch" subtitle="Create a production batch." />
      <form onSubmit={submit} className="card mt-6 p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Product" htmlFor="product" required><Input id="product" value={form.product} onChange={set('product')} placeholder="Product name" required /></FormField>
          <FormField label="Batch No" htmlFor="batchNo" required><Input id="batchNo" value={form.batchNo} onChange={set('batchNo')} placeholder="Batch number" required /></FormField>
          <FormField label="Quantity" htmlFor="qty" required><Input id="qty" type="number" value={form.qty} onChange={set('qty')} required /></FormField>
          <FormField label="Manufacturing Date" htmlFor="mfgDate" required><Input id="mfgDate" type="date" value={form.mfgDate} onChange={set('mfgDate')} required /></FormField>
          <FormField label="Expiry Date" htmlFor="expiryDate" required><Input id="expiryDate" type="date" value={form.expiryDate} onChange={set('expiryDate')} required /></FormField>
          <FormField label="Status" htmlFor="status" required>
            <Select id="status" value={form.status} onChange={set('status')} options={['Active', 'Closed']} />
          </FormField>
        </div>
        <div className="mt-6 flex items-center justify-end gap-2">
          <Button type="button" variant="secondary" onClick={() => router.push('/inventory/batches')}>Cancel</Button>
          <Button type="submit" loading={submitting}>Create batch</Button>
        </div>
      </form>
    </>
  );
}


