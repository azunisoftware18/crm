'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/common/PageHeader';
import { Button, Input, FormField, Select } from '@/components/common';
import { createProduct } from '@/services/salesApi';
import { useToast } from '@/components/common/Toast';

export default function NewProductPage() {
  const router = useRouter();
  const toast = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ code: '', name: '', category: 'Finished Goods', unit: 'pcs', status: 'Active' });

  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const product = await createProduct(form);
      toast.success('Product created', `Product ${product.id} has been created.`);
      router.push('/sales/products');
    } catch {
      toast.error('Failed', 'Could not create product.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageHeader title="New Product" subtitle="Add a new product to the master catalog." />
      <form onSubmit={submit} className="card mt-6 p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Code" htmlFor="code" required><Input id="code" value={form.code} onChange={set('code')} placeholder="Product code" required /></FormField>
          <FormField label="Name" htmlFor="name" required><Input id="name" value={form.name} onChange={set('name')} placeholder="Product name" required /></FormField>
          <FormField label="Category" htmlFor="category" required>
            <Select id="category" value={form.category} onChange={set('category')} options={['Soap Noodles', 'Finished Goods', 'Chemicals', 'Colours', 'Wrappers', 'Bottles', 'Perfume', 'Minerals']} />
          </FormField>
          <FormField label="Unit" htmlFor="unit" required>
            <Select id="unit" value={form.unit} onChange={set('unit')} options={['pcs', 'kg', 'L', 'Box', 'Set']} />
          </FormField>
          <FormField label="Status" htmlFor="status" required>
            <Select id="status" value={form.status} onChange={set('status')} options={['Active', 'Inactive']} />
          </FormField>
        </div>
        <div className="mt-6 flex items-center justify-end gap-2">
          <Button type="button" variant="secondary" onClick={() => router.push('/sales/products')}>Cancel</Button>
          <Button type="submit" loading={submitting}>Create product</Button>
        </div>
      </form>
    </>
  );
}


