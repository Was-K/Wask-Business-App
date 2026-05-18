import { apiClient } from './apiClient';
import type {
  Business,
  CreateBusinessDto,
  UpdateBusinessDto,
} from '../types/api';

export const businessService = {
  getBusinesses: () => apiClient.get<Business[]>('/business'),
  createBusiness: (payload: CreateBusinessDto) =>
    apiClient.post<Business>('/business', payload),
  updateBusiness: (id: string, payload: UpdateBusinessDto) =>
    apiClient.patch<Business>(`/business/${id}`, payload),
  approveBusiness: (id: string) =>
    apiClient.post<Business>(`/business/${id}/approve`, {}),
};
