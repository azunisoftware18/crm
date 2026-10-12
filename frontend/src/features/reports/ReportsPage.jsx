'use client'

import { useSearchParams } from 'next/navigation';
import PageHeader from '@/components/common/PageHeader';
import Button from '@/components/common/Button';
import { BarChart3 } from 'lucide-react';

const MODULES = ['CRM', 'Sales', 'Purchase', 'Inventory', 'Manufacturing', 'Dispatch', 'Payments', 'Accounting'];

export default function ReportsPage() {
  const searchParams = useSearchParams();
  const activeModule = searchParams.get('module');

  return (
    <>
      <PageHeader
        title="Reports"
        subtitle="CRM, Sales, Purchase, Inventory, Manufacturing, Dispatch, Payment and Reconciliation reports with filters and export."
      />
      <div className="card mt-6 p-5">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {MODULES.map((module) => {
            const isActive = activeModule === module;
            return (
              <div
                key={module}
                className={`rounded-xl border p-4 transition-colors ${
                  isActive ? 'border-brand-500 bg-brand-50' : 'border-slate-200 bg-white hover:border-brand-400'
                }`}
              >
                <div className="flex items-center gap-2">
                  <BarChart3 className={`h-4 w-4 ${isActive ? 'text-brand-700' : 'text-brand-600'}`} />
                  <p className={`text-sm font-semibold ${isActive ? 'text-brand-700' : 'text-slate-900'}`}>{module} Reports</p>
                </div>
                <p className="mt-1 text-xs text-slate-500">Generate and export reports for {module.toLowerCase()}.</p>
                <Button
                  className="mt-3"
                  variant={isActive ? 'primary' : 'secondary'}
                  onClick={() => {
                    const url = new URL(window.location.href);
                    url.searchParams.set('module', module);
                    window.location.href = url.toString();
                  }}
                >
                  {isActive ? 'Viewing' : 'Open'}
                </Button>
              </div>
            );
          })}
        </div>
        {activeModule && (
          <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-6 text-center">
            <p className="text-sm font-semibold text-slate-900">{activeModule} Reports</p>
            <p className="mt-1 text-xs text-slate-500">Report generation and export will be available in the next phase.</p>
          </div>
        )}
      </div>
    </>
  );
}


