import { ChevronLeft, ChevronRight } from "lucide-react";
import { useHabitStore } from "../../store/habitStore";
import {
  daysInMonth,
  leadingBlanks,
  monthLabel,
  toISODate,
  todayISO,
  WEEKDAY_LABELS,
} from "../../utils/date";

// Returns a Tailwind background class based on the completion ratio (0..1).
function heatClass(ratio: number): string {
  if (ratio === 0) return "bg-slate-100 text-slate-400";
  if (ratio < 0.34) return "bg-emerald-200 text-emerald-900";
  if (ratio < 0.67) return "bg-emerald-400 text-white";
  if (ratio < 1) return "bg-emerald-500 text-white";
  return "bg-emerald-600 text-white";
}

// Monthly grid heatmap: each cell is colored by the share of habits completed
// that day across all of the user's habits.
export default function Calendar() {
  const { habits, viewMonth, setViewMonth } = useHabitStore();

  const days = daysInMonth(viewMonth);
  const blanks = leadingBlanks(viewMonth);
  const today = todayISO();
  const totalHabits = habits.length;

  // Count completions per date for the visible month.
  const completionsByDate = new Map<string, number>();
  for (const habit of habits) {
    for (const log of habit.logs) {
      if (log.status === "completed") {
        completionsByDate.set(log.date, (completionsByDate.get(log.date) ?? 0) + 1);
      }
    }
  }

  const changeMonth = (delta: number) => {
    setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + delta, 1));
  };

  return (
    <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">{monthLabel(viewMonth)}</h2>
        <div className="flex items-center gap-1">
          <button
            onClick={() => changeMonth(-1)}
            aria-label="Previous month"
            className="p-1.5 rounded-lg hover:bg-slate-100"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => changeMonth(1)}
            aria-label="Next month"
            className="p-1.5 rounded-lg hover:bg-slate-100"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1.5 mb-1.5">
        {WEEKDAY_LABELS.map((label) => (
          <div key={label} className="text-center text-xs font-medium text-slate-400">
            {label}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1.5">
        {Array.from({ length: blanks }).map((_, i) => (
          <div key={`blank-${i}`} />
        ))}

        {days.map((day) => {
          const iso = toISODate(day);
          const count = completionsByDate.get(iso) ?? 0;
          const ratio = totalHabits > 0 ? count / totalHabits : 0;
          const isToday = iso === today;
          return (
            <div
              key={iso}
              title={`${iso}: ${count}/${totalHabits} completed`}
              className={`aspect-square rounded-lg flex flex-col items-center justify-center text-xs font-medium ${heatClass(
                ratio
              )} ${isToday ? "ring-2 ring-indigo-500" : ""}`}
            >
              <span>{day.getDate()}</span>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-end gap-1.5 mt-4 text-xs text-slate-400">
        <span>Less</span>
        <span className="h-3 w-3 rounded bg-slate-100" />
        <span className="h-3 w-3 rounded bg-emerald-200" />
        <span className="h-3 w-3 rounded bg-emerald-400" />
        <span className="h-3 w-3 rounded bg-emerald-600" />
        <span>More</span>
      </div>
    </section>
  );
}
