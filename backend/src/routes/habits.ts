import { Router } from "express";
import { z } from "zod";
import { prisma } from "../prisma";
import { requireAuth } from "../auth";

export const habitsRouter = Router();

// Every habit route requires a logged-in user.
habitsRouter.use(requireAuth);

// Returns the [start, end] YYYY-MM-DD bounds for a given "YYYY-MM" month.
function monthBounds(month: string): { start: string; end: string } {
  const [year, mon] = month.split("-").map(Number);
  const start = `${month}-01`;
  const lastDay = new Date(year, mon, 0).getDate(); // day 0 of next month = last day
  const end = `${month}-${String(lastDay).padStart(2, "0")}`;
  return { start, end };
}

const monthSchema = z
  .string()
  .regex(/^\d{4}-\d{2}$/)
  .optional();

// GET /api/habits?month=YYYY-MM
// Fetch all habits for the logged-in user with logs for the requested month
// (defaults to the current month).
habitsRouter.get("/", async (req, res) => {
  const parsedMonth = monthSchema.safeParse(req.query.month);
  if (!parsedMonth.success) {
    return res.status(400).json({ error: "month must be in YYYY-MM format" });
  }

  const now = new Date();
  const month =
    parsedMonth.data ?? `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const { start, end } = monthBounds(month);

  const habits = await prisma.habit.findMany({
    where: { userId: req.user!.userId },
    orderBy: { createdAt: "asc" },
    include: {
      logs: {
        where: { date: { gte: start, lte: end } },
        orderBy: { date: "asc" },
      },
    },
  });

  return res.json({ month, habits });
});

const createHabitSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  description: z.string().trim().max(500).optional(),
  frequency: z.string().trim().min(1).optional(),
});

// POST /api/habits -> Create a new habit.
habitsRouter.post("/", async (req, res) => {
  const parsed = createHabitSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.errors[0].message });
  }

  const habit = await prisma.habit.create({
    data: {
      userId: req.user!.userId,
      name: parsed.data.name,
      description: parsed.data.description ?? "",
      frequency: parsed.data.frequency ?? "daily",
    },
    include: { logs: true },
  });

  return res.status(201).json(habit);
});

// DELETE /api/habits/:id -> Delete a habit (only if it belongs to the user).
habitsRouter.delete("/:id", async (req, res) => {
  const habit = await prisma.habit.findUnique({ where: { id: req.params.id } });
  if (!habit || habit.userId !== req.user!.userId) {
    return res.status(404).json({ error: "Habit not found" });
  }

  await prisma.habit.delete({ where: { id: habit.id } });
  return res.status(204).send();
});

const toggleSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "date must be YYYY-MM-DD"),
});

// POST /api/habits/:id/toggle -> Toggle completion status for a specific date.
// If a "completed" log exists for that date it is removed; otherwise one is created.
habitsRouter.post("/:id/toggle", async (req, res) => {
  const parsed = toggleSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.errors[0].message });
  }
  const { date } = parsed.data;

  const habit = await prisma.habit.findUnique({ where: { id: req.params.id } });
  if (!habit || habit.userId !== req.user!.userId) {
    return res.status(404).json({ error: "Habit not found" });
  }

  const existing = await prisma.completionLog.findUnique({
    where: { habitId_date: { habitId: habit.id, date } },
  });

  if (existing) {
    await prisma.completionLog.delete({ where: { id: existing.id } });
    return res.json({ habitId: habit.id, date, status: "missed", completed: false });
  }

  await prisma.completionLog.create({
    data: { habitId: habit.id, date, status: "completed" },
  });
  return res.json({ habitId: habit.id, date, status: "completed", completed: true });
});
