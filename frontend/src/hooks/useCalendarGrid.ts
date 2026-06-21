import { useMemo } from "react";
import { COMPLETION_STATUS } from "../constants";
import { useHabitStore } from "../store/habitStore";
import { daysInMonth, leadingBlanks, toISODate, todayISO } from "../utils/date";

export interface CalendarCell {
  iso: string;
  dayNumber: number;
  count: number;
  ratio: number;
  isToday: boolean;
}

export interface CalendarGrid {
  blanks: number;
  totalHabits: number;
  cells: CalendarCell[];
}

// Builds the month grid + per-day completion ratios for the heatmap.
// Memoized: aggregating every habit's logs is the "heavy calculation" here.
export function useCalendarGrid(): CalendarGrid {
  const habits = useHabitStore((s) => s.habits);
  const viewMonth = useHabitStore((s) => s.viewMonth);

  return useMemo(() => {
    const totalHabits = habits.length;
    const today = todayISO();

    const completionsByDate = new Map<string, number>();
    for (const habit of habits) {
      for (const log of habit.logs) {
        if (log.status === COMPLETION_STATUS.Completed) {
          completionsByDate.set(log.date, (completionsByDate.get(log.date) ?? 0) + 1);
        }
      }
    }

    const cells: CalendarCell[] = daysInMonth(viewMonth).map((day) => {
      const iso = toISODate(day);
      const count = completionsByDate.get(iso) ?? 0;
      return {
        iso,
        dayNumber: day.getDate(),
        count,
        ratio: totalHabits > 0 ? count / totalHabits : 0,
        isToday: iso === today,
      };
    });

    return { blanks: leadingBlanks(viewMonth), totalHabits, cells };
  }, [habits, viewMonth]);
}
