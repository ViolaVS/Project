import { FormEvent, useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import Card from "../ui/Card";
import { INPUT_CLASS, PRIMARY_BUTTON_CLASS } from "../ui/styles";
import { useAuthStore } from "../../store/authStore";

// Combined login / register screen shown when there is no auth token.
export default function AuthForm() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login, register, loading, error, clearError } = useAuthStore();

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (mode === "login") await login(email, password);
    else await register(email, password);
  };

  const switchMode = () => {
    clearError();
    setMode((m) => (m === "login" ? "register" : "login"));
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-sm p-8">
        <div className="flex items-center gap-2 mb-6">
          <CheckCircle2 className="text-indigo-600" />
          <h1 className="text-xl font-semibold">Habit Tracker</h1>
        </div>

        <h2 className="text-lg font-medium mb-4">
          {mode === "login" ? "Welcome back" : "Create your account"}
        </h2>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={INPUT_CLASS}
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={INPUT_CLASS}
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className={`${PRIMARY_BUTTON_CLASS} w-full flex items-center justify-center gap-2 py-2`}
          >
            {loading && <Loader2 className="animate-spin" size={18} />}
            {mode === "login" ? "Log in" : "Sign up"}
          </button>
        </form>

        <p className="text-sm text-slate-500 mt-4 text-center">
          {mode === "login" ? "No account yet?" : "Already have an account?"}{" "}
          <button onClick={switchMode} className="text-indigo-600 font-medium hover:underline">
            {mode === "login" ? "Sign up" : "Log in"}
          </button>
        </p>

        <p className="text-xs text-slate-400 mt-6 text-center">
          Demo login: demo@habittracker.dev / demo1234
        </p>
      </Card>
    </div>
  );
}
