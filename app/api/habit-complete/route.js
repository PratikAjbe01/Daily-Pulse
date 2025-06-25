import { db } from "@/configs";
import { habitCompletions, habits } from "@/configs/schema";
import { and, desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";


export async function POST(req) {
  try {
    const { habitId } = await req.json();

    if (!habitId) {
      return NextResponse.json({
        success: false,
        message: "habitId is required",
      }, { status: 400 });
    }

    const today = new Date().toISOString().slice(0, 10);

    // Insert completion if not already marked


const existing = await db.query.habitCompletions.findFirst({
  where: and(
    eq(habitCompletions.habitId, habitId),
    eq(habitCompletions.date, today)
  )
});



    if (existing) {
      return NextResponse.json({
        success: false,
        message: "Habit already marked complete for today",
      }, { status: 400 });
    }

    await db.insert(habitCompletions).values({
      habitId,
      date: today
    });

    // Fetch completions ordered by date desc
    const completions = await db.query.habitCompletions.findMany({
      where: eq(habitCompletions.habitId, habitId),
      orderBy: desc(habitCompletions.date)
    });

    // Calculate streaks
    let currentStreak = 0;
    let longestStreak = 0;
    let streak = 0;
    let prevDate = null;

    for (const completion of completions) {
      const date = new Date(completion.date);
      if (!prevDate) {
        streak = 1;
      } else {
        const diffDays = Math.floor((prevDate - date) / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          streak++;
        } else if (diffDays === 0) {
          continue;
        } else {
          break;
        }
      }
      prevDate = date;
    }

    currentStreak = streak;
    longestStreak = Math.max(...getStreaks(completions));

    // Update habit
    await db.update(habits)
      .set({
        currentStreak,
        longestStreak,
        updatedAt: new Date()
      })
      .where(eq(habits.id, habitId));

    return NextResponse.json({
      success: true,
      message: "Habit marked complete and streak updated",
      data: { currentStreak, longestStreak }
    });

  } catch (err) {
    console.error(err);
    return NextResponse.json({
      success: false,
      message: "Internal server error",
    }, { status: 500 });
  }
}

// helper
function getStreaks(completions) {
  let streaks = [];
  let streak = 0;
  let prevDate = null;

  for (const c of completions) {
    const date = new Date(c.date);
    if (!prevDate) {
      streak = 1;
    } else {
      const diffDays = Math.floor((prevDate - date) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        streak++;
      } else if (diffDays === 0) {
        continue;
      } else {
        streaks.push(streak);
        streak = 1;
      }
    }
    prevDate = date;
  }

  if (streak > 0) streaks.push(streak);
  return streaks;
}
