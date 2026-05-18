import { apiClient } from './apiClient';
import type {
  CreateSupplierDto,
  Supplier,
  UpdateSupplierDto,
} from '../types/api';

export const suppliersService = {
  getSuppliers: () => apiClient.get<Supplier[]>('/suppliers'),
  createSupplier: (payload: CreateSupplierDto) =>
    apiClient.post<Supplier>('/suppliers', payload),
  updateSupplier: (id: string, payload: UpdateSupplierDto) =>
    apiClient.patch<Supplier>(`/suppliers/${id}`, payload),
  verifySupplier: (id: string) =>
    apiClient.post<Supplier>(`/suppliers/${id}/verify`, {}),
};
