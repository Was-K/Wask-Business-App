import { apiClient } from './apiClient';
import type { Business, CreateBusinessDto, UpdateBusinessDto } from '../types/api';

export const businessService = {
  getBusinesses: (query?: Record<string, string>) =>
    apiClient.get<Business[]>('/business', { query }),

  getMyBusiness: () => apiClient.get<Business>('/business/my-business'),

  createBusiness: (payload: CreateBusinessDto) =>
    apiClient.post<Business>('/business', payload),

  updateMyBusiness: (payload: UpdateBusinessDto) =>
    apiClient.patch<Business>('/business/my-business', payload),

  updateBusiness: (id: string, payload: UpdateBusinessDto) =>
    apiClient.patch<Business>(`/business/${id}`, payload),

  approveBusiness: (id: string) =>
    apiClient.post<Business>(`/business/${id}/approve`, {}),

  rejectBusiness: (id: string, reason: string) =>
    apiClient.post<Business>(`/business/${id}/reject`, { reason }),
};
