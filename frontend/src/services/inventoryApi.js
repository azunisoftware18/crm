import { createMockStore } from './api';

const rawMaterials = createMockStore([], { idPrefix: 'RM' });
const packaging = createMockStore([], { idPrefix: 'PM' });
const finishedGoods = createMockStore([], { idPrefix: 'FG' });
const stockMovements = createMockStore([], { idPrefix: 'SM' });
const grns = createMockStore([], { idPrefix: 'GRN' });
const batches = createMockStore([], { idPrefix: 'BT' });
const gatePasses = createMockStore([], { idPrefix: 'GP' });

export const { list: getRawMaterials } = rawMaterials;
export const { list: getPackagingMaterials } = packaging;
export const { list: getFinishedGoods } = finishedGoods;
export const { list: getStockMovements, create: createStockMovement } = stockMovements;
export const { list: getGrns, get: getGrn, create: createGrn, update: updateGrn, remove: deleteGrn } = grns;
export const { list: getBatches, get: getBatch, create: createBatch } = batches;
export const { list: getGatePasses, create: createGatePass, update: updateGatePass } = gatePasses;

export async function createInventoryItem(data) {
  return { id: 'II-' + Date.now(), ...data };
}

export async function createStockVerification(data) {
  return { id: 'SV-' + Date.now(), ...data };
}
