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
