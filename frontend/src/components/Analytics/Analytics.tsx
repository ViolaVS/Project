import { Flame, TrendingUp } from "lucide-react";
import Card from "../ui/Card";
import { useHabitAnalytics } from "../../hooks/useHabitAnalytics";

export default function Analytics() {
  const progress = useHabitAnalytics();

  if (progress.length === 0) return null;

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="text-indigo-600" size={20} />
        <h2 className="text-lg font-semibold">Progress &amp; Streaks</h2>
      </div>

      <ul className="space-y-4">
        {progress.map(({ habit, streak, rate }) => {
          const percent = Math.round(rate * 100);
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
                  style={{ width: `${percent}%` }}
                />
              </div>
              <p className="text-xs text-slate-400 mt-1">{percent}% this month</p>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
