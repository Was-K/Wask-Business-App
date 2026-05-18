import { API_BASE_URL } from './env';
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  setTokens,
} from './tokenStorage';
import type { ApiResponse } from '../types/api';

export type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

export interface RequestOptions {
  query?: Record<string, string | number | boolean | undefined | null>;
  body?: unknown;
  headers?: Record<string, string>;
  /** Skip Authorization header (used for login/refresh). */
  skipAuth?: boolean;
  /** Internal flag — set to true after a refresh attempt to avoid loops. */
  _retried?: boolean;
  signal?: AbortSignal;
}

export class ApiError extends Error {
  readonly status: number;
  readonly payload: unknown;

  constructor(message: string, status: number, payload?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.payload = payload;
  }
}

function buildUrl(path: string, query?: RequestOptions['query']): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const base = `${API_BASE_URL}${normalizedPath}`;
  if (!query) return base;
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(query)) {
    if (v === undefined || v === null || v === '') continue;
    params.append(k, String(v));
  }
  const qs = params.toString();
  return qs ? `${base}?${qs}` : base;
}

function extractMessage(payload: unknown, fallback: string): string {
  if (payload && typeof payload === 'object') {
    const obj = payload as Record<string, unknown>;
    const candidates = [obj.message, obj.error, obj.detail];
    for (const c of candidates) {
      if (typeof c === 'string' && c.length > 0) return c;
      if (Array.isArray(c) && c.length > 0 && typeof c[0] === 'string') return c[0];
    }
  }
  return fallback;
}

// Simple in-flight refresh promise so concurrent 401s only trigger one refresh call.
let refreshInFlight: Promise<boolean> | null = null;

async function tryRefreshToken(): Promise<boolean> {
  if (refreshInFlight) return refreshInFlight;

  refreshInFlight = (async () => {
    const refreshToken = getRefreshToken();
    if (!refreshToken) return false;

    try {
      const res = await fetch(buildUrl('/auth/refresh-token'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      if (!res.ok) return false;

      const json = (await res.json()) as ApiResponse<{
        accessToken: string;
        refreshToken: string;
      }>;
      if (!json?.success || !json.data?.accessToken || !json.data?.refreshToken) {
        return false;
      }
      setTokens({
        accessToken: json.data.accessToken,
        refreshToken: json.data.refreshToken,
      });
      return true;
    } catch {
      return false;
    }
  })();

  try {
    return await refreshInFlight;
  } finally {
    refreshInFlight = null;
  }
}

function handleSessionExpired(): void {
  clearTokens();
  if (typeof window !== 'undefined' && window.location.pathname !== '/') {
    window.location.assign('/');
  }
}

async function parseJsonSafe(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export async function request<T>(
  method: HttpMethod,
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { query, body, headers = {}, skipAuth, signal } = options;

  const finalHeaders: Record<string, string> = {
    Accept: 'application/json',
    ...headers,
  };

  let payload: BodyInit | undefined;
  if (body !== undefined && body !== null) {
    if (body instanceof FormData) {
      payload = body;
    } else {
      finalHeaders['Content-Type'] = finalHeaders['Content-Type'] ?? 'application/json';
      payload = JSON.stringify(body);
    }
  }

  if (!skipAuth) {
    const token = getAccessToken();
    if (token) {
      finalHeaders.Authorization = `Bearer ${token}`;
    }
  }

  const url = buildUrl(path, query);

  let response: Response;
  try {
    response = await fetch(url, {
      method,
      headers: finalHeaders,
      body: payload,
      signal,
    });
  } catch (err) {
    throw new ApiError(
      err instanceof Error ? err.message : 'Error de red al contactar al servidor',
      0,
    );
  }

  // 401 -> attempt one refresh (if not the refresh call itself and not already retried).
  if (
    response.status === 401 &&
    !skipAuth &&
    !options._retried &&
    !path.startsWith('/auth/')
  ) {
    const refreshed = await tryRefreshToken();
    if (refreshed) {
      return request<T>(method, path, { ...options, _retried: true });
    }
    handleSessionExpired();
    const errPayload = await parseJsonSafe(response);
    throw new ApiError(
      extractMessage(errPayload, 'Sesión expirada'),
      401,
      errPayload,
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const json = await parseJsonSafe(response);

  if (!response.ok) {
    throw new ApiError(
      extractMessage(json, `Error HTTP ${response.status}`),
      response.status,
      json,
    );
  }

  // Backend wraps every success response: { success, data, timestamp }
  if (json && typeof json === 'object' && 'success' in json && 'data' in json) {
    const wrapped = json as ApiResponse<T>;
    if (wrapped.success === false) {
      throw new ApiError(
        extractMessage(wrapped, 'La operación no fue exitosa'),
        response.status,
        wrapped,
      );
    }
    return wrapped.data;
  }

  // Fallback: backend didn't wrap (shouldn't happen, but stay defensive).
  return json as T;
}

export const apiClient = {
  get: <T>(path: string, options?: Omit<RequestOptions, 'body'>) =>
    request<T>('GET', path, options),
  post: <T>(path: string, body?: unknown, options?: Omit<RequestOptions, 'body'>) =>
    request<T>('POST', path, { ...options, body }),
  patch: <T>(path: string, body?: unknown, options?: Omit<RequestOptions, 'body'>) =>
    request<T>('PATCH', path, { ...options, body }),
  put: <T>(path: string, body?: unknown, options?: Omit<RequestOptions, 'body'>) =>
    request<T>('PUT', path, { ...options, body }),
  delete: <T>(path: string, options?: Omit<RequestOptions, 'body'>) =>
    request<T>('DELETE', path, options),
};
