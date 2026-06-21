import { ChevronLeft, ChevronRight } from "lucide-react";
import Card from "../ui/Card";
import { useHabitStore } from "../../store/habitStore";
import { useCalendarGrid } from "../../hooks/useCalendarGrid";
import { monthLabel, WEEKDAY_LABELS } from "../../utils/date";
import { heatClass } from "../../utils/heatmap";

// Monthly grid heatmap: each cell is colored by the share of habits completed
// that day across all of the user's habits.
export default function Calendar() {
  const viewMonth = useHabitStore((s) => s.viewMonth);
  const setViewMonth = useHabitStore((s) => s.setViewMonth);
  const { blanks, totalHabits, cells } = useCalendarGrid();

  const changeMonth = (delta: number) => {
    setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + delta, 1));
  };

  return (
    <Card className="p-6">
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

        {cells.map((cell) => (
          <div
            key={cell.iso}
            title={`${cell.iso}: ${cell.count}/${totalHabits} completed`}
            className={`aspect-square rounded-lg flex flex-col items-center justify-center text-xs font-medium ${heatClass(
              cell.ratio
            )} ${cell.isToday ? "ring-2 ring-indigo-500" : ""}`}
          >
            <span>{cell.dayNumber}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-end gap-1.5 mt-4 text-xs text-slate-400">
        <span>Less</span>
        <span className="h-3 w-3 rounded bg-slate-100" />
        <span className="h-3 w-3 rounded bg-emerald-200" />
        <span className="h-3 w-3 rounded bg-emerald-400" />
        <span className="h-3 w-3 rounded bg-emerald-600" />
        <span>More</span>
      </div>
    </Card>
  );
}
