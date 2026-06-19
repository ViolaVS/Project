import type { Habit, User } from "../types";

const TOKEN_KEY = "habit-tracker-token";

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string | null) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

// Thin wrapper around fetch that attaches the auth token and parses JSON.
async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
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

interface AuthResponse {
  token: string;
  user: User;
}

export const api = {
  register: (email: string, password: string) =>
    request<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  login: (email: string, password: string) =>
    request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  getHabits: (month?: string) =>
    request<{ month: string; habits: Habit[] }>(
      `/habits${month ? `?month=${month}` : ""}`
    ),

  createHabit: (input: { name: string; description?: string; frequency?: string }) =>
    request<Habit>("/habits", { method: "POST", body: JSON.stringify(input) }),

  deleteHabit: (id: string) => request<void>(`/habits/${id}`, { method: "DELETE" }),

  toggleHabit: (id: string, date: string) =>
    request<{ habitId: string; date: string; status: string; completed: boolean }>(
      `/habits/${id}/toggle`,
      { method: "POST", body: JSON.stringify({ date }) }
    ),
};
