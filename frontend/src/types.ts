// Shared domain types mirroring the backend API responses.

export interface User {
  id: string;
  email: string;
}

export type CompletionStatus = "completed" | "missed";

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
