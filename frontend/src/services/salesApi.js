import { createMockStore } from './api';
import { productsSeed } from './mock/catalog';

const products = createMockStore(productsSeed, { idPrefix: 'PRD' });
const quotations = createMockStore([], { idPrefix: 'QT' });
const proformaInvoices = createMockStore([], { idPrefix: 'PI' });

export const { list: getProducts, get: getProduct, create: createProduct, update: updateProduct, remove: deleteProduct } = products;
export const { list: getQuotations, get: getQuotation, create: createQuotation, update: updateQuotation, remove: deleteQuotation } = quotations;
export const { list: getProformaInvoices, get: getProformaInvoice, create: createProformaInvoice, update: updateProformaInvoice, remove: deleteProformaInvoice } = proformaInvoices;
