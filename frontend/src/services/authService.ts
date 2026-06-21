import { request } from "../api/client";
import type { AuthResponse } from "../types";

// Service layer for auth: typed API calls, no transport details, no UI state.
export const authService = {
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
};
