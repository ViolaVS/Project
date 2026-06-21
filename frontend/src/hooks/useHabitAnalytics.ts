import { useMemo } from "react";
import { useHabitStore } from "../store/habitStore";
import { currentStreak, monthRate } from "../utils/analytics";
import type { Habit } from "../types";

export interface HabitProgress {
  habit: Habit;
  streak: number;
  rate: number;
}

// Derives streak + monthly completion rate per habit for the viewed month.
// Memoized so the (non-trivial) per-habit math only re-runs when inputs change.
export function useHabitAnalytics(): HabitProgress[] {
  const habits = useHabitStore((s) => s.habits);
  const viewMonth = useHabitStore((s) => s.viewMonth);

  return useMemo(
    () =>
      habits.map((habit) => ({
        habit,
        streak: currentStreak(habit),
        rate: monthRate(habit, viewMonth),
      })),
    [habits, viewMonth]
  );
}
