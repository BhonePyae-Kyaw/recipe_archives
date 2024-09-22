import dbConnect from "@/lib/db";
import Review from "@/models/review";
import { NextResponse } from "next/server";

// DELETE method to remove a review by ID
export const DELETE = async (req) => {
  const url = new URL(req.url);
  const id = url.pathname.split("/").pop();

  try {
    await dbConnect();
    const deletedReview = await Review.findByIdAndDelete(id);

    if (!deletedReview) {
      return NextResponse.json(
        { message: "Review not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Review deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error deleting review: " + error.message },
      { status: 500 }
    );
  }
};

// PATCH method to update a review by ID
export const PATCH = async (req, { params }) => {
  const { id } = params;

  try {
    await dbConnect();

    // Parse the updated review data from the request body
    const updatedReviewData = await req.json();

    // Ensure required fields are present
    if (!updatedReviewData.title || !updatedReviewData.description || !updatedReviewData.rating) {
      return NextResponse.json(
        { message: "Title, description, and rating are required" },
        { status: 400 }
      );
    }

    // Find and update the review by ID
    const updatedReview = await Review.findByIdAndUpdate(
      id,
      { 
        title: updatedReviewData.title,
        description: updatedReviewData.description,
        rating: updatedReviewData.rating 
      },
      {
        new: true, // Return the updated document
        runValidators: true, // Ensure the update follows the schema
      }
    );

    if (!updatedReview) {
      return NextResponse.json(
        { message: "Review not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Review updated successfully", review: updatedReview },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error updating review: " + error.message },
      { status: 500 }
    );
  }
};
