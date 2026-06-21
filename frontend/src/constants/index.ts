// Centralized app constants — no magic strings/numbers scattered across files.

// Completion status values (mirrors the backend `CompletionLog.status` string).
export const COMPLETION_STATUS = {
  Completed: "completed",
  Missed: "missed",
} as const;

// localStorage keys.
export const STORAGE_KEYS = {
  Token: "habit-tracker-token",
} as const;

// Calendar heatmap intensity thresholds (completion ratio, 0..1).
// A day's color steps up as it crosses each threshold.
export const HEATMAP_THRESHOLDS = {
  Low: 0.34,
  Medium: 0.67,
  Full: 1,
} as const;
