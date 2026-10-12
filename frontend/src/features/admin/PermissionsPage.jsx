import PageHeader from '@/components/common/PageHeader';
import DataTable from '@/components/common/DataTable';
import { ACTION_ROLES } from '@/config/roles';
import Button from '@/components/common/Button';
import { ShieldCheck } from 'lucide-react';

export default function PermissionsPage() {
  const rows = Object.entries(ACTION_ROLES).map(([action, roles]) => ({
    action,
    roles: roles.join(', '),
  }));

  const columns = [
    { key: 'action', label: 'Action', sortable: true },
    { key: 'roles', label: 'Allowed Roles', sortable: false },
  ];

  return (
    <>
      <PageHeader title="Permissions" subtitle="Permission matrix by module: View, Create, Edit, Delete, Approve." />
      <div className="card mt-6 overflow-hidden p-5">
        <DataTable columns={columns} data={rows} rowKey="action" emptyTitle="No permissions found" />
      </div>
    </>
  );
}


