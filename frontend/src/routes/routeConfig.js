import { ROLES, ALL_ROLES, BUSINESS_ROLES } from '@/config/roles';

const { SALES: S, MANAGER: M, PURCHASE: P, PLANT: L, ACCOUNTS: C, DISPATCH: D, ADMIN: X } = ROLES;

function matchPath({ path, end = false }, pathname) {
  if (path.includes(':')) {
    const regex = new RegExp('^' + path.replace(/:id/g, '[^/]+').replace(/\*/g, '.*') + (end ? '$' : ''));
    return regex.test(pathname);
  }
  if (end) return pathname === path;
  return pathname === path || pathname.startsWith(path + '/');
}

export const ROUTES = [
  { path: '/dashboard', title: 'Dashboard', module: 'Home', roles: ALL_ROLES, phase: 2, desc: 'Role-based overview with action-required notifications, tasks and key figures.' },
  { path: '/profile', title: 'My Profile', module: 'Account', roles: ALL_ROLES, phase: 10, desc: 'View your current user profile and account details.' },
  { path: '/notifications', title: 'Notifications', module: 'Home', roles: ALL_ROLES, phase: 9, desc: 'Notification history with linked record, required action, responsible user, due date, priority and read status.' },
  { path: '/tasks', title: 'Tasks', module: 'Home', roles: ALL_ROLES, phase: 9, statusKey: 'task', desc: 'Tasks and pending work: assigned to me, awaiting my action, overdue, approval pending and information-only.' },

  { path: '/crm/leads', title: 'Leads', module: 'CRM', roles: [S, M], phase: 2, statusKey: 'lead', desc: 'Leads from IndiaMART, TradeIndia, Justdial, Instagram, website, phone and manual entry, with assignment, priority and next action.' },
  { path: '/crm/leads/new', title: 'New Lead', module: 'CRM', roles: [S, M], phase: 2, desc: 'Capture a lead with source, customer details, products of interest, assignee, priority and duplicate detection.' },
  { path: '/crm/leads/:id', title: 'Lead Details', module: 'CRM', roles: [S, M], phase: 2, statusKey: 'lead', desc: 'Lead profile, communication history, follow-ups and conversion to customer with history preserved.' },
  { path: '/crm/customers', title: 'Customers', module: 'CRM', roles: [S, M, C], phase: 2, desc: 'Customer contacts, addresses, GST details, payment terms, credit information and order history.' },
  { path: '/crm/customers/new', title: 'New Customer', module: 'CRM', roles: [S, M], phase: 2, desc: 'Add a new customer with contact and payment details.' },
  { path: '/crm/customers/:id', title: 'Customer Details', module: 'CRM', roles: [S, M, C], phase: 2, desc: 'Tabs: Overview, Orders, Quotations, PI, Payments, Follow-ups, Communication, Documents.' },
  { path: '/crm/follow-ups', title: 'Follow-ups', module: 'CRM', roles: [S, M], phase: 2, desc: 'Follow-up dates, reminders, overdue alerts and repeat-customer reorder reminders.' },
  { path: '/crm/activities', title: 'Activities', module: 'CRM', roles: [S, M], phase: 2, desc: 'Calls, messages, WhatsApp, emails and meetings with date, user, subject, summary and customer response.' },

  { path: '/sales/products', title: 'Products', module: 'Sales', roles: [S, M, L], phase: 3, desc: 'Product master with specifications, packaging details and reference images.' },
  { path: '/sales/products/new', title: 'New Product', module: 'Sales', roles: [S, M], phase: 3, desc: 'Add a new product to the master catalog.' },
  { path: '/sales/products/:id', title: 'Product Details', module: 'Sales', roles: [S, M], phase: 3, desc: 'Product details and stock.' },
  { path: '/sales/quotations', title: 'Quotations', module: 'Sales', roles: [S, M], phase: 3, statusKey: 'buyerQuotationPi', desc: 'Buyer quotations with versions, prices, taxes, freight, payment terms, validity and discussion history.' },
  { path: '/sales/quotations/new', title: 'New Quotation', module: 'Sales', roles: [S, M], phase: 3, desc: 'Prepare a quotation for the customer.' },
  { path: '/sales/quotations/:id', title: 'Quotation Details', module: 'Sales', roles: [S, M], phase: 3, statusKey: 'buyerQuotationPi', desc: 'Quotation details.' },
  { path: '/sales/proforma-invoices', title: 'Proforma Invoices', module: 'Sales', roles: [S, M, C, D], phase: 3, statusKey: 'buyerQuotationPi', desc: 'PI with Manager approval, revision history and lock after approval. PI changes require re-approval.' },
  { path: '/sales/proforma-invoices/new', title: 'New Proforma Invoice', module: 'Sales', roles: [S, M], phase: 3, desc: 'Draft a proforma invoice.' },
  { path: '/sales/proforma-invoices/:id', title: 'Proforma Details', module: 'Sales', roles: [S, M], phase: 3, statusKey: 'buyerQuotationPi', desc: 'Proforma invoice details.' },
  { path: '/sales/payments', title: 'Customer Payments', module: 'Sales', roles: [S, M, C], phase: 3, statusKey: 'buyerCollection', desc: 'Buyer collection follow-up, payment references and outstanding balances.' },

  { path: '/contract-manufacturing', title: 'Contract Manufacturing Orders', module: 'Contract Manufacturing', roles: [S, M, P, C], phase: 6, desc: 'External contract manufacturer orders: allocation, supplier-reported vs Manager-verified ready quantity, dispatch approval and bill check.' },
  { path: '/contract-manufacturing/cost-sheets', title: 'Cost Sheets', module: 'Contract Manufacturing', roles: [M, P, S], phase: 6, desc: 'Versioned cost-sheet library with rate effective dates and per-order cost snapshots.' },

  { path: '/purchase/requests', title: 'Purchase Requests', module: 'Purchase', roles: [M, P, L], phase: 4, statusKey: 'purchaseRequest', desc: 'Raised by Manager or Plant Manager, approved by Manager, then enters the Purchase Manager queue.' },
  { path: '/purchase/requests/new', title: 'New Purchase Request', module: 'Purchase', roles: [M, P, L], phase: 4, desc: 'Request procurement of material or packaging.' },
  { path: '/purchase/requests/:id', title: 'Purchase Request Details', module: 'Purchase', roles: [M, P, L], phase: 4, statusKey: 'purchaseRequest', desc: 'Purchase request details.' },
  { path: '/purchase/quotations', title: 'Supplier Quotations', module: 'Purchase', roles: [M, P], phase: 4, statusKey: 'supplierQuotation', desc: 'Target five quotations per request, minimum two comparable quotations per item.' },
  { path: '/purchase/quotations/new', title: 'New Supplier Quotation', module: 'Purchase', roles: [M, P], phase: 4, desc: 'Request and record supplier quote.' },
  { path: '/purchase/quotations/:id', title: 'Supplier Quotation Details', module: 'Purchase', roles: [M, P], phase: 4, statusKey: 'supplierQuotation', desc: 'Supplier quotation details.' },
  { path: '/purchase/quotations/compare', title: 'Quotation Comparison', module: 'Purchase', roles: [M, P], phase: 4, statusKey: 'supplierQuotation', desc: 'Side-by-side comparison of specification, price, tax, freight, landed cost, delivery, payment terms, validity and deviations.' },
  { path: '/purchase/orders', title: 'Purchase Orders', module: 'Purchase', roles: [M, P, L, C], phase: 4, statusKey: 'purchaseOrder', desc: 'PO with delivery term, transport planning and supplier credit period. Manager approval is mandatory before execution.' },
  { path: '/purchase/orders/new', title: 'New Purchase Order', module: 'Purchase', roles: [M, P], phase: 4, desc: 'Create a purchase order to supplier.' },
  { path: '/purchase/orders/:id', title: 'Purchase Order Details', module: 'Purchase', roles: [M, P], phase: 4, statusKey: 'purchaseOrder', desc: 'Purchase order details.' },
  { path: '/purchase/vendors', title: 'Vendors', module: 'Purchase', roles: [M, P], phase: 4, statusKey: 'vendor', desc: 'Vendor proposals approved by Manager before PO release.' },
  { path: '/purchase/vendors/new', title: 'New Vendor', module: 'Purchase', roles: [M, P], phase: 4, desc: 'Add a new vendor/supplier.' },
  { path: '/purchase/vendors/:id', title: 'Vendor Details', module: 'Purchase', roles: [M, P], phase: 4, statusKey: 'vendor', desc: 'Vendor details.' },
  { path: '/purchase/items', title: 'Purchase Item Library', module: 'Purchase', roles: [M, P], phase: 4, desc: 'Section-wise items: Perfume, Minerals, Soap Noodles, Chemicals, Colours, Wrappers, Bottles and more.' },
  { path: '/purchase/private-label', title: 'Private Label Packaging', module: 'Purchase', roles: [S, M, P], phase: 4, statusKey: 'privateLabel', desc: 'Artwork upload, supplier quotation, design approval and commercial approval tracked independently.' },
  { path: '/purchase/private-label/new', title: 'New Private Label Brand', module: 'Purchase', roles: [S, M, P], phase: 4, desc: 'Register a new private label brand.' },
  { path: '/purchase/private-label/:id', title: 'Private Label Details', module: 'Purchase', roles: [S, M, P], phase: 4, statusKey: 'privateLabel', desc: 'Private label brand details.' },

  { path: '/inventory', title: 'Inventory Overview', module: 'Inventory', roles: [M, P, L, D], phase: 5, desc: 'Owned-factory stock summary with low-stock and reorder alerts.' },
  { path: '/inventory/raw-materials', title: 'Raw Materials', module: 'Inventory', roles: [M, P, L], phase: 5, desc: 'Raw material stock by item, category, batch, location and supplier.' },
  { path: '/inventory/raw-materials/new', title: 'New Raw Material', module: 'Inventory', roles: [M, P, L], phase: 5, desc: 'Add a new raw material item.' },
  { path: '/inventory/raw-materials/:id', title: 'Raw Material Details', module: 'Inventory', roles: [M, P, L], phase: 5, desc: 'Raw material details.' },
  { path: '/inventory/packaging', title: 'Packaging Materials', module: 'Inventory', roles: [M, P, L], phase: 5, desc: 'Packaging material stock with minimum stock and reorder levels.' },
  { path: '/inventory/packaging/new', title: 'New Packaging', module: 'Inventory', roles: [M, P, L], phase: 5, desc: 'Add a new packaging item.' },
  { path: '/inventory/packaging/:id', title: 'Packaging Details', module: 'Inventory', roles: [M, P, L], phase: 5, desc: 'Packaging details.' },
  { path: '/inventory/finished-goods', title: 'Finished Goods', module: 'Inventory', roles: [S, M, L, D], phase: 5, desc: 'Finished goods stock by product and batch.' },
  { path: '/inventory/finished-goods/new', title: 'New Finished Good', module: 'Inventory', roles: [S, M, L, D], phase: 5, desc: 'Add a new finished goods SKU.' },
  { path: '/inventory/finished-goods/:id', title: 'Finished Good Details', module: 'Inventory', roles: [S, M, L, D], phase: 5, desc: 'Finished good details.' },
  { path: '/inventory/stock-movements', title: 'Stock Ledger', module: 'Inventory', roles: [M, L], phase: 5, desc: 'Opening, receipts, issues, production consumption, sampling, dispatch, returns, reprocessing, adjustments and closing balance.' },
  { path: '/inventory/grn', title: 'Goods Receipt (GRN)', module: 'Inventory', roles: [M, P, L, C], phase: 5, statusKey: 'grn', desc: 'GRN against approved PO.' },
  { path: '/inventory/grn/new', title: 'New GRN', module: 'Inventory', roles: [M, P, L, C], phase: 5, desc: 'Record goods receipt against PO.' },
  { path: '/inventory/grn/:id', title: 'GRN Details', module: 'Inventory', roles: [M, P, L, C], phase: 5, statusKey: 'grn', desc: 'GRN details.' },
  { path: '/inventory/batches', title: 'Batches', module: 'Inventory', roles: [M, L], phase: 5, desc: 'Batch and lot tracking with traceability.' },
  { path: '/inventory/batches/new', title: 'New Batch', module: 'Inventory', roles: [M, L], phase: 5, desc: 'Create a production batch.' },
  { path: '/inventory/batches/:id', title: 'Batch Details', module: 'Inventory', roles: [M, L], phase: 5, desc: 'Batch details.' },
  { path: '/inventory/gate-pass', title: 'Gate Pass (Free Sampling)', module: 'Inventory', roles: [S, M, L], phase: 5, desc: 'Free-of-cost sampling issues with returnable tracking.' },
  { path: '/inventory/gate-pass/new', title: 'New Gate Pass', module: 'Inventory', roles: [S, M, L], phase: 5, desc: 'Record gate pass for material movement.' },
  { path: '/inventory/gate-pass/:id', title: 'Gate Pass Details', module: 'Inventory', roles: [S, M, L], phase: 5, desc: 'Gate pass details.' },
  { path: '/inventory/stock-verification', title: 'Physical Stock Verification', module: 'Inventory', roles: [M, L], phase: 5, desc: 'Fortnightly verification by item, batch and location with variance reasons and Manager approval beyond limits.' },
  { path: '/inventory/stock-verification/new', title: 'New Stock Verification', module: 'Inventory', roles: [M, L], phase: 5, desc: 'Record stock verification results.' },
  { path: '/inventory/stock-verification/:id', title: 'Stock Verification Details', module: 'Inventory', roles: [M, L], phase: 5, desc: 'Stock verification details.' },

  { path: '/manufacturing/formulations', title: 'Formulations / BOM', module: 'Manufacturing', roles: [M, L], phase: 6, desc: 'Percentage or kg entry with four-decimal precision.' },
  { path: '/manufacturing/formulations/new', title: 'New Formulation', module: 'Manufacturing', roles: [M, L], phase: 6, desc: 'Add a new formulation recipe.' },
  { path: '/manufacturing/formulations/:id', title: 'Formulation Details', module: 'Manufacturing', roles: [M, L], phase: 6, desc: 'Formulation details.' },
  { path: '/manufacturing/production-plans', title: 'Production Plans', module: 'Manufacturing', roles: [M, L], phase: 6, desc: 'Plan materials using confirmed orders, stock, open purchases and schedules.' },
  { path: '/manufacturing/production-plans/new', title: 'New Production Plan', module: 'Manufacturing', roles: [M, L], phase: 6, desc: 'Create a production plan.' },
  { path: '/manufacturing/production-plans/:id', title: 'Production Plan Details', module: 'Manufacturing', roles: [M, L], phase: 6, desc: 'Production plan details.' },
  { path: '/manufacturing/production', title: 'Production', module: 'Manufacturing', roles: [M, L], phase: 6, desc: 'Production records with batch number, manufacturing date, expiry date and MRP required before posting to finished goods.' },
  { path: '/manufacturing/production/new', title: 'New Production', module: 'Manufacturing', roles: [M, L], phase: 6, desc: 'Create a new production record.' },
  { path: '/manufacturing/production/:id', title: 'Production Details', module: 'Manufacturing', roles: [M, L], phase: 6, desc: 'Production details.' },
  { path: '/manufacturing/dpr', title: 'Daily Production Report', module: 'Manufacturing', roles: [M, L], phase: 6, desc: 'Planned vs produced, rejected, scrap, actual consumption, manpower/machine remarks and closing status.' },
  { path: '/manufacturing/dpr/new', title: 'New DPR', module: 'Manufacturing', roles: [M, L], phase: 6, desc: 'Record daily production output.' },
  { path: '/manufacturing/dpr/:id', title: 'DPR Details', module: 'Manufacturing', roles: [M, L], phase: 6, desc: 'DPR details.' },
  { path: '/manufacturing/batches', title: 'Production Batches', module: 'Manufacturing', roles: [M, L], phase: 6, desc: 'Batch records with printing details and traceability.' },
  { path: '/manufacturing/reports', title: 'Production Reports', module: 'Manufacturing', roles: [M, L], phase: 6, desc: 'Yield, scrap, consumption and finished-goods output.' },

  { path: '/dispatch', title: 'Dispatch', module: 'Dispatch', roles: [S, M, C, D], phase: 7, statusKey: 'dispatch', desc: 'Billing coordination, dispatch, partial dispatch, backorder and customer receiving confirmation.' },
  { path: '/dispatch/new', title: 'New Dispatch', module: 'Dispatch', roles: [S, M, D], phase: 7, desc: 'Create a new dispatch record.' },
  { path: '/dispatch/:id', title: 'Dispatch Details', module: 'Dispatch', roles: [S, M, C, D], phase: 7, statusKey: 'dispatch', desc: 'Dispatch details.' },
  { path: '/dispatch/transport', title: 'Transport & Freight Ledger', module: 'Dispatch', roles: [M, C, D], phase: 7, desc: 'Invoice-wise transport ledger: agreed vs actual freight, paid, balance and LR / consignment reference.' },
  { path: '/dispatch/delivery', title: 'Delivery & Receiving', module: 'Dispatch', roles: [S, M, D], phase: 7, statusKey: 'dispatch', desc: 'Delivery tracking and receiving confirmation.' },

  { path: '/returns', title: 'Sales Returns', module: 'Returns', roles: [S, M, L, C], phase: 7, statusKey: 'salesReturn', desc: 'Return against invoice with inspection and approval before stock is restored.' },
  { path: '/returns/new', title: 'New Sales Return', module: 'Returns', roles: [S, M, L, C], phase: 7, desc: 'Record a sales return.' },
  { path: '/returns/:id', title: 'Return Details', module: 'Returns', roles: [S, M, L, C], phase: 7, statusKey: 'salesReturn', desc: 'Return details.' },
  { path: '/returns/reprocessing', title: 'Reprocessing', module: 'Returns', roles: [M, L], phase: 7, desc: 'Reprocessing production orders with approved formula.' },
  { path: '/returns/reprocessing/new', title: 'New Reprocessing', module: 'Returns', roles: [M, L], phase: 7, desc: 'Record reprocessing action.' },
  { path: '/returns/reprocessing/:id', title: 'Reprocessing Details', module: 'Returns', roles: [M, L], phase: 7, desc: 'Reprocessing details.' },

  { path: '/payments', title: 'Payments Overview', module: 'Payments', roles: [M, P, C], phase: 8, desc: 'Due, overdue and held payments across customers and suppliers.' },
  { path: '/payments/customer', title: 'Customer Payments', module: 'Payments', roles: [S, M, C], phase: 8, statusKey: 'buyerCollection', desc: 'Invoice, amount, due date, payment mode, reference and status.' },
  { path: '/payments/customer/new', title: 'New Customer Payment', module: 'Payments', roles: [S, M, C], phase: 8, desc: 'Record a payment from customer.' },
  { path: '/payments/customer/:id', title: 'Customer Payment Details', module: 'Payments', roles: [S, M, C], phase: 8, statusKey: 'buyerCollection', desc: 'Customer payment details.' },
  { path: '/payments/supplier', title: 'Supplier Payments', module: 'Payments', roles: [M, P, C], phase: 8, statusKey: 'supplierPayment', desc: 'Due date from GRN date plus credit period.' },
  { path: '/payments/supplier/new', title: 'New Supplier Payment', module: 'Payments', roles: [M, P, C], phase: 8, desc: 'Record a payment to supplier.' },
  { path: '/payments/supplier/:id', title: 'Supplier Payment Details', module: 'Payments', roles: [M, P, C], phase: 8, statusKey: 'supplierPayment', desc: 'Supplier payment details.' },
  { path: '/payments/advances', title: 'Supplier Advances', module: 'Payments', roles: [M, C], phase: 8, statusKey: 'outgoingPayment', desc: 'Advance and bank maker payments with Manager approval and bank checker release.' },
  { path: '/payments/advances/new', title: 'New Supplier Advance', module: 'Payments', roles: [M, C], phase: 8, desc: 'Record an advance to supplier.' },
  { path: '/payments/advances/:id', title: 'Supplier Advance Details', module: 'Payments', roles: [M, C], phase: 8, statusKey: 'outgoingPayment', desc: 'Supplier advance details.' },
  { path: '/payments/due', title: 'Due Payments', module: 'Payments', roles: [M, P, C], phase: 8, statusKey: 'supplierPayment', desc: 'Due Soon, Due Today and Held alerts.' },
  { path: '/payments/overdue', title: 'Overdue Payments', module: 'Payments', roles: [S, M, P, C], phase: 8, statusKey: 'buyerCollection', desc: 'Overdue payments with reason, responsible user and Manager review.' },
  { path: '/payments/bank-receipts', title: 'Bank Receipts', module: 'Payments', roles: [S, M, C], phase: 8, statusKey: 'bankReceipt', desc: 'Automatic bank receipts matched to customer ledger.' },
  { path: '/payments/bank-receipts/new', title: 'New Bank Receipt', module: 'Payments', roles: [S, M, C], phase: 8, desc: 'Record a bank receipt.' },
  { path: '/payments/bank-receipts/:id', title: 'Bank Receipt Details', module: 'Payments', roles: [S, M, C], phase: 8, statusKey: 'bankReceipt', desc: 'Bank receipt details.' },
  { path: '/payments/cash-receipts', title: 'Cash Receipts', module: 'Payments', roles: [S, M, C], phase: 8, statusKey: 'cashReceipt', desc: 'Cash receipts stay pending until the Manager approves.' },
  { path: '/payments/cash-receipts/new', title: 'New Cash Receipt', module: 'Payments', roles: [S, M, C], phase: 8, desc: 'Record a cash receipt.' },
  { path: '/payments/cash-receipts/:id', title: 'Cash Receipt Details', module: 'Payments', roles: [S, M, C], phase: 8, statusKey: 'cashReceipt', desc: 'Cash receipt details.' },

  { path: '/accounting', title: 'Accounting Overview', module: 'Accounting', roles: [M, C], phase: 8, desc: 'Ledgers, GST/TDS/TCS, receivables, payables and Tally synchronization status.' },
  { path: '/accounting/bank', title: 'Bank', module: 'Accounting', roles: [M, C], phase: 8, desc: 'Bank accounts and incoming transactions.' },
  { path: '/accounting/reconciliation', title: 'Bank Reconciliation', module: 'Accounting', roles: [M, C], phase: 8, statusKey: 'bankReceipt', desc: 'Bank transaction vs system transaction vs Tally with Match, Unmatch, Verify and Reconcile.' },
  { path: '/accounting/tally', title: 'Tally Sync', module: 'Accounting', roles: [M, C], phase: 8, desc: 'Synchronization status, timestamp, document reference, result message and retry.' },
  { path: '/accounting/bank-receipts', title: 'Bank Receipts', module: 'Accounting', roles: [S, M, C], phase: 8, statusKey: 'bankReceipt', desc: 'Automatic bank receipts matched to customer ledger.' },
  { path: '/accounting/cash-receipts', title: 'Cash Receipts', module: 'Accounting', roles: [S, M, C], phase: 8, statusKey: 'cashReceipt', desc: 'Cash receipts stay pending until the Manager approves.' },

  { path: '/reports', title: 'Reports', module: 'Reports', roles: BUSINESS_ROLES, phase: 9, desc: 'CRM, Sales, Purchase, Inventory, Manufacturing, Dispatch, Payment and Reconciliation reports with filters and export.' },

  { path: '/admin/users', title: 'Users', module: 'Administration', roles: [X], phase: 10, desc: 'Name, email, phone, role, department, status and last login.' },
  { path: '/admin/roles', title: 'Roles', module: 'Administration', roles: [X], phase: 10, desc: 'Role definitions and responsibilities.' },
  { path: '/admin/permissions', title: 'Permissions', module: 'Administration', roles: [X], phase: 10, desc: 'Permission matrix by module: View, Create, Edit, Delete, Approve.' },
  { path: '/admin/audit-logs', title: 'Audit Logs', module: 'Administration', roles: [X], phase: 10, desc: 'Every create, edit, approval, rejection, deletion, stock adjustment, payment, credit note and synchronization event.' },
  { path: '/admin/settings', title: 'Settings', module: 'Administration', roles: [X], phase: 10, desc: 'Workflow configuration, reminder intervals and master data.' },
];

export const findRoute = (pathname) =>
  ROUTES.find((r) => matchPath({ path: r.path, end: true }, pathname)) || null;

export const canAccessPath = (role, path) => {
  const r = ROUTES.find((x) => x.path === path);
  return !!r && r.roles.includes(role);
};

export const searchableRoutes = (role) =>
  ROUTES.filter((r) => r.roles.includes(role) && !r.path.includes(':'));
