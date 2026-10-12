'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/common/PageHeader';
import { Button, Input, FormField, Select, Textarea } from '@/components/common';
import { createVendor } from '@/services/purchaseApi';
import { useToast } from '@/components/common/Toast';

export default function NewVendorPage() {
  const router = useRouter();
  const toast = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: '', contact: '', phone: '', city: '', gstin: '', paymentTerms: '30 days', status: 'Active' });

  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const vendor = await createVendor(form);
      toast.success('Vendor created', `Vendor ${vendor.id} created.`);
      router.push('/purchase/vendors');
    } catch {
      toast.error('Failed', 'Could not create vendor.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageHeader title="New Vendor" subtitle="Add a new vendor/supplier." />
      <form onSubmit={submit} className="card mt-6 p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Name" htmlFor="name" required><Input id="name" value={form.name} onChange={set('name')} placeholder="Vendor name" required /></FormField>
          <FormField label="Contact" htmlFor="contact" required><Input id="contact" value={form.contact} onChange={set('contact')} placeholder="Contact person" required /></FormField>
          <FormField label="Phone" htmlFor="phone" required><Input id="phone" value={form.phone} onChange={set('phone')} placeholder="+91 ..." required /></FormField>
          <FormField label="City" htmlFor="city" required><Input id="city" value={form.city} onChange={set('city')} placeholder="City" required /></FormField>
          <FormField label="GSTIN" htmlFor="gstin" required><Input id="gstin" value={form.gstin} onChange={set('gstin')} placeholder="GSTIN" required /></FormField>
          <FormField label="Payment Terms" htmlFor="paymentTerms" required>
            <Select id="paymentTerms" value={form.paymentTerms} onChange={set('paymentTerms')} options={['Advance', '15 days', '30 days', '45 days', '60 days']} />
          </FormField>
          <FormField label="Status" htmlFor="status" required>
            <Select id="status" value={form.status} onChange={set('status')} options={['Active', 'Inactive']} />
          </FormField>
        </div>
        <div className="mt-6 flex items-center justify-end gap-2">
          <Button type="button" variant="secondary" onClick={() => router.push('/purchase/vendors')}>Cancel</Button>
          <Button type="submit" loading={submitting}>Create vendor</Button>
        </div>
      </form>
    </>
  );
}


