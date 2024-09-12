import dbConnect from "@/lib/db";
import User from "@/models/user";
import { NextResponse } from "next/server";
export const GET = async () => {
  try {
    await dbConnect();
    const users = await User.find();
    return new NextResponse(JSON.stringify(users), { status: 200 });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ message: "Error in fetching users " + error.message }),
      { status: 500 }
    );
  }
};

export const PATCH = async (request) => {
  try {
    const body = await request.json();
    await dbConnect();

    const { id, name, email } = body;
    console.log(body);

    // Updating the user using findByIdAndUpdate and returning the updated document
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { username: name, email: email },
      { new: true }
    );
    console.log(updatedUser);
    if (!updatedUser) {
      return new NextResponse(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }

    // Respond with the updated user
    return new NextResponse(JSON.stringify(updatedUser), { status: 200 });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ message: "Error in updating user: " + error.message }),
      { status: 500 }
    );
  }
};

export const DELETE = async (request) => {
  try {
    const body = await request.json();
    await dbConnect();
    const { id } = body;
    console.log(body);
    await User.findByIdAndDelete(id);
    return new NextResponse(JSON.stringify({ message: "User deleted" }), {
      status: 200,
    });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ message: "Error in deleting user " + error.message }),
      { status: 500 }
    );
  }
};
