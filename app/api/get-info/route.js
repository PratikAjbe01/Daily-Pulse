// /app/api/user-info/route.js (or .ts)

import { NextResponse } from "next/server";
import { users } from "@/configs/schema";

import { eq } from "drizzle-orm";
import { db } from "@/configs";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json({ error: "Email required" }, { status: 400 });
  }

  try {
    const userRecord = await db.query.users.findFirst({
      where: eq(users.email, email)
    });

    if (!userRecord) {
      return NextResponse.json(null, { status: 200 });
    }

    return NextResponse.json({
        id: userRecord.id,  
      name: userRecord.name,
      imageUrl: userRecord.imageUrl
    }, { status: 200 });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
