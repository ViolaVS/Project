import { useAuthStore } from "./store/authStore";
import AuthForm from "./components/Auth/AuthForm";
import Dashboard from "./components/Dashboard/Dashboard";

export default function App() {
  const token = useAuthStore((s) => s.token);
  return token ? <Dashboard /> : <AuthForm />;
}
