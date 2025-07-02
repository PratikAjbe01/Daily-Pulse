import { db } from "@/configs";
import { users } from "@/configs/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { email, name, imageUrl, fcmToken } = await req.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 }
      );
    }

    // Build updateData dynamically to avoid overwriting fields with null
    const updateData = {
      updatedAt: new Date()
    };

    if (typeof name === "string" && name.trim() !== "") {
      updateData.name = name.trim();
    }

    if (typeof imageUrl === "string" && imageUrl.trim() !== "") {
      updateData.imageUrl = imageUrl.trim();
    }

    if (typeof fcmToken === "string" && fcmToken.trim() !== "") {
      updateData.fcmToken = fcmToken.trim();
    }

    // Don't run an empty update
    if (Object.keys(updateData).length === 1) {
      return NextResponse.json(
        { success: false, message: "No valid fields to update" },
        { status: 400 }
      );
    }

    const updatedUser = await db
      .update(users)
      .set(updateData)
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
