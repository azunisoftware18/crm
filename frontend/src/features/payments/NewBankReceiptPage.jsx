'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/common/PageHeader';
import { Button, Input, FormField, Select } from '@/components/common';
import { createBankReceipt } from '@/services/accountingApi';
import { useToast } from '@/components/common/Toast';

export default function NewBankReceiptPage() {
  const router = useRouter();
  const toast = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ customerId: '', customerName: '', amount: 0, bankAccount: '', receiptDate: '', reference: '', notes: '' });

  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const receipt = await createBankReceipt({ ...form, receiptDate: form.receiptDate || new Date().toISOString().slice(0, 10) });
      toast.success('Receipt created', `Receipt ${receipt.id} created.`);
      router.push('/payments/bank-receipts');
    } catch {
      toast.error('Failed', 'Could not create bank receipt.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageHeader title="New Bank Receipt" subtitle="Record a bank receipt." />
      <form onSubmit={submit} className="card mt-6 p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Customer name" htmlFor="customerName" required><Input id="customerName" value={form.customerName} onChange={set('customerName')} placeholder="Customer name" required /></FormField>
          <FormField label="Amount" htmlFor="amount" required><Input id="amount" type="number" value={form.amount} onChange={set('amount')} required /></FormField>
          <FormField label="Bank account" htmlFor="bankAccount" required><Input id="bankAccount" value={form.bankAccount} onChange={set('bankAccount')} placeholder="Bank account" required /></FormField>
          <FormField label="Receipt date" htmlFor="receiptDate" required><Input id="receiptDate" type="date" value={form.receiptDate} onChange={set('receiptDate')} required /></FormField>
          <FormField label="Reference" htmlFor="reference" required><Input id="reference" value={form.reference} onChange={set('reference')} placeholder="Transaction ref" required /></FormField>
        </div>
        <FormField label="Notes" htmlFor="notes" className="mt-4"><Input id="notes" value={form.notes} onChange={set('notes')} /></FormField>
        <div className="mt-6 flex items-center justify-end gap-2">
          <Button type="button" variant="secondary" onClick={() => router.push('/payments/bank-receipts')}>Cancel</Button>
          <Button type="submit" loading={submitting}>Create receipt</Button>
        </div>
      </form>
    </>
  );
}


