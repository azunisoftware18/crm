import {
  CheckCircle2, XCircle, Wallet, AlertTriangle, PackageCheck, Truck, Factory, Warehouse,
  ListChecks, GitPullRequestArrow, Store, UserRound,
} from 'lucide-react';

/** Notification types from the brief; icons and tones are presentation only. */
export const NOTIFICATION_TYPES = {
  approval: { label: 'Approval', icon: CheckCircle2, tone: 'bg-violet-100 text-violet-600' },
  rejection: { label: 'Rejection', icon: XCircle, tone: 'bg-red-100 text-red-600' },
  payment_due: { label: 'Payment Due', icon: Wallet, tone: 'bg-amber-100 text-amber-600' },
  payment_overdue: { label: 'Payment Overdue', icon: Wallet, tone: 'bg-red-100 text-red-600' },
  grn: { label: 'GRN', icon: PackageCheck, tone: 'bg-sky-100 text-sky-600' },
  dispatch: { label: 'Dispatch', icon: Truck, tone: 'bg-teal-100 text-teal-600' },
  production: { label: 'Production', icon: Factory, tone: 'bg-emerald-100 text-emerald-600' },
  inventory: { label: 'Inventory', icon: Warehouse, tone: 'bg-orange-100 text-orange-600' },
  deviation: { label: 'Deviation', icon: AlertTriangle, tone: 'bg-red-100 text-red-600' },
  task: { label: 'Task', icon: ListChecks, tone: 'bg-indigo-100 text-indigo-600' },
  revision: { label: 'Revision', icon: GitPullRequestArrow, tone: 'bg-fuchsia-100 text-fuchsia-600' },
  vendor: { label: 'Vendor', icon: Store, tone: 'bg-amber-100 text-amber-600' },
  customer: { label: 'Customer', icon: UserRound, tone: 'bg-sky-100 text-sky-600' },
};
