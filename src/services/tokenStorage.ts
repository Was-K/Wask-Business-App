/**
 * Token storage abstraction.
 * Currently backed by localStorage; swap implementation here if we move to cookies.
 */

const ACCESS_TOKEN_KEY = 'wask_access_token';
const REFRESH_TOKEN_KEY = 'wask_refresh_token';

function safeStorage(): Storage | null {
  try {
    if (typeof window === 'undefined') return null;
    return window.localStorage;
  } catch {
    return null;
  }
}

export function getAccessToken(): string | null {
  return safeStorage()?.getItem(ACCESS_TOKEN_KEY) ?? null;
}

export function setAccessToken(token: string): void {
  safeStorage()?.setItem(ACCESS_TOKEN_KEY, token);
}

export function getRefreshToken(): string | null {
  return safeStorage()?.getItem(REFRESH_TOKEN_KEY) ?? null;
}

export function setRefreshToken(token: string): void {
  safeStorage()?.setItem(REFRESH_TOKEN_KEY, token);
}

export function setTokens(tokens: { accessToken: string; refreshToken: string }): void {
  setAccessToken(tokens.accessToken);
  setRefreshToken(tokens.refreshToken);
}

export function clearTokens(): void {
  const storage = safeStorage();
  storage?.removeItem(ACCESS_TOKEN_KEY);
  storage?.removeItem(REFRESH_TOKEN_KEY);
}
