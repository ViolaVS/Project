import { request } from "../api/client";
import type { Habit, HabitInput, HabitsResponse, ToggleResponse } from "../types";

// Service layer for habits: typed API calls. Business logic lives in utils,
// UI state lives in the store — this module only talks to the API.
export const habitService = {
  getHabits: (month?: string) =>
    request<HabitsResponse>(`/habits${month ? `?month=${month}` : ""}`),

  createHabit: (input: HabitInput) =>
    request<Habit>("/habits", { method: "POST", body: JSON.stringify(input) }),

  deleteHabit: (id: string) => request<void>(`/habits/${id}`, { method: "DELETE" }),

  toggleHabit: (id: string, date: string) =>
    request<ToggleResponse>(`/habits/${id}/toggle`, {
      method: "POST",
      body: JSON.stringify({ date }),
    }),
};
