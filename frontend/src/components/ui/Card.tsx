import type { ReactNode } from "react";

const CARD_CLASS = "bg-white rounded-2xl shadow-sm border border-slate-200";

interface CardProps {
  children: ReactNode;
  className?: string;
}

// Reusable surface card. Centralizes the shared panel styling so it isn't
// repeated across the analytics, calendar, habit-list, and auth screens.
export default function Card({ children, className = "" }: CardProps) {
  return <section className={`${CARD_CLASS} ${className}`}>{children}</section>;
}
