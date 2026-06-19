import { CheckCircle2, LogOut } from "lucide-react";
import { useAuthStore } from "../../store/authStore";

export default function Navbar() {
  const { user, logout } = useAuthStore();

  return (
    <header className="bg-white border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="text-indigo-600" />
          <span className="text-lg font-semibold">Habit Tracker</span>
        </div>

        <div className="flex items-center gap-4">
          {user && <span className="text-sm text-slate-500 hidden sm:inline">{user.email}</span>}
          <button
            onClick={logout}
            className="flex items-center gap-1.5 text-sm text-slate-600 hover:text-slate-900"
          >
            <LogOut size={16} />
            Log out
          </button>
        </div>
      </div>
    </header>
  );
}
