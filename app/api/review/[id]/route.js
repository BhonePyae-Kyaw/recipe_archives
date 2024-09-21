import dbConnect from "@/lib/db";
import Review from "@/models/review";
import { NextResponse } from "next/server";

export const DELETE = async (req) => {
  const { id } = req.query;

  try {
    await dbConnect();
    const deletedReview = await Review.findByIdAndDelete(id);

    if (!deletedReview) {
      return NextResponse.json({ message: "Review not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Review deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error deleting review: " + error.message }, { status: 500 });
  }
};
// edit

// delete
