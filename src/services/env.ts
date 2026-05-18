/**
 * Environment configuration.
 * All public env vars in Vite must start with VITE_.
 * Never use process.env in the browser — Vite exposes import.meta.env.
 */

function readEnv(name: keyof ImportMetaEnv): string {
  const value = import.meta.env[name];
  return typeof value === 'string' ? value.trim() : '';
}

const rawApiBaseUrl = readEnv('VITE_API_BASE_URL');

if (!rawApiBaseUrl) {
  throw new Error(
    '[env] VITE_API_BASE_URL is required. Create a .env file at the project root ' +
      'with VITE_API_BASE_URL=http://localhost:3000/api/v1 (see .env.example).',
  );
}

// Strip trailing slash so callers can safely concatenate `${API_BASE_URL}/path`.
export const API_BASE_URL = rawApiBaseUrl.replace(/\/+$/, '');

export const APP_NAME = readEnv('VITE_APP_NAME') || 'WASK Business App';

export const ENABLE_MOCKS = readEnv('VITE_ENABLE_MOCKS').toLowerCase() === 'true';
