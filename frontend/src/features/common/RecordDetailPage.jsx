'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import PageHeader from '@/components/common/PageHeader'
import Button from '@/components/common/Button'
import StatusBadge from '@/components/common/StatusBadge'
import { getLead } from '@/services/crmApi';
import { getProduct } from '@/services/salesApi';
import { getQuotation } from '@/services/salesApi';
import { getProformaInvoice } from '@/services/salesApi';
import { getCustomer } from '@/services/crmApi';
import { getPurchaseRequest } from '@/services/purchaseApi';
import { getSupplierQuotations } from '@/services/purchaseApi';
import { getPurchaseOrder } from '@/services/purchaseApi';
import { getVendor } from '@/services/purchaseApi';
import { getGrn } from '@/services/inventoryApi';
import { getProductionRuns } from '@/services/manufacturingApi';
import { getDispatch } from '@/services/dispatchApi';
import { getSalesReturn } from '@/services/dispatchApi';

const ROUTE_API_MAP = {
  '/crm/leads': { get: getLead, label: 'Lead' },
  '/crm/customers': { get: getCustomer, label: 'Customer' },
  '/sales/products': { get: getProduct, label: 'Product' },
  '/sales/quotations': { get: getQuotation, label: 'Quotation' },
  '/sales/proforma-invoices': { get: getProformaInvoice, label: 'Proforma Invoice' },
  '/purchase/requests': { get: getPurchaseRequest, label: 'Purchase Request' },
  '/purchase/quotations': { get: () => Promise.resolve(null), label: 'Supplier Quotation' },
  '/purchase/orders': { get: getPurchaseOrder, label: 'Purchase Order' },
  '/purchase/vendors': { get: getVendor, label: 'Vendor' },
  '/inventory/grn': { get: getGrn, label: 'GRN' },
  '/manufacturing/production': { get: (id) => getProductionRuns({}).then((rows) => rows.find((r) => r.id === id)), label: 'Production' },
  '/dispatch': { get: getDispatch, label: 'Dispatch' },
  '/returns': { get: getSalesReturn, label: 'Sales Return' },
};

function resolveApi(pathname) {
  for (const prefix of Object.keys(ROUTE_API_MAP)) {
    if (pathname === prefix || pathname.startsWith(`${prefix}/`)) return ROUTE_API_MAP[prefix];
  }
  return null;
}

export default function RecordDetailPage() {
  const pathname = usePathname();
  const api = useMemo(() => resolveApi(pathname), [pathname]);
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    if (!api) { setLoading(false); return; }
    const id = pathname.split('/').pop();
    Promise.resolve(api.get(id)).then((data) => {
      if (!cancelled) { setRecord(data); setLoading(false); }
    });
    return () => { cancelled = true; };
  }, [api, pathname]);

  if (!api) return <PageHeader title="Not found" subtitle="This record type does not have a detail view yet." />;

  if (loading) return <PageHeader title={`${api.label}`} subtitle="Loading..." />;

  if (!record) return <PageHeader title="Not found" subtitle="The requested record could not be found." />;

  return (
    <>
      <PageHeader title={`${api.label} ${record.id}`} subtitle={record.name || record.title || record.company || record.customer || record.vendor || record.invoice || ''} actions={<Link href={pathname.replace(/\/[^/]+\/?$/, '')}><Button variant="secondary">Back</Button></Link>} />
      <div className="card mt-6 p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          {Object.entries(record).filter(([key]) => key !== 'id').map(([key, value]) => (
            <div key={key} className="rounded-lg border border-slate-200 bg-slate-50/60 p-3">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">{key}</p>
              <p className="mt-1 text-sm font-medium text-slate-900">{typeof value === 'string' ? value : JSON.stringify(value)}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}


