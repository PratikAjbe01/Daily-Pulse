import { NextResponse } from "next/server";
import { db } from "@/configs";
import { habitCompletions, habits } from "@/configs/schema";
import { and, desc, eq } from "drizzle-orm";

export async function POST(req) {
  try {
    const { habitId } = await req.json();
    if (!habitId) return NextResponse.json({ success: false, message: "habitId required" }, { status: 400 });

    const today = new Date().toISOString().slice(0, 10);

    const existing = await db.query.habitCompletions.findFirst({
      where: and(
        eq(habitCompletions.habitId, habitId),
        eq(habitCompletions.date, today),
      ),
    });
    if (existing) return NextResponse.json({ success: false, message: "Already marked today" }, { status: 400 });

    await db.insert(habitCompletions).values({ habitId, date: today });

    const completions = await db.query.habitCompletions.findMany({
      where: eq(habitCompletions.habitId, habitId),
      orderBy: desc(habitCompletions.date),
    });

    const { currentStreak, longestStreak } = computeStreaks(completions);

    await db.update(habits)
      .set({ currentStreak, longestStreak, updatedAt: new Date() })
      .where(eq(habits.id, habitId));

    return NextResponse.json({ success: true, data: { currentStreak, longestStreak } });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

// function computeStreaks(completions) {
//   let currentStreak = 0;
//   let longestStreak = 0;
//   let running = 0;
//   let prev = null;

//   for (const { date: d } of completions) {
//     const date = new Date(d);
//     if (!prev) {
//       running = 1;
//     } else {
//       const diff = Math.round((prev - date) / (1000 * 60 * 60 * 24));
//       if (diff === 1) {
//         running += 1;
//       } else if (diff === 0) {
//         continue; // same day duplicates
//       } else {
//         if (running > longestStreak) longestStreak = running;
//         running = 1;
//       }
//     }
//     prev = date;
//   }

//   if (running > longestStreak) longestStreak = running;

//   currentStreak = completions.length > 0 && Math.round((new Date() - new Date(completions[0].date)) / (1000 * 60 * 60 * 24)) === 0
//     ? running
//     : 0;

//   return { currentStreak, longestStreak };
// }
function computeStreaks(completions) {
  if (!completions.length) return { currentStreak: 0, longestStreak: 0 };

  // Sort in ascending order
  const sorted = [...completions].sort((a, b) => new Date(a.date) - new Date(b.date));

  let currentStreak = 1;
  let longestStreak = 1;

  let streak = 1;

  for (let i = 1; i < sorted.length; i++) {
    const prevDate = new Date(sorted[i - 1].date);
    const currDate = new Date(sorted[i].date);

    const diffDays = Math.round((currDate - prevDate) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      streak += 1;
    } else if (diffDays === 0) {
      continue; // same-day duplicate
    } else {
      streak = 1; // streak broken
    }

    if (streak > longestStreak) {
      longestStreak = streak;
    }
  }

  
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let tempStreak = 0;

  for (let i = sorted.length - 1; i >= 0; i--) {
    const date = new Date(sorted[i].date);
    date.setHours(0, 0, 0, 0);

    const expected = new Date(today);
    expected.setDate(expected.getDate() - tempStreak);

    if (date.getTime() === expected.getTime()) {
      tempStreak += 1;
    } else {
      break;
    }
  }

  currentStreak = tempStreak;
  currentStreak;

  return { currentStreak, longestStreak };
}
