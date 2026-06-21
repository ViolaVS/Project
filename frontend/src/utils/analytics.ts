import { COMPLETION_STATUS } from "../constants";
import type { Habit } from "../types";
import { toISODate } from "./date";

// Current streak: consecutive completed days ending today (or yesterday if
// today isn't checked off yet).
export function currentStreak(habit: Habit): number {
  const done = new Set(
    habit.logs.filter((l) => l.status === COMPLETION_STATUS.Completed).map((l) => l.date)
  );

  let streak = 0;
  const cursor = new Date();
  if (!done.has(toISODate(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
  }
  while (done.has(toISODate(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

// Completion rate for the viewed month (completed days / days elapsed).
export function monthRate(habit: Habit, viewMonth: Date): number {
  const now = new Date();
  const isCurrentMonth =
    viewMonth.getFullYear() === now.getFullYear() && viewMonth.getMonth() === now.getMonth();
  const daysInMonth = new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 0).getDate();
  const denominator = isCurrentMonth ? now.getDate() : daysInMonth;
  if (denominator === 0) return 0;

  const completed = habit.logs.filter((l) => l.status === COMPLETION_STATUS.Completed).length;
  return Math.min(1, completed / denominator);
}
