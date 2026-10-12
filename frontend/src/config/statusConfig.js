/**
 * Workflow status vocabularies. Source: requirement spec §22 (and §4.1 / §8 for leads and tasks),
 * plus the generic approval flow from the frontend workflow brief.
 */
export const STATUS_SETS = {
  approval: ['Draft', 'Submitted', 'Under Review', 'Approved', 'Rejected', 'Request Changes', 'Released', 'Locked'],
  lead: ['New', 'Contacted', 'Qualified', 'Sample/Quotation', 'Negotiation', 'Converted', 'On Hold', 'Lost'],
  buyerQuotationPi: ['Quotation Draft', 'Shared', 'Under Discussion', 'Revised', 'Finalized', 'PI Draft', 'Manager Approval Pending', 'Approved', 'Sent for Payment'],
  purchaseRequest: ['Draft', 'Submitted', 'Manager Review', 'Approved', 'Rejected', 'In Purchase Processing', 'Closed'],
  supplierQuotation: ['Pending', 'Received', 'Under Comparison', 'Clarification', 'Selected', 'Rejected'],
  purchaseOrder: ['Draft', 'Pending Approval', 'Approved', 'Sent', 'Partially Received', 'Fully Received', 'Closed', 'Cancelled'],
  grn: ['Draft', 'Submitted', 'Deviation', 'Resolution Pending', 'Manager Review', 'Approved', 'Partially Approved', 'Closed'],
  supplierPayment: ['Scheduled', 'Due Soon', 'Due Today', 'Overdue', 'On Hold - GRN Deviation', 'Credit Note Pending', 'Credit Note Received', 'Ready for Payment', 'Payment Initiated', 'Paid - Tally Pending', 'Paid/Cleared', 'Partially Paid', 'Exception'],
  outgoingPayment: ['Draft', 'Manager Approval Pending', 'Approved', 'Cheque Printed or Bank Submitted', 'Authorization Pending', 'Processing', 'Settled', 'Failed', 'Returned', 'Tally Pending', 'Cleared'],
  task: ['Not Started', 'In Progress', 'Waiting for Others', 'Submitted for Review', 'Completed', 'Reopened', 'Cancelled'],
  dispatch: ['Pending', 'Ready', 'Partially Dispatched', 'Dispatched', 'Delivered', 'Receiving Pending', 'Closed'],
  salesReturn: ['Requested', 'Approved', 'Awaiting Receipt', 'Under Inspection', 'Accepted', 'On Hold', 'Reprocessing', 'Restocked', 'Rejected', 'Closed'],
  bankReceipt: ['Received', 'Unmatched', 'Matched', 'Exception', 'Allocated', 'Tally Pending', 'Reconciled', 'Reversed'],
  cashReceipt: ['Draft', 'Pending Manager Approval', 'Returned', 'Rejected', 'Approved and Posted', 'Reversed'],
  vendor: ['Draft', 'Pending Manager Approval', 'Approved and Active', 'Rejected', 'Change Approval Pending', 'Inactive'],
  privateLabel: ['Artwork Uploaded', 'Procurement Pending', 'Quotation Pending', 'Design Approval Pending', 'Commercial Approval Pending', 'PO Approval Pending', 'Ready for Release', 'Released', 'Revision Pending'],
  buyerCollection: ['Not Yet Due', 'Overdue', 'Reminder Sent', 'Follow Up Pending', 'Partially Received', 'Reassigned', 'Settled'],
};

export const TONES = {
  success: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  danger: 'bg-red-50 text-red-700 ring-red-600/20',
  warning: 'bg-amber-50 text-amber-800 ring-amber-600/25',
  info: 'bg-sky-50 text-sky-700 ring-sky-600/20',
  progress: 'bg-indigo-50 text-indigo-700 ring-indigo-600/20',
  purple: 'bg-violet-50 text-violet-700 ring-violet-600/20',
  neutral: 'bg-slate-100 text-slate-600 ring-slate-500/20',
};

export const TONE_DOT = {
  success: 'bg-emerald-500', danger: 'bg-red-500', warning: 'bg-amber-500',
  info: 'bg-sky-500', progress: 'bg-indigo-500', purple: 'bg-violet-500', neutral: 'bg-slate-400',
};

// Ordered keyword rules: first match wins. Matching is case-insensitive on the status text.
const RULES = [
  [/partial/, 'progress'],
  [/request changes|changes requested|manager review/, 'warning'],
  [/on hold|hold -|exception|failed|reject|overdue|lost|cancel|reversed|deviation|unmatched|returned|revision pending/, 'danger'],
  [/pending|waiting|clarification|due soon|due today|awaiting|credit note pending|reminder|follow up|not yet|resolution/, 'warning'],
  [/approved and|approved|paid|settled|cleared|delivered|closed|reconciled|completed|converted|released|active|selected|restocked|accepted|allocated|matched|locked|fully received|finalized|ready/, 'success'],
  [/in progress|processing|dispatched|partially|submitted|under|sent|initiated|shared|revised|reprocessing|in purchase|received|negotiation|contacted|qualified|scheduled|reopened/, 'progress'],
  [/locked/, 'purple'],
  [/draft|new|not started|inactive|requested/, 'neutral'],
];

export function getTone(status = '') {
  const s = String(status).toLowerCase();
  if (s === 'locked') return 'purple';
  if (s === 'approved and posted') return 'success';
  if (s === 'on hold' || s.startsWith('on hold')) return 'danger';
  for (const [re, tone] of RULES) if (re.test(s)) return tone;
  return 'neutral';
}
