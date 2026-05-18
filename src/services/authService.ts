import { apiClient } from './apiClient';
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  setTokens,
} from './tokenStorage';
import type { AuthTokens, User, UserRole } from '../types/api';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  fullName?: string;
  role?: UserRole;
  [key: string]: unknown;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

interface JwtClaims {
  sub?: string;
  email?: string;
  role?: UserRole | string;
  exp?: number;
  iat?: number;
}

/**
 * Decode a JWT without verifying the signature.
 * Used only as a temporary fallback to populate `user` when GET /users/me fails.
 * TODO: replace decoded-JWT usage with the real /users/me response once stable.
 */
export function decodeJwt(token: string): JwtClaims | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = payload + '='.repeat((4 - (payload.length % 4)) % 4);
    const json = atob(padded);
    return JSON.parse(json) as JwtClaims;
  } catch {
    return null;
  }
}

function normalizeRole(role: unknown): UserRole {
  if (typeof role !== 'string') return 'BUSINESS';
  const upper = role.toUpperCase();
  if (upper === 'ADMIN' || upper === 'BUSINESS' || upper === 'SUPPLIER') {
    return upper;
  }
  return 'BUSINESS';
}

async function login(email: string, password: string): Promise<AuthTokens> {
  const tokens = await apiClient.post<AuthTokens>(
    '/auth/login',
    { email, password },
    { skipAuth: true },
  );
  if (!tokens?.accessToken || !tokens?.refreshToken) {
    throw new Error('La respuesta de autenticación es inválida');
  }
  setTokens(tokens);
  return tokens;
}

async function register(payload: RegisterPayload): Promise<AuthTokens | User> {
  // Backend may return tokens (auto-login) or just the created user; let callers decide.
  const data = await apiClient.post<AuthTokens | User>(
    '/auth/register',
    payload,
    { skipAuth: true },
  );
  if (data && 'accessToken' in data && 'refreshToken' in data) {
    setTokens(data as AuthTokens);
  }
  return data;
}

async function logout(): Promise<void> {
  try {
    await apiClient.post('/auth/logout', {});
  } catch {
    // Network/401 errors on logout shouldn't block local cleanup.
  } finally {
    clearTokens();
  }
}

async function logoutGlobal(): Promise<void> {
  try {
    await apiClient.post('/auth/logout-global', {});
  } finally {
    clearTokens();
  }
}

async function refreshToken(): Promise<AuthTokens | null> {
  const rt = getRefreshToken();
  if (!rt) return null;
  const tokens = await apiClient.post<AuthTokens>(
    '/auth/refresh-token',
    { refreshToken: rt },
    { skipAuth: true },
  );
  if (tokens?.accessToken && tokens?.refreshToken) {
    setTokens(tokens);
    return tokens;
  }
  return null;
}

async function getCurrentUser(): Promise<User> {
  try {
    const user = await apiClient.get<User>('/users/me');
    if (user?.id && user?.email) {
      return { ...user, role: normalizeRole(user.role) };
    }
    throw new Error('respuesta de /users/me incompleta');
  } catch (err) {
    // TODO: remove this JWT fallback once /users/me is stable on the backend.
    const token = getAccessToken();
    if (!token) throw err;
    const claims = decodeJwt(token);
    if (!claims?.sub || !claims?.email) throw err;
    return {
      id: claims.sub,
      email: claims.email,
      role: normalizeRole(claims.role),
    };
  }
}

async function validateSession(): Promise<boolean> {
  try {
    await apiClient.post('/auth/validate-session', {});
    return true;
  } catch {
    return false;
  }
}

async function changePassword(payload: ChangePasswordPayload): Promise<void> {
  await apiClient.post('/auth/change-password', payload);
}

async function forgotPassword(email: string): Promise<void> {
  await apiClient.post('/auth/forgot-password', { email }, { skipAuth: true });
}

async function resetPassword(token: string, newPassword: string): Promise<void> {
  await apiClient.post(
    '/auth/reset-password',
    { token, newPassword },
    { skipAuth: true },
  );
}

export const authService = {
  login,
  register,
  logout,
  logoutGlobal,
  refreshToken,
  getCurrentUser,
  validateSession,
  changePassword,
  forgotPassword,
  resetPassword,
};
