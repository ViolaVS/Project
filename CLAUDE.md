# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Full-stack habit tracker: daily check-ins, a monthly heatmap calendar, and streak/progress analytics. Built per [`Plan.md`](./Plan.md). See [`README.md`](./README.md) for setup and the API table.

This is **two independent npm projects** (`backend/` and `frontend/`) — there is no root workspace or root `package.json`. Run npm commands from inside each directory.

## Commands

### Backend (`cd backend`)
- `npm run dev` — start the API on :4000 with hot reload (tsx watch)
- `npm run prisma:push` — create/sync DB tables from `prisma/schema.prisma` (run after schema changes; no migration files)
- `npm run prisma:generate` — regenerate the typed Prisma client (run after editing the schema)
- `npm run seed` — reset + load the demo user (`demo@habittracker.dev` / `demo1234`) with sample logs for the current month
- `npm run build` / `npm start` — compile to `dist/` and run the compiled server
- `npx tsc --noEmit` — typecheck only

### Frontend (`cd frontend`)
- `npm run dev` — Vite dev server on :5173 (proxies `/api` → `localhost:4000`)
- `npm run build` — typecheck (`tsc -b`) + production build
- `npm run preview` — serve the production build

There is **no test suite or linter configured** in either project. "Verify" means typecheck + build + manual run.

## Architecture

### Data model (`backend/prisma/schema.prisma`)
Three tables: `User` → `Habit` → `CompletionLog` (cascade deletes down the chain).
- **Dates are `YYYY-MM-DD` strings**, not `DateTime` — month filtering is lexicographic string range (`gte`/`lte`), and a `@@unique([habitId, date])` constraint makes toggling idempotent (one log per habit per day).
- **`CompletionLog.status` is a `String`** (`"completed"` / `"missed"`), not an enum, because the datasource is **SQLite** (no native enum). If you switch back to PostgreSQL, you can restore a real `enum`.
- "Completed for a day" = a row simply **exists** for that `(habitId, date)`. Toggle deletes the row to un-complete.

### Backend request flow
`src/index.ts` mounts `/api/auth` (public) and `/api/habits` (auth-gated). All habit routes call `requireAuth` (`src/auth.ts`), which verifies the JWT and sets `req.user`. **Every habit query is scoped by `req.user.userId`** — ownership is re-checked on `:id` routes (returns 404, not 403, for other users' habits). Request bodies are validated with zod; the shared Prisma client is `src/prisma.ts`.

### Frontend state (Zustand, not Context despite the plan's folder naming)
Two stores in `src/store/`:
- `authStore` — token persisted to `localStorage` (via `api/client.ts`); `App.tsx` renders `<AuthForm>` vs `<Dashboard>` based on token presence.
- `habitStore` — holds `habits` + `viewMonth`. `fetchHabits()` always requests the `viewMonth`'s logs; changing month refetches. `toggle()` updates local state optimistically from the server response.

All HTTP goes through `src/api/client.ts` (`request()` attaches the Bearer token and unwraps `{ error }` payloads). Components never call `fetch` directly.

### Derived UI (no extra API calls)
The **Calendar heatmap** and **Analytics** (streaks, monthly %) are computed **client-side** from the `habit.logs` already loaded for the viewed month — there are no analytics endpoints. Streak logic and month-rate live in `components/Analytics/Analytics.tsx`; date grid math is in `utils/date.ts` (date-fns, **week starts Monday**).

## Switching the database back to PostgreSQL
The project was switched from Postgres to SQLite for zero-setup local dev. To revert: set `provider = "postgresql"` in `schema.prisma`, restore the `enum CompletionStatus` + `status` field type, point `DATABASE_URL` (in `backend/.env`) at a Postgres instance, then `npm run prisma:generate && npm run prisma:push`.
