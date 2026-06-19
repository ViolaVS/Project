# Project Plan: Habit Tracker Application

An interactive, full-stack application designed to help users build and maintain positive habits through daily tracking, monthly visual progress, and dynamic analytics.

---

## 🛠️ Tech Stack & Architecture

- **Frontend:** React (TypeScript), Tailwind CSS (for styling), Lucide React (for icons), date-fns / Day.js (for calendar logic).
- **Backend:** Node.js with Express (TypeScript).
- **Database:** MongoDB or PostgreSQL (for storing users, habits, and completion logs).
- **State Management:** React Context API or Zustand.

---

## 📅 Phase 1: Architecture & Database Design

### 1. Database Schema

- **User Schema:** `id`, `email`, `passwordHash`, `createdAt`.
- **Habit Schema:** `id`, `userId`, `name`, `description`, `frequency` (e.g., daily, specific days), `createdAt`.
- **Completion Log Schema:** `id`, `habitId`, `date` (YYYY-MM-DD), `status` (completed / missed).

### 2. API Endpoints (Node.js/Express)

- `POST /api/auth/register` & `POST /api/auth/login`
- `GET /api/habits` -> Fetch all habits for the logged-in user with logs for the current month.
- `POST /api/habits` -> Create a new habit.
- `DELETE /api/habits/:id` -> Delete a habit.
- `POST /api/habits/:id/toggle` -> Toggle completion status for a specific date.

---

## 💻 Phase 2: Frontend UI Component Structure

```text
src/
├── components/
│ ├── Layout/ # Navbar, Sidebar
│ ├── Dashboard/ # Main container
│ ├── HabitList/ # List of current habits with quick check-in
│ ├── Calendar/ # Monthly grid view with heatmaps
│ └── Analytics/ # Progress bars and streak counters
├── context/ # Global state (HabitContext)
└── utils/ # Date helpers (date-fns)
```
