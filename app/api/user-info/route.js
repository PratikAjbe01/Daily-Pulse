// /app/api/user-info/route.ts
import { db } from "@/configs";
import { users } from "@/configs/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { email, name, imageUrl } = await req.json();
    
    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 }
      );
    }

    // Update user info
    const updatedUser = await db
      .update(users)
      .set({
        name: name || null,
        imageUrl: imageUrl || null,
        updatedAt: new Date()
      })
      .where(eq(users.email, email))
      .returning();

    if (updatedUser.length === 0) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "User info updated successfully",
      data: updatedUser[0]
    });

  } catch (error) {
    console.error("Error updating user info:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}