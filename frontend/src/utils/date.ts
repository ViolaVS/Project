import {
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  startOfMonth,
} from "date-fns";

// Format a Date as a YYYY-MM-DD string (the format used by the API).
export function toISODate(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

// "YYYY-MM" key for a given date — used to scope a month of habit logs.
export function toMonthKey(date: Date): string {
  return format(date, "yyyy-MM");
}

export function todayISO(): string {
  return toISODate(new Date());
}

// All day-of-month Date objects for the month containing `date`.
export function daysInMonth(date: Date): Date[] {
  return eachDayOfInterval({ start: startOfMonth(date), end: endOfMonth(date) });
}

// Number of blank leading cells so the 1st lands under the right weekday.
// Week starts on Monday: Mon=0 ... Sun=6.
export function leadingBlanks(date: Date): number {
  const firstWeekday = getDay(startOfMonth(date)); // Sun=0..Sat=6
  return (firstWeekday + 6) % 7;
}

export const WEEKDAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function monthLabel(date: Date): string {
  return format(date, "MMMM yyyy");
}
