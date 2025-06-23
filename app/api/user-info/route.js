import { NextResponse } from "next/server"
import { dbConnect } from "../../db/dbConnect"
import User from "../../config/Users"

export async function POST(req) {
  try {
    const { name, email, imageUrl } = await req.json()


    if (!email) {
      return NextResponse.json(
        {
          success: false,
          message: "Email is required",
        },
        { status: 400 },
      )
    }

    await dbConnect()

    const user = await User.findOne({ email })
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 },
      )
    }


    if (name) user.name = name
    if (imageUrl) user.imageUrl = imageUrl

    await user.save()

    return NextResponse.json(
      {
        success: true,
        message: "User info updated successfully!",
        data: user,
      },
      { status: 200 }, 
    )
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 },
    )
  }
}
