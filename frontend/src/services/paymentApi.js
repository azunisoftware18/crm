import { createMockStore } from './api';

const customerPayments = createMockStore([], { idPrefix: 'CP' });
const supplierPayments = createMockStore([], { idPrefix: 'SP' });
const advances = createMockStore([], { idPrefix: 'ADV' });
const bankReceipts = createMockStore([], { idPrefix: 'BR' });
const cashReceipts = createMockStore([], { idPrefix: 'CR' });

export const { list: getCustomerPayments, create: createCustomerPayment, update: updateCustomerPayment } = customerPayments;
export const { list: getSupplierPayments, create: createSupplierPayment, update: updateSupplierPayment } = supplierPayments;
export const { list: getSupplierAdvances, create: createSupplierAdvance, update: updateSupplierAdvance } = advances;
export const { list: getBankReceipts, update: updateBankReceipt } = bankReceipts;
export const { list: getCashReceipts, create: createCashReceipt, update: updateCashReceipt } = cashReceipts;
