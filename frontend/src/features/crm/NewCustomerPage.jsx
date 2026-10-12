'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/common/PageHeader";
import { Button, Input, FormField, Select } from "@/components/common";
import { createCustomer } from "@/services/crmApi";
import { useToast } from "@/components/common/Toast";

export default function NewCustomerPage() {
  const router = useRouter();
  const toast = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    contact: "",
    phone: "",
    city: "",
    gstin: "",
    paymentTerms: "30 days",
    creditLimit: 0,
    status: "Active",
  });

  const set = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const customer = await createCustomer(form);
      toast.success(
        "Customer created",
        `Customer ${customer.id} has been created.`,
      );
      router.push("/crm/customers");
    } catch {
      toast.error("Failed", "Could not create customer.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageHeader
        title="New Customer"
        subtitle="Add a new customer with contact and payment details."
      />
      <form onSubmit={submit} className="card mt-6 p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Name" htmlFor="name" required>
            <Input
              id="name"
              value={form.name}
              onChange={set("name")}
              placeholder="Customer name"
              required
            />
          </FormField>
          <FormField label="Contact person" htmlFor="contact" required>
            <Input
              id="contact"
              value={form.contact}
              onChange={set("contact")}
              placeholder="Full name"
              required
            />
          </FormField>
          <FormField label="Phone" htmlFor="phone" required>
            <Input
              id="phone"
              value={form.phone}
              onChange={set("phone")}
              placeholder="+91 ..."
              required
            />
          </FormField>
          <FormField label="City" htmlFor="city" required>
            <Input
              id="city"
              value={form.city}
              onChange={set("city")}
              placeholder="City"
              required
            />
          </FormField>
          <FormField label="GSTIN" htmlFor="gstin" required>
            <Input
              id="gstin"
              value={form.gstin}
              onChange={set("gstin")}
              placeholder="GSTIN"
              required
            />
          </FormField>
          <FormField label="Payment Terms" htmlFor="paymentTerms" required>
            <Select
              id="paymentTerms"
              value={form.paymentTerms}
              onChange={set("paymentTerms")}
              options={["Advance", "15 days", "30 days", "45 days", "60 days"]}
            />
          </FormField>
          <FormField label="Credit Limit" htmlFor="creditLimit" required>
            <Input
              id="creditLimit"
              type="number"
              value={form.creditLimit}
              onChange={set("creditLimit")}
              placeholder="0"
              required
            />
          </FormField>
          <FormField label="Status" htmlFor="status" required>
            <Select
              id="status"
              value={form.status}
              onChange={set("status")}
              options={["Active", "Inactive"]}
            />
          </FormField>
        </div>
        <div className="mt-6 flex items-center justify-end gap-2">
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.push("/crm/customers")}
          >
            Cancel
          </Button>
          <Button type="submit" loading={submitting}>
            Create customer
          </Button>
        </div>
      </form>
    </>
  );
}


