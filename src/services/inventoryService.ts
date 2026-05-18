import { apiClient } from './apiClient';
import type {
  InventoryItem,
  InventoryMovement,
  Warehouse,
} from '../types/api';

export interface CreateWarehouseDto {
  name: string;
  location?: string;
  [key: string]: unknown;
}

export interface UpsertInventoryItemDto {
  productId: string;
  warehouseId: string;
  quantity: number;
  [key: string]: unknown;
}

export const inventoryService = {
  createWarehouse: (payload: CreateWarehouseDto) =>
    apiClient.post<Warehouse>('/inventory/warehouses', payload),
  upsertInventoryItem: (payload: UpsertInventoryItemDto) =>
    apiClient.post<InventoryItem>('/inventory/items', payload),
  createMovement: (payload: InventoryMovement) =>
    apiClient.post<InventoryMovement>('/inventory/movements', payload),
  getLowStock: () => apiClient.get<InventoryItem[]>('/inventory/low-stock'),
};
