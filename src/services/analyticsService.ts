import { apiClient } from './apiClient';

export interface AnalyticsSummary {
  [key: string]: unknown;
}

export interface OrderAnalytics {
  [key: string]: unknown;
}

export interface InventoryAnalytics {
  [key: string]: unknown;
}

export const analyticsService = {
  getAnalyticsSummary: () =>
    apiClient.get<AnalyticsSummary>('/analytics/summary'),
  getOrderAnalytics: () => apiClient.get<OrderAnalytics>('/analytics/orders'),
  getInventoryAnalytics: () =>
    apiClient.get<InventoryAnalytics>('/analytics/inventory'),
};
