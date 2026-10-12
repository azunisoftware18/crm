import { createMockStore } from './api';

const formulations = createMockStore([], { idPrefix: 'FRM' });
const productionPlans = createMockStore([], { idPrefix: 'PP' });
const productionRuns = createMockStore([], { idPrefix: 'PRD' });
const dprs = createMockStore([], { idPrefix: 'DPR' });

export const { list: getFormulations, get: getFormulation, create: createFormulation, update: updateFormulation, remove: deleteFormulation } = formulations;
export const { list: getProductionPlans, create: createProductionPlan, update: updateProductionPlan, remove: deleteProductionPlan } = productionPlans;
export const { list: getProductionRuns, create: createProductionRun, update: updateProductionRun, remove: deleteProductionRun } = productionRuns;
export const { list: getDailyProductionReports, create: createDailyProductionReport, remove: deleteDailyProductionReport } = dprs;

export async function createProduction(data) {
  return { id: 'PRD-' + Date.now(), ...data };
}
