import { db } from "@/configs";
import { habits } from "@/configs/schema";
import { NextResponse } from "next/server";



export async function POST(req) {
  try {
    const { userId, name } = await req.json();

    if (!userId || !name) {
      return NextResponse.json({
        success: false,
        message: "userId and habit name are required",
      }, { status: 400 });
    }

    // Create habit
    const [habit] = await db.insert(habits)
      .values({
        userId,
        name,
        currentStreak: 0,
        longestStreak: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return NextResponse.json({
      success: true,
      message: "Habit created successfully",
      data: habit,
    }, { status: 201 });

  } catch (error) {
    console.error("Error creating habit:", error);
    return NextResponse.json({
      success: false,
      message: "Internal server error",
    }, { status: 500 });
  }
}
