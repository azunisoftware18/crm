import { ROLES, ROLE_META } from '@/config/roles';
import PageHeader from '@/components/common/PageHeader';
import Button from '@/components/common/Button';
import { ShieldCheck } from 'lucide-react';

export default function RolesPage() {
  return (
    <>
      <PageHeader title="Roles" subtitle="Role definitions and responsibilities." />
      <div className="card mt-6 divide-y divide-slate-100 overflow-hidden">
        {Object.values(ROLES).map((role) => (
          <div key={role} className="flex items-start justify-between gap-4 px-5 py-4">
            <div className="flex items-center gap-3">
              <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${ROLE_META[role].tone}`}><ShieldCheck className="h-5 w-5" /></span>
              <div>
                <p className="text-sm font-semibold text-slate-900">{ROLE_META[role].label}</p>
                <p className="text-xs text-slate-500">{role}</p>
              </div>
            </div>
            <Button variant="secondary">Edit</Button>
          </div>
        ))}
      </div>
    </>
  );
}


