import { STORAGE_KEYS } from "../constants";

export function getToken(): string | null {
  return localStorage.getItem(STORAGE_KEYS.Token);
}

export function setToken(token: string | null) {
  if (token) localStorage.setItem(STORAGE_KEYS.Token, token);
  else localStorage.removeItem(STORAGE_KEYS.Token);
}

// Thin transport: attaches the auth token, parses JSON, and surfaces a unified
// Error from the `{ error }` payload. Service modules build on top of this.
export async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> | undefined),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`/api${path}`, { ...options, headers });

  if (res.status === 204) return undefined as T;

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((data as { error?: string }).error ?? `Request failed (${res.status})`);
  }
  return data as T;
}
