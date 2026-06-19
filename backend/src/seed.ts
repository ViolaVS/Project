import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

// Seeds a demo user with a few habits and some completion history for the
// current month so the UI has something to show on first run.
async function main() {
  const email = "demo@habittracker.dev";
  const password = "demo1234";

  await prisma.user.deleteMany({ where: { email } });

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({ data: { email, passwordHash } });

  const habitNames = [
    { name: "Drink 2L of water", description: "Stay hydrated through the day" },
    { name: "Read 20 minutes", description: "Any book counts" },
    { name: "Morning workout", description: "At least 15 minutes" },
  ];

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0-indexed
  const today = now.getDate();

  for (const h of habitNames) {
    const habit = await prisma.habit.create({
      data: { userId: user.id, name: h.name, description: h.description },
    });

    // Mark a handful of past days as completed (skip some to look realistic).
    for (let day = 1; day <= today; day++) {
      if ((day + h.name.length) % 3 === 0) continue; // skip ~1/3 of days
      const date = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      await prisma.completionLog.create({
        data: { habitId: habit.id, date, status: "completed" },
      });
    }
  }

  console.log(`✅ Seeded demo user: ${email} / ${password}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
