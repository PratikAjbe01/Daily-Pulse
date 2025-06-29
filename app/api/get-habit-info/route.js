import { NextResponse } from "next/server";


import { and, eq } from "drizzle-orm";
import { db } from "@/configs";
import { habits, users } from "@/configs/schema";

export async function POST(request) {
  try {
      const { habitId, userId } = await request.json();

    if (!habitId) {
      return NextResponse.json(
        {
          success: false,
          message: "habitid is required",
        },
        { status: 400 }
      );
    }
     if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "habitid is required",
        },
        { status: 400 }
      );
    }

   
    const foundHabit = await db
      .select()
      .from(habits)
      .where(and(eq(habits.id, habitId), eq(habits.userId, userId)));

    if (foundHabit.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "hait not not found",
        },
        { status: 404 }
      );
    }

    const habit = foundHabit[0];
   
    return NextResponse.json(
      {
        success: true,
        message: "Habit info fetched successfully!",
        data: {
       habit
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error finding habit:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
