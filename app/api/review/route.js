import dbConnect from "@/lib/db";
import Review from "@/models/review";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    await dbConnect();
    const reviews = await Review.find();
    return new NextResponse(JSON.stringify(reviews), { status: 200 });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ message: "Error in fetching reviews " + error.message }),
      { status: 500 }
    );
  }
};

// POST request to create a new review

// get by user id - get all reviews by user id
