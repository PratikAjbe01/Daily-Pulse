import { db } from "@/configs";
import { habits, users, habitCompletions } from "@/configs/schema";
import { eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";

export async function POST( req) {
  try {
    const { userId } = await req.json();
    
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Missing userId" }, 
        { status: 400 }
      );
    }

    const today = new Date().toISOString().split('T')[0];

    // 1. Get all user habits
    const userHabits = await db
      .select()
      .from(habits)
      .where(eq(habits.userId, userId));

    if (userHabits.length === 0) {
      return NextResponse.json(
        { success: false, message: "No habits found" }
      );
    }

    // 2. Check if all habits have completions for today
    const allCompleted = await Promise.all(
      userHabits.map(async (habit) => {
        const completion = await db
          .select()
          .from(habitCompletions)
          .where(
            and(
              eq(habitCompletions.habitId, habit.id),
              eq(habitCompletions.date, today)
            )
          );
        return completion.length > 0;
      })
    ).then(results => results.every(Boolean));

    if (!allCompleted) {
      return NextResponse.json(
        { success: false, message: "Not all habits completed today" }
      );
    }

    // 3. Increment trophy count if all completed
    const updatedUser = await db
      .update(users)
      .set({
        trophyCount: sql`${users.trophyCount} + 1`,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId))
      .returning();

    return NextResponse.json({ 
      success: true, 
      message: "Trophy awarded!",
      trophyCount: updatedUser[0].trophyCount
    });

  } catch (err) {
    console.error("Error in increment-trophy:", err);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}