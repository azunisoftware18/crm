/**
 * Roles and action-level permissions, taken from the requirement spec (§3, §15, §21, §23).
 * NOTE: this is UI gating only. Real authorization must be enforced by the backend.
 */
export const ROLES = {
  SALES: 'sales',
  MANAGER: 'manager',
  PURCHASE: 'purchase',
  PLANT: 'plant',
  ACCOUNTS: 'accounts',
  DISPATCH: 'dispatch',
  ADMIN: 'admin',
};

export const ROLE_META = {
  sales: { label: 'Sales Representative', short: 'Sales', tone: 'bg-sky-100 text-sky-700' },
  manager: { label: 'Manager / Approving Manager', short: 'Manager', tone: 'bg-violet-100 text-violet-700' },
  purchase: { label: 'Purchase Manager', short: 'Purchase', tone: 'bg-amber-100 text-amber-700' },
  plant: { label: 'Plant Manager / Plant Incharge', short: 'Plant', tone: 'bg-emerald-100 text-emerald-700' },
  accounts: { label: 'Accounts Team', short: 'Accounts', tone: 'bg-rose-100 text-rose-700' },
  dispatch: { label: 'Dispatch Coordinator', short: 'Dispatch', tone: 'bg-teal-100 text-teal-700' },
  admin: { label: 'System Administrator', short: 'Admin', tone: 'bg-slate-200 text-slate-700' },
};

export const ALL_ROLES = Object.values(ROLES);
export const BUSINESS_ROLES = ALL_ROLES.filter((r) => r !== ROLES.ADMIN);

const { SALES: S, MANAGER: M, PURCHASE: P, PLANT: L, ACCOUNTS: C, DISPATCH: D, ADMIN: X } = ROLES;

/**
 * Who may perform which action.
 * - Manager-only approvals cannot be bypassed (§21).
 * - Purchase Manager cannot approve vendors or quotations (§3, §15.4).
 * - System Administrator has no commercial, vendor, design or payment approval rights (§3).
 */
export const ACTION_ROLES = {
  // Sales / PI
  'pi.create': [S, M],
  'pi.approve': [M],
  'quotation.create': [S, M],
  // Purchase
  'purchaseRequest.create': [M, L],
  'purchaseRequest.approve': [M],
  'supplierQuotation.manage': [P],
  'supplierQuotation.approve': [M],
  'po.prepare': [P],
  'po.approve': [M],
  'purchase.deviationUpTo5pct': [P],
  // Vendors
  'vendor.propose': [P],
  'vendor.approve': [M],
  'vendor.delete': [M],
  // Private label
  'artwork.upload': [S],
  'design.approve': [S, M],
  'privateLabelQuotation.approve': [M],
  // Inventory / production
  'grn.create': [L],
  'grn.deviationApprove': [M],
  'stock.adjust.within0_25pct': [L],
  'stock.adjust.approve': [M],
  'formula.prepare': [L],
  'formula.approve': [M],
  'production.post': [L],
  // Returns
  'salesReturn.inspect': [L],
  'salesReturn.approve': [M],
  // Dispatch
  'dispatch.manage': [D],
  'contractDispatch.approve': [M],
  // Payments / accounting
  'cashReceipt.enter': [S, C],
  'cashReceipt.approve': [M],
  'payment.prepare': [C],
  'payment.approve': [M],
  'receipt.reassign.approve': [M],
  // Tasks
  'task.create': [M],
  // Admin
  'user.manage': [X],
  'permission.manage': [X],
  'auditLog.export': [X],
};

export const can = (role, action) => (ACTION_ROLES[action] || []).includes(role);
