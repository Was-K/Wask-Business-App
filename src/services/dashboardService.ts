import { apiClient } from './apiClient';
import type { AdminOverview, DashboardSummary } from '../types/api';

export const dashboardService = {
  getDashboardSummary: () => apiClient.get<DashboardSummary>('/dashboard/summary'),
  getAdminOverview: () => apiClient.get<AdminOverview>('/admin/overview'),
};
