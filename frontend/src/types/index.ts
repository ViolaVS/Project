// Shared domain types mirroring the backend API responses.

import type { COMPLETION_STATUS } from "../constants";

export interface User {
  id: string;
  email: string;
}

// Derived from the COMPLETION_STATUS constant so the values stay in one place.
export type CompletionStatus = (typeof COMPLETION_STATUS)[keyof typeof COMPLETION_STATUS];

export interface CompletionLog {
  id: string;
  habitId: string;
  date: string; // YYYY-MM-DD
  status: CompletionStatus;
}

export interface Habit {
  id: string;
  userId: string;
  name: string;
  description: string;
  frequency: string;
  createdAt: string;
  logs: CompletionLog[];
}

// Input accepted when creating a habit.
export interface HabitInput {
  name: string;
  description?: string;
  frequency?: string;
}

// ---- API response shapes ----

export interface AuthResponse {
  token: string;
  user: User;
}

export interface HabitsResponse {
  month: string;
  habits: Habit[];
}

export interface ToggleResponse {
  habitId: string;
  date: string;
  status: string;
  completed: boolean;
}
