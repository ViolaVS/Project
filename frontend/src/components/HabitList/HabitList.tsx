import { FormEvent, useState } from "react";
import { Check, Plus, Trash2 } from "lucide-react";
import Card from "../ui/Card";
import { INPUT_CLASS, PRIMARY_BUTTON_CLASS } from "../ui/styles";
import { useHabitStore } from "../../store/habitStore";
import { todayISO } from "../../utils/date";
import { isDoneOn } from "../../utils/habitLogs";

// List of habits with a quick "done today" check-in plus an add/delete UI.
export default function HabitList() {
  const habits = useHabitStore((s) => s.habits);
  const addHabit = useHabitStore((s) => s.addHabit);
  const removeHabit = useHabitStore((s) => s.removeHabit);
  const toggle = useHabitStore((s) => s.toggle);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [showForm, setShowForm] = useState(false);

  const today = todayISO();

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    await addHabit({ name: name.trim(), description: description.trim() });
    setName("");
    setDescription("");
    setShowForm(false);
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Today’s Habits</h2>
        <button
          onClick={() => setShowForm((s) => !s)}
          className="flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700"
        >
          <Plus size={16} />
          New habit
        </button>
      </div>

      {showForm && (
        <form onSubmit={submit} className="mb-4 space-y-2 bg-slate-50 rounded-xl p-4">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Habit name (e.g. Meditate)"
            className={`${INPUT_CLASS} text-sm`}
            autoFocus
          />
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description (optional)"
            className={`${INPUT_CLASS} text-sm`}
          />
          <div className="flex gap-2">
            <button type="submit" className={`${PRIMARY_BUTTON_CLASS} px-4 py-1.5 text-sm`}>
              Add
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="text-slate-500 text-sm px-2"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {habits.length === 0 ? (
        <p className="text-sm text-slate-500 py-6 text-center">
          No habits yet. Add one to get started!
        </p>
      ) : (
        <ul className="divide-y divide-slate-100">
          {habits.map((habit) => {
            const done = isDoneOn(habit, today);
            return (
              <li key={habit.id} className="flex items-center gap-3 py-3">
                <button
                  onClick={() => toggle(habit.id, today)}
                  aria-label={done ? "Mark as not done" : "Mark as done"}
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 transition ${
                    done
                      ? "bg-emerald-500 border-emerald-500 text-white"
                      : "border-slate-300 text-transparent hover:border-emerald-400"
                  }`}
                >
                  <Check size={16} />
                </button>

                <div className="flex-1 min-w-0">
                  <p className={`font-medium ${done ? "text-slate-400 line-through" : ""}`}>
                    {habit.name}
                  </p>
                  {habit.description && (
                    <p className="text-xs text-slate-400 truncate">{habit.description}</p>
                  )}
                </div>

                <button
                  onClick={() => removeHabit(habit.id)}
                  aria-label="Delete habit"
                  className="text-slate-300 hover:text-red-500 transition"
                >
                  <Trash2 size={18} />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}
