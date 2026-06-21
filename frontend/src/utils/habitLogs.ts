import { COMPLETION_STATUS } from "../constants";
import type { Habit } from "../types";

// Pure reducer: reflect a toggle result in the habit list. Adding/removing the
// log for `(habitId, date)` keeps the local state in sync with the server
// without an extra fetch. Used for the store's optimistic update.
export function applyToggle(
  habits: Habit[],
  habitId: string,
  date: string,
  completed: boolean
): Habit[] {
  return habits.map((habit) => {
    if (habit.id !== habitId) return habit;

    const logsWithoutDate = habit.logs.filter((l) => l.date !== date);
    if (!completed) return { ...habit, logs: logsWithoutDate };

    return {
      ...habit,
      logs: [
        ...logsWithoutDate,
        { id: `${habitId}-${date}`, habitId, date, status: COMPLETION_STATUS.Completed },
      ],
    };
  });
}

// Whether a habit is checked off for the given date.
export function isDoneOn(habit: Habit, date: string): boolean {
  return habit.logs.some((l) => l.date === date);
}
