import { NextResponse } from "next/server";
import { db } from "@/configs";
import { habitCompletions } from "@/configs/schema";
import { eq } from "drizzle-orm";

export async function POST(request) {
  try {
    const { habitId } = await request.json();

    if (!habitId) {
      return NextResponse.json(
        { success: false, message: "habitId is required" },
        { status: 400 }
      );
    }

    const completions = await db
      .select({ date: habitCompletions.date })
      .from(habitCompletions)
      .where(eq(habitCompletions.habitId, habitId));

    return NextResponse.json({
      success: true,
      message: "Completion dates fetched successfully",
      data: completions.map(c => c.date), 
    });
  } catch (error) {
    console.error("Error fetching completions:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
