import { devToken } from './Authenticator';

// All API routes live under /api on the same origin as the static assets.
// No base URL needed — Vite proxies to the Worker in development.
const url = (path: string) => `/api${path}`;

// In dev mode the Worker accepts a Bearer token (see .dev.vars DEV=true).
// In production Cloudflare Access handles auth via cookie; no extra header needed.
const authHeaders = (): HeadersInit =>
  import.meta.env.DEV ? { Authorization: `Bearer ${devToken()}` } : {};

export const post = async <T = unknown>(path: string, data: unknown): Promise<T> => {
  const response = await fetch(url(path), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(data)
  });
  if (!response.ok) {
    const err = await (response.json() as Promise<{ error?: string }>).catch(() => ({ error: response.statusText }));
    throw new Error(err.error);
  }
  return response.json() as Promise<T>;
};

export const get = async <T = unknown>(path: string): Promise<T> => {
  const response = await fetch(url(path), { headers: authHeaders() });
  if (!response.ok) {
    const err = await (response.json() as Promise<{ error?: string }>).catch(() => ({ error: response.statusText }));
    throw new Error(err.error);
  }
  return response.json() as Promise<T>;
};

export const socketAuth = (cb: (value: { token: string }) => void): void => {
  cb({ token: btoa(devToken()) });
};
