import PageHeader from '@/components/common/PageHeader';
import Button from '@/components/common/Button';
import { Save } from 'lucide-react';

export default function SettingsPage() {
  return (
    <>
      <PageHeader title="Settings" subtitle="Workflow configuration, reminder intervals and master data." />
      <div className="card mt-6 p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-slate-200 p-4">
            <p className="text-sm font-semibold text-slate-900">Approval reminder</p>
            <p className="text-xs text-slate-500">Remind managers after 24 hours.</p>
            <Button className="mt-3" icon={Save}>Save</Button>
          </div>
          <div className="rounded-lg border border-slate-200 p-4">
            <p className="text-sm font-semibold text-slate-900">Payment reminder</p>
            <p className="text-xs text-slate-500">Remind customers 3 days before due date.</p>
            <Button className="mt-3" icon={Save}>Save</Button>
          </div>
        </div>
      </div>
    </>
  );
}


