import { expect, test } from "@playwright/test";

// Today's date in the YYYY-MM-DD format the app uses for calendar cell titles.
const todayISO = new Date().toISOString().slice(0, 10);

test("demo user can log in and see seeded habits", async ({ page }) => {
  await page.goto("/");

  await page.locator('input[type="email"]').fill("demo@habittracker.dev");
  await page.locator('input[type="password"]').fill("demo1234");
  await page.getByRole("button", { name: "Log in" }).click();

  await expect(page.getByRole("heading", { name: "Today’s Habits" })).toBeVisible();
  // Habit names appear in both the list and the analytics panel — match the first.
  await expect(page.getByText("Drink 2L of water").first()).toBeVisible();
  await expect(page.getByRole("heading", { name: "Progress & Streaks" })).toBeVisible();
});

test("new user can register, add a habit, and mark it complete", async ({ page }) => {
  // Unique email per run so the test is isolated and repeatable.
  const email = `e2e+${Date.now()}@test.dev`;

  await page.goto("/");

  // Switch to the register form.
  await page.getByRole("button", { name: "Sign up" }).click();
  await page.locator('input[type="email"]').fill(email);
  await page.locator('input[type="password"]').fill("password123");
  await page.getByRole("button", { name: "Sign up" }).click();

  // Fresh account starts empty.
  await expect(page.getByText("No habits yet.")).toBeVisible();

  // Add a habit.
  await page.getByRole("button", { name: "New habit" }).click();
  await page.getByPlaceholder("Habit name (e.g. Meditate)").fill("Meditate");
  await page.getByRole("button", { name: "Add", exact: true }).click();
  await expect(page.getByText("Meditate").first()).toBeVisible();

  // Mark it done for today and confirm the calendar heatmap updates (1/1).
  await page.getByRole("button", { name: "Mark as done" }).click();
  await expect(page.getByTitle(`${todayISO}: 1/1 completed`)).toBeVisible();

  // The list button toggles to the "not done" state.
  await expect(page.getByRole("button", { name: "Mark as not done" })).toBeVisible();
});
