import { Flame, TrendingUp } from "lucide-react";
import { useHabitStore } from "../../store/habitStore";
import type { Habit } from "../../types";
import { toISODate } from "../../utils/date";

// Current streak: consecutive days ending today (or yesterday) that are completed.
function currentStreak(habit: Habit): number {
  const done = new Set(
    habit.logs.filter((l) => l.status === "completed").map((l) => l.date)
  );
  let streak = 0;
  const cursor = new Date();
  // Allow the streak to count from today; if today isn't done yet, start at yesterday.
  if (!done.has(toISODate(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
  }
  while (done.has(toISODate(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

// Completion rate for the currently-viewed month (completed days / days elapsed).
function monthRate(habit: Habit, viewMonth: Date): number {
  const now = new Date();
  const isCurrentMonth =
    viewMonth.getFullYear() === now.getFullYear() && viewMonth.getMonth() === now.getMonth();
  const daysInMonth = new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 0).getDate();
  const denominator = isCurrentMonth ? now.getDate() : daysInMonth;
  const completed = habit.logs.filter((l) => l.status === "completed").length;
  if (denominator === 0) return 0;
  return Math.min(1, completed / denominator);
}

export default function Analytics() {
  const { habits, viewMonth } = useHabitStore();

  if (habits.length === 0) return null;

  return (
    <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="text-indigo-600" size={20} />
        <h2 className="text-lg font-semibold">Progress &amp; Streaks</h2>
      </div>

      <ul className="space-y-4">
        {habits.map((habit) => {
          const rate = monthRate(habit, viewMonth);
          const streak = currentStreak(habit);
          return (
            <li key={habit.id}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium truncate">{habit.name}</span>
                <span className="flex items-center gap-1 text-sm text-orange-500 font-medium">
                  <Flame size={15} />
                  {streak}d
                </span>
              </div>
              <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full bg-indigo-500 rounded-full transition-all"
                  style={{ width: `${Math.round(rate * 100)}%` }}
                />
              </div>
              <p className="text-xs text-slate-400 mt-1">{Math.round(rate * 100)}% this month</p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
