import { create } from "zustand";
import { api } from "../api/client";
import type { Habit } from "../types";
import { toMonthKey } from "../utils/date";

interface HabitState {
  habits: Habit[];
  // The month currently being viewed (a Date pinned to the 1st).
  viewMonth: Date;
  loading: boolean;
  error: string | null;

  fetchHabits: () => Promise<void>;
  setViewMonth: (date: Date) => Promise<void>;
  addHabit: (input: { name: string; description?: string; frequency?: string }) => Promise<void>;
  removeHabit: (id: string) => Promise<void>;
  toggle: (habitId: string, date: string) => Promise<void>;
}

function startOfThisMonth(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1);
}

export const useHabitStore = create<HabitState>((set, get) => ({
  habits: [],
  viewMonth: startOfThisMonth(),
  loading: false,
  error: null,

  fetchHabits: async () => {
    set({ loading: true, error: null });
    try {
      const { habits } = await api.getHabits(toMonthKey(get().viewMonth));
      set({ habits, loading: false });
    } catch (e) {
      set({ error: (e as Error).message, loading: false });
    }
  },

  setViewMonth: async (date) => {
    set({ viewMonth: date });
    await get().fetchHabits();
  },

  addHabit: async (input) => {
    set({ error: null });
    try {
      const habit = await api.createHabit(input);
      set({ habits: [...get().habits, habit] });
    } catch (e) {
      set({ error: (e as Error).message });
    }
  },

  removeHabit: async (id) => {
    try {
      await api.deleteHabit(id);
      set({ habits: get().habits.filter((h) => h.id !== id) });
    } catch (e) {
      set({ error: (e as Error).message });
    }
  },

  toggle: async (habitId, date) => {
    // Optimistically update the local log set, then reconcile with the server.
    try {
      const result = await api.toggleHabit(habitId, date);
      set({
        habits: get().habits.map((h) => {
          if (h.id !== habitId) return h;
          const without = h.logs.filter((l) => l.date !== date);
          if (result.completed) {
            return {
              ...h,
              logs: [
                ...without,
                { id: `${habitId}-${date}`, habitId, date, status: "completed" },
              ],
            };
          }
          return { ...h, logs: without };
        }),
      });
    } catch (e) {
      set({ error: (e as Error).message });
    }
  },
}));
