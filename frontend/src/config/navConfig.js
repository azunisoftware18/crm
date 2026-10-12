import { canAccessPath } from '@/routes/routeConfig';

/** Sidebar structure. Visibility is derived from routeConfig roles, so access rules live in one place. */
export const NAV = [
  { label: 'Dashboard', icon: 'LayoutDashboard', path: '/' },
  { label: 'Tasks', icon: 'CheckSquare', path: '/tasks' },
  { label: 'Notifications', icon: 'Bell', path: '/notifications' },
  {
    label: 'CRM', icon: 'Users', children: [
      { label: 'Leads', path: '/crm/leads' },
      { label: 'Customers', path: '/crm/customers' },
      { label: 'Follow-ups', path: '/crm/follow-ups' },
      { label: 'Activities', path: '/crm/activities' },
    ],
  },
  {
    label: 'Sales', icon: 'FileText', children: [
      { label: 'Products', path: '/sales/products' },
      { label: 'Quotations', path: '/sales/quotations' },
      { label: 'Proforma Invoices', path: '/sales/proforma-invoices' },
      { label: 'Customer Payments', path: '/sales/payments' },
    ],
  },
  {
    label: 'Contract Mfg', icon: 'Handshake', children: [
      { label: 'Orders', path: '/contract-manufacturing' },
      { label: 'Cost Sheets', path: '/contract-manufacturing/cost-sheets' },
    ],
  },
  {
    label: 'Purchase', icon: 'ShoppingCart', children: [
      { label: 'Purchase Requests', path: '/purchase/requests' },
      { label: 'Supplier Quotations', path: '/purchase/quotations' },
      { label: 'Comparison', path: '/purchase/quotations/compare' },
      { label: 'Purchase Orders', path: '/purchase/orders' },
      { label: 'Vendors', path: '/purchase/vendors' },
      { label: 'Item Library', path: '/purchase/items' },
      { label: 'Private Label', path: '/purchase/private-label' },
    ],
  },
  {
    label: 'Inventory', icon: 'Warehouse', children: [
      { label: 'Overview', path: '/inventory' },
      { label: 'Raw Materials', path: '/inventory/raw-materials' },
      { label: 'Packaging', path: '/inventory/packaging' },
      { label: 'Finished Goods', path: '/inventory/finished-goods' },
      { label: 'Stock Ledger', path: '/inventory/stock-movements' },
      { label: 'GRN', path: '/inventory/grn' },
      { label: 'Batches', path: '/inventory/batches' },
      { label: 'Gate Pass', path: '/inventory/gate-pass' },
      { label: 'Stock Verification', path: '/inventory/stock-verification' },
    ],
  },
  {
    label: 'Manufacturing', icon: 'Factory', children: [
      { label: 'Formulations', path: '/manufacturing/formulations' },
      { label: 'Production Plans', path: '/manufacturing/production-plans' },
      { label: 'Production', path: '/manufacturing/production' },
      { label: 'Daily Report (DPR)', path: '/manufacturing/dpr' },
      { label: 'Batches', path: '/manufacturing/batches' },
      { label: 'Reports', path: '/manufacturing/reports' },
    ],
  },
  {
    label: 'Dispatch', icon: 'Truck', children: [
      { label: 'Dispatch', path: '/dispatch' },
      { label: 'Transport & Freight', path: '/dispatch/transport' },
      { label: 'Delivery', path: '/dispatch/delivery' },
    ],
  },
  {
    label: 'Returns', icon: 'Undo2', children: [
      { label: 'Sales Returns', path: '/returns' },
      { label: 'Reprocessing', path: '/returns/reprocessing' },
    ],
  },
  {
    label: 'Payments', icon: 'Wallet', children: [
      { label: 'Overview', path: '/payments' },
      { label: 'Customer', path: '/payments/customer' },
      { label: 'Supplier', path: '/payments/supplier' },
      { label: 'Advances', path: '/payments/advances' },
      { label: 'Due', path: '/payments/due' },
      { label: 'Overdue', path: '/payments/overdue' },
    ],
  },
  {
    label: 'Accounting', icon: 'Landmark', children: [
      { label: 'Overview', path: '/accounting' },
      { label: 'Bank', path: '/accounting/bank' },
      { label: 'Reconciliation', path: '/accounting/reconciliation' },
      { label: 'Tally', path: '/accounting/tally' },
      { label: 'Bank Receipts', path: '/accounting/bank-receipts' },
      { label: 'Cash Receipts', path: '/accounting/cash-receipts' },
    ],
  },
  { label: 'Reports', icon: 'BarChart3', path: '/reports' },
  {
    label: 'Administration', icon: 'ShieldCheck', children: [
      { label: 'Users', path: '/admin/users' },
      { label: 'Roles', path: '/admin/roles' },
      { label: 'Permissions', path: '/admin/permissions' },
      { label: 'Audit Logs', path: '/admin/audit-logs' },
      { label: 'Settings', path: '/admin/settings' },
    ],
  },
];

/** Nav tree filtered for a role. Groups with no visible child are removed. */
export function getVisibleNav(role) {
  return NAV.map((item) => {
    if (item.path) return canAccessPath(role, item.path) ? item : null;
    const children = item.children.filter((c) => canAccessPath(role, c.path));
    return children.length ? { ...item, children } : null;
  }).filter(Boolean);
}

export const flattenNavPaths = (items) => items.flatMap((i) => (i.path ? [i.path] : i.children.map((c) => c.path)));
