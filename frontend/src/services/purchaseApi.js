import { createMockStore } from './api';
import { vendorsSeed } from './mock/catalog';

const requests = createMockStore([], { idPrefix: 'PR' });
const supplierQuotations = createMockStore([], { idPrefix: 'SQ' });
const orders = createMockStore([], { idPrefix: 'PO' });
const vendors = createMockStore(vendorsSeed, { idPrefix: 'VND' });
const privateLabel = createMockStore([], { idPrefix: 'PL' });

export const { list: getPurchaseRequests, get: getPurchaseRequest, create: createPurchaseRequest, update: updatePurchaseRequest, remove: deletePurchaseRequest } = requests;
export const { list: getSupplierQuotations, create: createSupplierQuotation, update: updateSupplierQuotation, remove: deleteSupplierQuotation } = supplierQuotations;
export const { list: getPurchaseOrders, get: getPurchaseOrder, create: createPurchaseOrder, update: updatePurchaseOrder, remove: deletePurchaseOrder } = orders;
export const { list: getVendors, get: getVendor, create: createVendor, update: updateVendor, remove: deleteVendor } = vendors;
export const { list: getPrivateLabelJobs, create: createPrivateLabelJob, update: updatePrivateLabelJob, remove: deletePrivateLabelJob } = privateLabel;

export async function createPrivateLabelBrand(data) {
  return { id: 'PLB-' + Date.now(), ...data };
}
