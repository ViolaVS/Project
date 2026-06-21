import { create } from "zustand";
import { habitService } from "../services/habitService";
import type { Habit, HabitInput } from "../types";
import { toMonthKey } from "../utils/date";
import { applyToggle } from "../utils/habitLogs";

interface HabitState {
  habits: Habit[];
  // The month currently being viewed (a Date pinned to the 1st).
  viewMonth: Date;
  loading: boolean;
  error: string | null;

  fetchHabits: () => Promise<void>;
  setViewMonth: (date: Date) => Promise<void>;
  addHabit: (input: HabitInput) => Promise<void>;
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
      const { habits } = await habitService.getHabits(toMonthKey(get().viewMonth));
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
      const habit = await habitService.createHabit(input);
      set({ habits: [...get().habits, habit] });
    } catch (e) {
      set({ error: (e as Error).message });
    }
  },

  removeHabit: async (id) => {
    try {
      await habitService.deleteHabit(id);
      set({ habits: get().habits.filter((h) => h.id !== id) });
    } catch (e) {
      set({ error: (e as Error).message });
    }
  },

  toggle: async (habitId, date) => {
    try {
      const { completed } = await habitService.toggleHabit(habitId, date);
      set({ habits: applyToggle(get().habits, habitId, date, completed) });
    } catch (e) {
      set({ error: (e as Error).message });
    }
  },
}));
