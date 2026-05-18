import { apiClient } from './apiClient';
import type {
  CreateOrderDto,
  Order,
  UpdateOrderStatusDto,
} from '../types/api';

export const ordersService = {
  getOrders: () => apiClient.get<Order[]>('/orders'),
  createOrder: (payload: CreateOrderDto) =>
    apiClient.post<Order>('/orders', payload),
  updateOrderStatus: (id: string, payload: UpdateOrderStatusDto) =>
    apiClient.patch<Order>(`/orders/${id}/status`, payload),
};
