import { NextResponse } from "next/server";
import User from "@/lib/models/users";
import connect from "@/lib/db";
import { Types } from "mongoose"



const ObjectId = require("mongoose").Types.ObjectId;

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



export const PATCH = async (request: Request) => {
  try {
    const body = await request.json();
    const { userId, newUserName } = body;
    await connect();

    if (!userId || !newUserName) {
      return new NextResponse(JSON.stringify({ message: "Invalid Request" }), { status: 400 })
    }

    if (!Types.ObjectId.isValid(userId)) {
      return new NextResponse(JSON.stringify({ message: "Invalid User Id" }), { status: 400 })

    }
    const updateUser = await User.findOneAndUpdate({
      _id: new ObjectId(userId)
    },
      {
        Username: newUserName
      },

      {
        new: true

      })


    if (!updateUser) {
      return new NextResponse(JSON.stringify({ message: "User not updated" }), { status: 404 })

    }
    return new NextResponse(JSON.stringify({ message: "User Updated" }), { status: 200 })
  }
  catch (error: any) {
    return new NextResponse("Error: " + error.message, { status: 500 });
  }
}

export const PUT = async (request: Request) => {
  try {
    const body = await request.json();
    const { userId, newUserName, newEmail, newAge } = body;  // Example of more user fields
    await connect();

    if (!userId || !newUserName || !newEmail || !newAge) {  // Ensure all fields are included
      return new NextResponse(JSON.stringify({ message: "Invalid Request" }), { status: 400 });
    }

    if (!Types.ObjectId.isValid(userId)) {
      return new NextResponse(JSON.stringify({ message: "Invalid User Id" }), { status: 400 });
    }

    // Find and replace the user document entirely
    const updatedUser = await User.findOneAndUpdate(
      { _id: new ObjectId(userId) },
      {
        Username: newUserName,
        Email: newEmail,
        Age: newAge,
      },
      {
        new: true,  // Return the updated document
        overwrite: true,  // Replace the entire document
      }
    );

    if (!updatedUser) {
      return new NextResponse(JSON.stringify({ message: "User not updated" }), { status: 404 });
    }

    return new NextResponse(JSON.stringify({ message: "User Updated" }), { status: 200 });
  } catch (error: any) {
    return new NextResponse("Error: " + error.message, { status: 500 });
  }
};


export const DELETE = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    if (!userId) {
      return new NextResponse(JSON.stringify({ message: "Invalid Request" }), { status: 400 })
    }
    await connect();
    const deletedUser = await User.findByIdAndDelete(new Types.ObjectId(userId));
    if (!deletedUser) {
      return new NextResponse(JSON.stringify({ message: "User not deleted" }), { status: 404 })
    }
    return new NextResponse(JSON.stringify({ message: "User Deleted" }), { status: 200 });
  }
  catch (error: any) {
    return new NextResponse("Error: " + error.message, { status: 500 });
  }
}

