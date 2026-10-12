/** Keep one placeholder value in each dashboard field during the local preview. */
const oneSample = '1 sample record'

export const dashboardKpis = {
  sales: [
    { label: 'Open leads', value: '1', hint: oneSample, icon: 'Users', tone: 'brand' },
    { label: 'Quotations in discussion', value: '1', hint: oneSample, icon: 'FileText', tone: 'info' },
    { label: 'PI pending approval', value: '1', hint: oneSample, icon: 'Clock', tone: 'warning' },
    { label: 'Overdue collections', value: '1', hint: oneSample, icon: 'Wallet', tone: 'danger' },
  ],
  manager: [
    { label: 'Approvals pending', value: '1', hint: oneSample, icon: 'ShieldCheck', tone: 'warning' },
    { label: 'GRN deviations open', value: '1', hint: oneSample, icon: 'AlertTriangle', tone: 'danger' },
    { label: 'Orders in production', value: '1', hint: oneSample, icon: 'Factory', tone: 'info' },
    { label: 'Receivables overdue', value: '1', hint: oneSample, icon: 'Wallet', tone: 'danger' },
  ],
  purchase: [
    { label: 'Requests in queue', value: '1', hint: oneSample, icon: 'ClipboardList', tone: 'brand' },
    { label: 'Quotations awaiting', value: '1', hint: oneSample, icon: 'Scale', tone: 'info' },
    { label: 'POs pending approval', value: '1', hint: oneSample, icon: 'Clock', tone: 'warning' },
    { label: 'Supplier payments due', value: '1', hint: oneSample, icon: 'Wallet', tone: 'danger' },
  ],
  plant: [
    { label: 'Production today', value: '1', hint: oneSample, icon: 'Factory', tone: 'brand' },
    { label: 'GRNs to create', value: '1', hint: oneSample, icon: 'Warehouse', tone: 'info' },
    { label: 'Low-stock items', value: '1', hint: oneSample, icon: 'AlertTriangle', tone: 'warning' },
    { label: 'Returns to inspect', value: '1', hint: oneSample, icon: 'Undo2', tone: 'danger' },
  ],
  accounts: [
    { label: 'Bank receipts unmatched', value: '1', hint: oneSample, icon: 'Landmark', tone: 'warning' },
    { label: 'Cash receipts pending', value: '1', hint: oneSample, icon: 'Wallet', tone: 'info' },
    { label: 'Supplier payments to prepare', value: '1', hint: oneSample, icon: 'ClipboardList', tone: 'brand' },
    { label: 'Tally sync failures', value: '1', hint: oneSample, icon: 'AlertTriangle', tone: 'danger' },
  ],
  dispatch: [
    { label: 'Ready to dispatch', value: '1', hint: oneSample, icon: 'Truck', tone: 'brand' },
    { label: 'Partially dispatched', value: '1', hint: oneSample, icon: 'Clock', tone: 'warning' },
    { label: 'Receiving pending', value: '1', hint: oneSample, icon: 'Inbox', tone: 'info' },
    { label: 'Freight unpaid', value: '1', hint: oneSample, icon: 'Wallet', tone: 'danger' },
  ],
  admin: [
    { label: 'Active users', value: '1', hint: oneSample, icon: 'Users', tone: 'brand' },
    { label: 'Audit events today', value: '1', hint: oneSample, icon: 'ScrollText', tone: 'info' },
    { label: 'Open support tasks', value: '1', hint: oneSample, icon: 'CheckSquare', tone: 'warning' },
    { label: 'Last backup', value: '1', hint: oneSample, icon: 'ShieldCheck', tone: 'success' },
  ],
}
