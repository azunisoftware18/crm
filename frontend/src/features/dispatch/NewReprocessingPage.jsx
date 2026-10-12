'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/common/PageHeader';
import { Button, Input, FormField, Select, Textarea } from '@/components/common';
import { createReprocessing } from '@/services/dispatchApi';
import { useToast } from '@/components/common/Toast';

export default function NewReprocessingPage() {
  const router = useRouter();
  const toast = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ returnId: '', reason: 'Quality Issue', reprocessedQty: 0, reprocessedDate: '', status: 'In Progress', remarks: '' });

  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const rp = await createReprocessing({ ...form, reprocessedDate: form.reprocessedDate || new Date().toISOString().slice(0, 10) });
      toast.success('Reprocessing created', `RP ${rp.id} created.`);
      router.push('/dispatch/reprocessing');
    } catch {
      toast.error('Failed', 'Could not create reprocessing.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageHeader title="New Reprocessing" subtitle="Record reprocessing action." />
      <form onSubmit={submit} className="card mt-6 p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Return ID" htmlFor="returnId" required><Input id="returnId" value={form.returnId} onChange={set('returnId')} placeholder="Return ID" required /></FormField>
          <FormField label="Reason" htmlFor="reason" required>
            <Select id="reason" value={form.reason} onChange={set('reason')} options={['Quality Issue', 'Packaging Issue', 'Customer Request', 'Other']} />
          </FormField>
          <FormField label="Reprocessed Qty" htmlFor="reprocessedQty" required><Input id="reprocessedQty" type="number" value={form.reprocessedQty} onChange={set('reprocessedQty')} required /></FormField>
          <FormField label="Reprocessed Date" htmlFor="reprocessedDate" required><Input id="reprocessedDate" type="date" value={form.reprocessedDate} onChange={set('reprocessedDate')} required /></FormField>
          <FormField label="Status" htmlFor="status" required>
            <Select id="status" value={form.status} onChange={set('status')} options={['In Progress', 'Completed', 'Cancelled']} />
          </FormField>
        </div>
        <FormField label="Remarks" htmlFor="remarks" className="mt-4"><Input id="remarks" value={form.remarks} onChange={set('remarks')} /></FormField>
        <div className="mt-6 flex items-center justify-end gap-2">
          <Button type="button" variant="secondary" onClick={() => router.push('/dispatch/reprocessing')}>Cancel</Button>
          <Button type="submit" loading={submitting}>Create reprocessing</Button>
        </div>
      </form>
    </>
  );
}


