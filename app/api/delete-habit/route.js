import { NextResponse } from "next/server";
import { db } from "@/configs";
import { habits, habitCompletions } from "@/configs/schema";
import { and, eq } from "drizzle-orm";

export async function POST(request) {
  try {
    const { habitId, userId } = await request.json();

    // First delete all completions for this habit
    await db
      .delete(habitCompletions)
      .where(eq(habitCompletions.habitId, habitId));

    // Then delete the habit
    const result = await db
      .delete(habits)
      .where(
        and(
          eq(habits.id, habitId),
          eq(habits.userId, userId)
        )
      );

    if (result.rowCount === 0) {
      return NextResponse.json(
        { success: false, message: "Habit not found or not owned by user" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Habit deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting habit:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to delete habit" },
      { status: 500 }
    );
  }
}