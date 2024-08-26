import { NextResponse } from "next/server";
import User from "@/lib/models/users";
import connect from "@/lib/db";

export const GET = async () => {
  try {
    await connect();
    const users = await User.find();
    return new NextResponse(JSON.stringify(users), { status: 200 });
  } catch (error: any) {
    return new NextResponse("Error: " + error.message, { status: 500 });
  }
};

export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    await connect();
    const newUser = new User(body);
    await newUser.save();
    return new NextResponse(JSON.stringify({ message: "User is created", user: newUser }), { status: 201 });
  } catch (error: any) {
    return new NextResponse("Error in creating new user: " + error.message, { status: 500 });
  }
};
