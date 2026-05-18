import { apiClient } from './apiClient';
import type { Notification } from '../types/api';

export interface CreateNotificationDto {
  title: string;
  body?: string;
  userId?: string;
  [key: string]: unknown;
}

export const notificationsService = {
  getNotifications: () => apiClient.get<Notification[]>('/notifications'),
  createNotification: (payload: CreateNotificationDto) =>
    apiClient.post<Notification>('/notifications', payload),
};
