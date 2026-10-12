'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/common/PageHeader';
import { Button, Input, FormField, Select, Textarea } from '@/components/common';
import { createPrivateLabelBrand } from '@/services/purchaseApi';
import { useToast } from '@/components/common/Toast';

export default function NewPrivateLabelPage() {
  const router = useRouter();
  const toast = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ brandName: '', customerId: '', customerName: '', products: '', status: 'Active' });

  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const brand = await createPrivateLabelBrand(form);
      toast.success('Brand created', `Brand ${brand.id} created.`);
      router.push('/purchase/private-label');
    } catch {
      toast.error('Failed', 'Could not create private label brand.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageHeader title="New Private Label Brand" subtitle="Register a new private label brand." />
      <form onSubmit={submit} className="card mt-6 p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Brand name" htmlFor="brandName" required><Input id="brandName" value={form.brandName} onChange={set('brandName')} placeholder="Brand name" required /></FormField>
          <FormField label="Customer ID" htmlFor="customerId" required><Input id="customerId" value={form.customerId} onChange={set('customerId')} placeholder="Customer ID" required /></FormField>
          <FormField label="Customer name" htmlFor="customerName" required><Input id="customerName" value={form.customerName} onChange={set('customerName')} placeholder="Customer name" required /></FormField>
          <FormField label="Products" htmlFor="products" required><Input id="products" value={form.products} onChange={set('products')} placeholder="Comma separated" required /></FormField>
          <FormField label="Status" htmlFor="status" required>
            <Select id="status" value={form.status} onChange={set('status')} options={['Active', 'Inactive']} />
          </FormField>
        </div>
        <div className="mt-6 flex items-center justify-end gap-2">
          <Button type="button" variant="secondary" onClick={() => router.push('/purchase/private-label')}>Cancel</Button>
          <Button type="submit" loading={submitting}>Create brand</Button>
        </div>
      </form>
    </>
  );
}


