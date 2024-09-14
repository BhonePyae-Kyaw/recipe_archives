import dbConnect from "@/lib/db"; // Database connection
import Recipe from "@/models/recipe"; // Recipe model
import { NextResponse } from "next/server"; // NextResponse

export const GET = async () => {
  try {
    await dbConnect();
    const recipes = await Recipe.find();
    return new NextResponse(JSON.stringify(recipes), { status: 200 });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ message: "Error in fetching recipes " + error.message }),
      { status: 500 }
    );
  }
};

// POST request to create a new recipe
