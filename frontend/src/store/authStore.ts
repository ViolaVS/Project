import { create } from "zustand";
import { api, getToken, setToken } from "../api/client";
import type { User } from "../types";

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: getToken(),
  loading: false,
  error: null,

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const { token, user } = await api.login(email, password);
      setToken(token);
      set({ token, user, loading: false });
    } catch (e) {
      set({ error: (e as Error).message, loading: false });
    }
  },

  register: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const { token, user } = await api.register(email, password);
      setToken(token);
      set({ token, user, loading: false });
    } catch (e) {
      set({ error: (e as Error).message, loading: false });
    }
  },

  logout: () => {
    setToken(null);
    set({ user: null, token: null });
  },

  clearError: () => set({ error: null }),
}));
