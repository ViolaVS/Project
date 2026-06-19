# Habit Tracker

A full-stack application for building and maintaining positive habits through
daily tracking, a monthly heatmap calendar, and progress/streak analytics.

Built per [`Plan.md`](./Plan.md).

## Tech Stack

| Layer    | Tech                                                              |
| -------- | ----------------------------------------------------------------- |
| Frontend | React + TypeScript (Vite), Tailwind CSS, Lucide icons, date-fns   |
| State    | Zustand                                                           |
| Backend  | Node.js + Express (TypeScript)                                    |
| Database | PostgreSQL via Prisma                                             |
| Auth     | JWT (bcrypt-hashed passwords)                                     |

## Project Structure

```text
.
├── backend/                # Express API + Prisma
│   ├── prisma/schema.prisma
│   └── src/
│       ├── index.ts        # App entrypoint
│       ├── auth.ts         # JWT signing + requireAuth middleware
│       ├── prisma.ts       # Shared Prisma client
│       ├── seed.ts         # Demo data seeder
│       └── routes/         # auth.ts, habits.ts
└── frontend/               # React app
    └── src/
        ├── api/client.ts   # Typed fetch wrapper
        ├── store/          # Zustand stores (auth, habits)
        ├── utils/date.ts   # date-fns helpers
        └── components/     # Layout, Dashboard, HabitList, Calendar, Analytics, Auth
```

## API Endpoints

| Method   | Path                       | Description                                    |
| -------- | -------------------------- | ---------------------------------------------- |
| `POST`   | `/api/auth/register`       | Create an account, returns a JWT               |
| `POST`   | `/api/auth/login`          | Log in, returns a JWT                          |
| `GET`    | `/api/habits?month=YYYY-MM`| Habits for the user with logs for that month   |
| `POST`   | `/api/habits`              | Create a habit                                 |
| `DELETE` | `/api/habits/:id`          | Delete a habit                                 |
| `POST`   | `/api/habits/:id/toggle`   | Toggle completion for a `{ date }` (YYYY-MM-DD)|

## Getting Started

### Prerequisites

- Node.js 18+
- A running PostgreSQL instance

### 1. Backend

```bash
cd backend
npm install

# Configure the database connection
cp .env.example .env        # then edit DATABASE_URL if needed

# Create the database tables
npm run prisma:push

# (Optional) load a demo user + sample data
npm run seed

# Start the API on http://localhost:4000
npm run dev
```

### 2. Frontend

```bash
cd frontend
npm install

# Start the dev server on http://localhost:5173 (proxies /api -> :4000)
npm run dev
```

Open <http://localhost:5173>.

### Demo account

After running `npm run seed` in the backend you can log in with:

```
email:    demo@habittracker.dev
password: demo1234
```

## Notes

- The dev server proxies `/api` to the backend, so no extra config is needed
  locally. CORS is also enabled on the backend for `CLIENT_ORIGIN`.
- To switch databases, change the `provider`/`url` in
  `backend/prisma/schema.prisma` and `.env`, then re-run `npm run prisma:push`.
```
