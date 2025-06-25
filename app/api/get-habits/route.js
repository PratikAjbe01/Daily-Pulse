// /pages/api/get-habits-with-status.js (or /app/api if you're using app router)
import { db } from "@/configs";
import { habitCompletions, habits } from "@/configs/schema";
import { eq } from "drizzle-orm";

import { NextResponse } from "next/server";


export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const userId = Number(searchParams.get("userId"));

  if (!userId) {
    return NextResponse.json({ success: false, message: "userId is required" }, { status: 400 });
  }

  const today = new Date().toISOString().slice(0, 10);

  const userHabits = await db.select().from(habits).where(eq(habits.userId, userId));

  const todayCompletions = await db
    .select()
    .from(habitCompletions)
    .where(eq(habitCompletions.date, today));

  const completedSet = new Set(todayCompletions.map(c => c.habitId));

  const habitsWithCompletion = userHabits.map(h => ({
    ...h,
    completed: completedSet.has(h.id),
  }));

  return NextResponse.json({ success: true, data: habitsWithCompletion });
}
