import { apiClient } from './apiClient';
import type { CreateProductDto, Product, UpdateProductDto } from '../types/api';

export interface ProductsQuery {
  page?: number;
  pageSize?: number;
  search?: string;
  category?: string;
  status?: string;
  supplierId?: string;
  [key: string]: string | number | boolean | undefined | null;
}

export const productsService = {
  getProducts: (query?: ProductsQuery) =>
    apiClient.get<Product[]>('/products', { query }),
  createProduct: (payload: CreateProductDto) =>
    apiClient.post<Product>('/products', payload),
  updateProduct: (id: string, payload: UpdateProductDto) =>
    apiClient.patch<Product>(`/products/${id}`, payload),
};
