import { apiClient } from './apiClient';
import type { AppSettings } from '../types/api';

export const settingsService = {
  getSettings: () => apiClient.get<AppSettings>('/settings'),
};
