import dbConnect from "@/lib/db"; 
import Recipe from "@/models/recipe";
import { NextResponse } from "next/server";


export const PUT = async (request, { params }) => {
  try {
    await dbConnect();
    const body = await request.json();
    const updatedRecipe = await Recipe.findByIdAndUpdate(params.id, body, {
      new: true,
    });

    if (!updatedRecipe) {
      return new NextResponse(
        JSON.stringify({ message: "Recipe not found" }),
        { status: 404 }
      );
    }

    return new NextResponse(JSON.stringify(updatedRecipe), { status: 200 });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ message: "Error updating recipe: " + error.message }),
      { status: 500 }
    );
  }
};


export const DELETE = async (request, { params }) => {
  try {
    await dbConnect();
    const deletedRecipe = await Recipe.findByIdAndDelete(params.id);

    if (!deletedRecipe) {
      return new NextResponse(
        JSON.stringify({ message: "Recipe not found" }),
        { status: 404 }
      );
    }

    return new NextResponse(
      JSON.stringify({ message: "Recipe deleted successfully" }),
      { status: 200 }
    );
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ message: "Error deleting recipe: " + error.message }),
      { status: 500 }
    );
  }
};


export const GET = async (request, { params }) => {
  try {
    await dbConnect();
    const recipe = await Recipe.findById(params.id);

    if (!recipe) {
      return new NextResponse(
        JSON.stringify({ message: "Recipe not found" }),
        { status: 404 }
      );
    }

    return new NextResponse(JSON.stringify(recipe), { status: 200 });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ message: "Error fetching recipe: " + error.message }),
      { status: 500 }
    );
  }
};
