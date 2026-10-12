'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/common/PageHeader';
import { Button, Input, FormField, Select, Textarea } from '@/components/common';
import { createFormulation } from '@/services/manufacturingApi';
import { useToast } from '@/components/common/Toast';

export default function NewFormulationPage() {
  const router = useRouter();
  const toast = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: '', product: '', ingredients: [{ item: '', percentage: 0 }], version: '1.0', notes: '' });

  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));
  const setItem = (i, field) => (e) => setForm((prev) => ({ ...prev, ingredients: prev.ingredients.map((it, idx) => idx === i ? { ...it, [field]: e.target.value } : it) }));
  const addItem = () => setForm((prev) => ({ ...prev, ingredients: [...prev.ingredients, { item: '', percentage: 0 }] }));
  const removeItem = (i) => setForm((prev) => ({ ...prev, ingredients: prev.ingredients.filter((_, idx) => idx !== i) }));

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const f = await createFormulation(form);
      toast.success('Formulation created', `Formulation ${f.id} created.`);
      router.push('/manufacturing/formulations');
    } catch {
      toast.error('Failed', 'Could not create formulation.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageHeader title="New Formulation" subtitle="Add a new formulation recipe." />
      <form onSubmit={submit} className="card mt-6 p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Name" htmlFor="name" required><Input id="name" value={form.name} onChange={set('name')} placeholder="Formulation name" required /></FormField>
          <FormField label="Product" htmlFor="product" required><Input id="product" value={form.product} onChange={set('product')} placeholder="Product name" required /></FormField>
          <FormField label="Version" htmlFor="version" required><Input id="version" value={form.version} onChange={set('version')} placeholder="1.0" required /></FormField>
        </div>
        <div className="mt-4">
          <h3 className="text-sm font-semibold text-gray-900">Ingredients</h3>
          <div className="mt-2 space-y-2">
            {form.ingredients.map((ing, i) => (
              <div key={i} className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                <Input placeholder="Item" value={ing.item} onChange={setItem(i, 'item')} required />
                <Input type="number" placeholder="%" value={ing.percentage} onChange={setItem(i, 'percentage')} required />
                <Button type="button" variant="danger" onClick={() => removeItem(i)} className="sm:w-auto">Remove</Button>
              </div>
            ))}
          </div>
          <Button type="button" variant="secondary" onClick={addItem} className="mt-2">Add ingredient</Button>
        </div>
        <FormField label="Notes" htmlFor="notes" className="mt-4"><Input id="notes" value={form.notes} onChange={set('notes')} /></FormField>
        <div className="mt-6 flex items-center justify-end gap-2">
          <Button type="button" variant="secondary" onClick={() => router.push('/manufacturing/formulations')}>Cancel</Button>
          <Button type="submit" loading={submitting}>Create formulation</Button>
        </div>
      </form>
    </>
  );
}


