import { apiClient } from './apiClient';
import type { InventoryItem, StockMovementDto, Warehouse } from '../types/api';

export interface CreateWarehouseDto {
  name: string;
  code: string;
  address?: string;
  region?: string;
}

export interface UpsertInventoryItemDto {
  productId: string;
  warehouseId: string;
  availableStock: number;
  minimumStock?: number;
}

export const inventoryService = {
  getMyInventory: () => apiClient.get<InventoryItem[]>('/inventory/my-inventory'),

  getLowStock: () => apiClient.get<InventoryItem[]>('/inventory/low-stock'),

  createWarehouse: (payload: CreateWarehouseDto) =>
    apiClient.post<Warehouse>('/inventory/warehouses', payload),

  upsertInventoryItem: (payload: UpsertInventoryItemDto) =>
    apiClient.post<InventoryItem>('/inventory/items', payload),

  createMovement: (payload: StockMovementDto) =>
    apiClient.post<StockMovementDto>('/inventory/movements', payload),
};
