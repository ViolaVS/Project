import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useHabitStore } from "../../store/habitStore";
import Navbar from "../Layout/Navbar";
import HabitList from "../HabitList/HabitList";
import Calendar from "../Calendar/Calendar";
import Analytics from "../Analytics/Analytics";

// Main authenticated view: ties together the habit list, calendar and analytics.
export default function Dashboard() {
  const { fetchHabits, loading, error } = useHabitStore();

  useEffect(() => {
    fetchHabits();
  }, [fetchHabits]);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20 text-slate-400">
            <Loader2 className="animate-spin mr-2" /> Loading your habits…
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-1 space-y-6">
              <HabitList />
              <Analytics />
            </div>
            <div className="lg:col-span-2">
              <Calendar />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
