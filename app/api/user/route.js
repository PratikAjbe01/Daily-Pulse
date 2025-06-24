
import { db } from '@/configs'
import { users } from '@/configs/schema'

import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export async function POST(req) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json({ error: 'Missing email' }, { status: 400 })
    }

    const existing = await db.select().from(users).where(eq(users.email, email))

    if (existing.length === 0) {
      await db.insert(users).values({ email, credit: 5 })
    }

    const user = await db.select().from(users).where(eq(users.email, email))

    return NextResponse.json(user[0])
  } catch (error) {
    console.error('DB sync error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}