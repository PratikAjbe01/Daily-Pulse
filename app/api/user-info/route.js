import { NextResponse } from "next/server";


import { eq } from "drizzle-orm";
import { db } from "@/configs";
import { users } from "@/configs/schema";

export async function POST(req) {
  try {
    const { username, email, imageUrl } = await req.json();

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          message: "Email is required",
        },
        { status: 400 }
      );
    }

    // Find user by email
    const foundUsers = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (foundUsers.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    const user = foundUsers[0];

    // Update fields
    await db
      .update(users)
      .set({
        ...(username && {  name: username }),
        ...(imageUrl && { imageUrl }),
        updatedAt: new Date(),
      })
      .where(eq(users.email, email));

    return NextResponse.json(
      {
        success: true,
        message: "User info updated successfully!",
        data: {
          ...user,
          name: username ?? user.name,
          imageUrl: imageUrl ?? user.imageUrl,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
