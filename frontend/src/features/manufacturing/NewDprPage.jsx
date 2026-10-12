'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/common/PageHeader';
import { Button, Input, FormField, Select, Textarea } from '@/components/common';
import { createDailyProductionReport } from '@/services/manufacturingApi';
import { useToast } from '@/components/common/Toast';

export default function NewDprPage() {
  const router = useRouter();
  const toast = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ batchId: '', product: '', shift: 'Morning', outputQty: 0, rejectionQty: 0, remarks: '', date: '' });

  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const dpr = await createDailyProductionReport({ ...form, date: form.date || new Date().toISOString().slice(0, 10) });
      toast.success('DPR created', `DPR ${dpr.id} created.`);
      router.push('/manufacturing/dpr');
    } catch {
      toast.error('Failed', 'Could not create DPR.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageHeader title="New Daily Production Report" subtitle="Record daily production output." />
      <form onSubmit={submit} className="card mt-6 p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Batch ID" htmlFor="batchId" required><Input id="batchId" value={form.batchId} onChange={set('batchId')} placeholder="Batch ID" required /></FormField>
          <FormField label="Product" htmlFor="product" required><Input id="product" value={form.product} onChange={set('product')} placeholder="Product name" required /></FormField>
          <FormField label="Shift" htmlFor="shift" required>
            <Select id="shift" value={form.shift} onChange={set('shift')} options={['Morning', 'Afternoon', 'Night']} />
          </FormField>
          <FormField label="Date" htmlFor="date" required><Input id="date" type="date" value={form.date} onChange={set('date')} required /></FormField>
          <FormField label="Output Qty" htmlFor="outputQty" required><Input id="outputQty" type="number" value={form.outputQty} onChange={set('outputQty')} required /></FormField>
          <FormField label="Rejection Qty" htmlFor="rejectionQty" required><Input id="rejectionQty" type="number" value={form.rejectionQty} onChange={set('rejectionQty')} required /></FormField>
        </div>
        <FormField label="Remarks" htmlFor="remarks" className="mt-4"><Input id="remarks" value={form.remarks} onChange={set('remarks')} /></FormField>
        <div className="mt-6 flex items-center justify-end gap-2">
          <Button type="button" variant="secondary" onClick={() => router.push('/manufacturing/dpr')}>Cancel</Button>
          <Button type="submit" loading={submitting}>Create DPR</Button>
        </div>
      </form>
    </>
  );
}


