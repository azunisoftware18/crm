import { createMockStore } from './api';

const dispatches = createMockStore([], { idPrefix: 'DSP' });
const transportLedger = createMockStore([], { idPrefix: 'TRL' });
const salesReturns = createMockStore([], { idPrefix: 'SR' });

export const { list: getDispatches, get: getDispatch, create: createDispatch, update: updateDispatch, remove: deleteDispatch } = dispatches;
export const { list: getTransportEntries, create: createTransportEntry, update: updateTransportEntry } = transportLedger;
export const { list: getSalesReturns, get: getSalesReturn, create: createSalesReturn, update: updateSalesReturn, remove: deleteSalesReturn } = salesReturns;

export async function createReprocessing(data) {
  return { id: 'REP-' + Date.now(), ...data };
}
