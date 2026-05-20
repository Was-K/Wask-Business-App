import { apiClient } from './apiClient';
import type {
  CreateProductDto,
  Product,
  ProductApprovalStatus,
  ProductStatus,
  UpdateProductDto,
} from '../types/api';

export interface ProductsQuery {
  q?: string;
  category?: string;
  status?: ProductStatus;
  approvalStatus?: ProductApprovalStatus;
  businessId?: string;
  page?: number;
  pageSize?: number;
  [key: string]: string | number | boolean | undefined | null;
}

export const productsService = {
  getProducts: (query?: ProductsQuery) =>
    apiClient.get<Product[]>('/products', { query }),

  getPendingProducts: () =>
    apiClient.get<Product[]>('/products/pending-approval'),

  getProduct: (id: string) => apiClient.get<Product>(`/products/${id}`),

  createProduct: (payload: CreateProductDto) =>
    apiClient.post<Product>('/products', payload),

  updateProduct: (id: string, payload: UpdateProductDto) =>
    apiClient.patch<Product>(`/products/${id}`, payload),

  approveProduct: (id: string) =>
    apiClient.post<Product>(`/products/${id}/approve`, {}),

  rejectProduct: (id: string, reason: string) =>
    apiClient.post<Product>(`/products/${id}/reject`, { reason }),

  archiveProduct: (id: string) =>
    apiClient.post<Product>(`/products/${id}/archive`, {}),
};
