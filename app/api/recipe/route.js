import dbConnect from "@/lib/db";
import Recipe from "@/models/recipe";
import { NextResponse } from "next/server";

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
