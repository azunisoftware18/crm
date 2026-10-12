import { mockResponse } from './api';
import { dashboardKpis } from './mock/dashboard';

/** Replace with: http.get('/reports/dashboard', { params: { role } }) */
export const getDashboardSummary = (role) => mockResponse(dashboardKpis[role] || []);
