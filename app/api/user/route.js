import { NextResponse } from 'next/server';
import { dbConnect } from '../../db/dbConnect';
import User from '../../config/Users';

export async function POST(req) {
  try {

    const { name, email } = await req.json();

 
    await dbConnect();

  
    const user = await User.findOne({ email });
    if (user) {
      return NextResponse.json(
        {
          success: false,
          message: 'User already present with this email',
        },
        { status: 400 }
      );
    }


    const newUser = new User({ name, email });
    await newUser.save();

    return NextResponse.json(
      {
        success: true,
        message: 'User successfully created!',
        data: {
          id: newUser._id,
          fullName: newUser.name,
          email: newUser.email,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Internal Server Error',
      },
      { status: 500 }
    );
  }
}
