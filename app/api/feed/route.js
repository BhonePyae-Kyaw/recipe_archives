import Recipe from "@/models/recipe";
import dbConnect from "@/lib/db";
import { NextResponse } from "next/server";
export const GET = async () => {
  try {
    await dbConnect();

    const recipes = await Recipe.aggregate([
      {
        $lookup: {
          from: "reviews", // Collection name for reviews
          localField: "_id", // Field in Recipe schema
          foreignField: "recipe_id", // Field in Review schema
          as: "reviews", // The field to populate with reviews
        },
      },
      {
        $lookup: {
          from: "users", // Collection name for users
          localField: "user_id", // Field in Recipe schema
          foreignField: "_id", // Field in User schema
          as: "userDetails", // The field to populate with user details
        },
      },
    ]);

    return new NextResponse(JSON.stringify(recipes), { status: 200 });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ message: "Error in fetching recipes " + error.message }),
      { status: 500 }
    );
  }
};
