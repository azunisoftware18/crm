'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/common/PageHeader';
import { Button, Input, FormField, Select } from '@/components/common';
import { createCustomerPayment } from '@/services/accountingApi';
import { useToast } from '@/components/common/Toast';

export default function NewCustomerPaymentPage() {
  const router = useRouter();
  const toast = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ customerId: '', customerName: '', amount: 0, paymentMode: 'Cash', paymentDate: '', reference: '', notes: '' });

  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payment = await createCustomerPayment({ ...form, paymentDate: form.paymentDate || new Date().toISOString().slice(0, 10) });
      toast.success('Payment recorded', `Payment ${payment.id} recorded.`);
      router.push('/payments/customers');
    } catch {
      toast.error('Failed', 'Could not record customer payment.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageHeader title="New Customer Payment" subtitle="Record a payment from customer." />
      <form onSubmit={submit} className="card mt-6 p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Customer name" htmlFor="customerName" required><Input id="customerName" value={form.customerName} onChange={set('customerName')} placeholder="Customer name" required /></FormField>
          <FormField label="Amount" htmlFor="amount" required><Input id="amount" type="number" value={form.amount} onChange={set('amount')} required /></FormField>
          <FormField label="Payment mode" htmlFor="paymentMode" required>
            <Select id="paymentMode" value={form.paymentMode} onChange={set('paymentMode')} options={['Cash', 'Cheque', 'NEFT', 'RTGS', 'UPI']} />
          </FormField>
          <FormField label="Payment date" htmlFor="paymentDate" required><Input id="paymentDate" type="date" value={form.paymentDate} onChange={set('paymentDate')} required /></FormField>
          <FormField label="Reference" htmlFor="reference" required><Input id="reference" value={form.reference} onChange={set('reference')} placeholder="Transaction ref" required /></FormField>
        </div>
        <FormField label="Notes" htmlFor="notes" className="mt-4"><Input id="notes" value={form.notes} onChange={set('notes')} /></FormField>
        <div className="mt-6 flex items-center justify-end gap-2">
          <Button type="button" variant="secondary" onClick={() => router.push('/payments/customers')}>Cancel</Button>
          <Button type="submit" loading={submitting}>Record payment</Button>
        </div>
      </form>
    </>
  );
}


