import dbConnect from "@/lib/db";
import Recipe from "@/models/recipe";
import { NextResponse } from "next/server";


export const GET = async (request) => {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return new NextResponse(
        JSON.stringify({ message: "User ID is required" }),
        { status: 400 }
      );
    }

    const recipes = await Recipe.find({ user_id: userId });
    return new NextResponse(JSON.stringify(recipes), { status: 200 });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ message: "Error in fetching recipes: " + error.message }),
      { status: 500 }
    );
  }
};


export const POST = async (request) => {
  try {
    await dbConnect();

    const body = await request.json(); 
    const newRecipe = new Recipe(body); 
    await newRecipe.save(); 

    return new NextResponse(JSON.stringify(newRecipe), { status: 201 });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ message: "Error creating recipe: " + error.message }),
      { status: 500 }
    );
  }
};
