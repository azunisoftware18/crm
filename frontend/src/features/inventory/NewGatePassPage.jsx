'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/common/PageHeader';
import { Button, Input, FormField, Select } from '@/components/common';
import { createGatePass } from '@/services/inventoryApi';
import { useToast } from '@/components/common/Toast';

export default function NewGatePassPage() {
  const router = useRouter();
  const toast = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ vehicleNo: '', driverName: '', purpose: 'Outbound', items: [{ item: '', qty: 1 }], passDate: '' });

  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));
  const setItem = (i, field) => (e) => setForm((prev) => ({ ...prev, items: prev.items.map((it, idx) => idx === i ? { ...it, [field]: e.target.value } : it) }));
  const addItem = () => setForm((prev) => ({ ...prev, items: [...prev.items, { item: '', qty: 1 }] }));
  const removeItem = (i) => setForm((prev) => ({ ...prev, items: prev.items.filter((_, idx) => idx !== i) }));

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const gp = await createGatePass({ ...form, passDate: form.passDate || new Date().toISOString().slice(0, 10) });
      toast.success('Gate pass created', `GP ${gp.id} created.`);
      router.push('/inventory/gate-passes');
    } catch {
      toast.error('Failed', 'Could not create gate pass.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageHeader title="New Gate Pass" subtitle="Record gate pass for material movement." />
      <form onSubmit={submit} className="card mt-6 p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Vehicle number" htmlFor="vehicleNo" required><Input id="vehicleNo" value={form.vehicleNo} onChange={set('vehicleNo')} placeholder="Vehicle number" required /></FormField>
          <FormField label="Driver name" htmlFor="driverName" required><Input id="driverName" value={form.driverName} onChange={set('driverName')} placeholder="Driver name" required /></FormField>
          <FormField label="Purpose" htmlFor="purpose" required>
            <Select id="purpose" value={form.purpose} onChange={set('purpose')} options={['Inbound', 'Outbound']} />
          </FormField>
          <FormField label="Pass date" htmlFor="passDate" required><Input id="passDate" type="date" value={form.passDate} onChange={set('passDate')} required /></FormField>
        </div>
        <div className="mt-4">
          <h3 className="text-sm font-semibold text-gray-900">Items</h3>
          <div className="mt-2 space-y-2">
            {form.items.map((item, i) => (
              <div key={i} className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                <Input placeholder="Item" value={item.item} onChange={setItem(i, 'item')} required />
                <Input type="number" placeholder="Qty" value={item.qty} onChange={setItem(i, 'qty')} required />
                <Button type="button" variant="danger" onClick={() => removeItem(i)} className="sm:w-auto">Remove</Button>
              </div>
            ))}
          </div>
          <Button type="button" variant="secondary" onClick={addItem} className="mt-2">Add item</Button>
        </div>
        <div className="mt-6 flex items-center justify-end gap-2">
          <Button type="button" variant="secondary" onClick={() => router.push('/inventory/gate-passes')}>Cancel</Button>
          <Button type="submit" loading={submitting}>Create gate pass</Button>
        </div>
      </form>
    </>
  );
}


