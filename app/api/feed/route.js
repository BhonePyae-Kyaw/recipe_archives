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
        $unwind: {
          path: "$reviews", // Unwind the reviews array
          preserveNullAndEmptyArrays: true, // Keep recipes with no reviews
        },
      },
      {
        $lookup: {
          from: "users", // Collection name for users
          localField: "reviews.user_id", // Field in Review schema
          foreignField: "_id", // Field in User schema
          as: "reviews.userDetails", // The field to populate with user details in reviews
          pipeline: [
            {
              $project: {
                password: 0, // Exclude the password field
              },
            },
          ],
        },
      },
      {
        $unwind: {
          path: "$reviews.userDetails", // Unwind user details
          preserveNullAndEmptyArrays: true, // Keep reviews with no user details
        },
      },
      {
        $group: {
          _id: "$_id", // Group by recipe ID
          title: { $first: "$recipe_title" }, // Add other fields from the Recipe schema
          description: { $first: "$brief_description" },
          preparation: { $first: "$preparation" },
          ingredients: { $first: "$ingredients" },
          user_id: { $first: "$user_id" },
          reviews: { $push: "$reviews" }, // Push reviews back into an array
        },
      },
      {
        $addFields: {
          reviews: {
            $filter: {
              input: "$reviews",
              as: "review",
              cond: { $ne: ["$$review", {}] }, // Filter out empty review objects
            },
          },
        },
      },
      {
        $addFields: {
          reviews: { $slice: ["$reviews", 3] }, // Limit reviews to 3
        },
      },
      {
        $lookup: {
          from: "users", // Collection name for users
          localField: "user_id", // Field in Recipe schema
          foreignField: "_id", // Field in User schema
          as: "userDetails", // The field to populate with user details for the recipe
          pipeline: [
            {
              $project: {
                password: 0, // Exclude the password field
              },
            },
          ],
        },
      },
      {
        $unwind: {
          path: "$userDetails", // Unwind user details for the recipe author
          preserveNullAndEmptyArrays: true, // Keep recipes with no user details
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
