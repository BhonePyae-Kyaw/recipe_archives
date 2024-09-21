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

export const POST = async (req) => {
  try {
    await dbConnect();
    
    // Log the body to ensure correct data is coming through
    const body = await req.json(); // Ensure you're correctly parsing the JSON body
    console.log("Request body:", body);

    const review = await Review.create(body); // Creating the review
    return new NextResponse(JSON.stringify(review), { status: 201 });
  } catch (error) {
    console.error("Error creating review:", error);
    return new NextResponse(
      JSON.stringify({ message: "Error in creating review: " + error.message }),
      { status: 500 }
    );
  }
};
// POST request to create a new review

// get by user id - get all reviews by user id
