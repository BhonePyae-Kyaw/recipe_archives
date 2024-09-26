"use client";
import TopMenu from "@/components/TopMenu";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { CldImage } from "next-cloudinary";

export default function RecipePage({ params }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [recipe, setRecipe] = useState(null); // Store recipe data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE}/recipe/${params.id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch recipe data");
        }

        const data = await response.json(); // Parse recipe data
        setRecipe(data); // Set the recipe state
      } catch (error) {
        setError(error.message); // Handle any error
      } finally {
        setLoading(false); // End loading state
      }
    };

    fetchRecipe(); // Fetch recipe on page load
  }, [params.id]);

  if (loading) return <div>Loading...</div>; // Display loading state
  if (error) return <div>Error: {error}</div>; // Display error message
  if (!recipe) return <div>No recipe found.</div>; // If no recipe is available

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <TopMenu />
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold mb-4">{recipe.recipe_title}</h1>
        <div>
          <CldImage
            src={
              recipe.recipe_picture != ""
                ? recipe.recipe_picture
                : "https://res-console.cloudinary.com/dr22j6tar/media_explorer_thumbnails/0e3bdaec01c04842bb461d16525866ef/detailed"
            }
            alt="recipe picture"
            width="500"
            height="500"
            className="rounded-lg w-full max-w-[500px] max-h-[500px] object-cover object-center mb-4 mt-2"
          />
        </div>
        <p className="text-gray-700 mb-4">{recipe.brief_description}</p>

        <div className="flex space-x-4 mb-4">
          <div>
            <strong>Preparation Time:</strong> {recipe.preparation_time} mins
          </div>
          <div>
            <strong>Cooking Time:</strong> {recipe.cooking_time} mins
          </div>
        </div>

        <div className="mb-4">
          <h2 className="text-xl font-semibold">Ingredients</h2>
          <ul className="list-disc list-inside">
            {recipe.ingredients.split(",").map((ingredient, index) => (
              <li key={index}>{ingredient.trim()}</li>
            ))}
          </ul>
        </div>

        <div className="mb-4">
          <h2 className="text-xl font-semibold">Preparation Steps</h2>
          <ol className="list-decimal list-inside">
            {recipe.preparation.split(",").map((step, index) => (
              <li key={index}>{step.trim()}</li>
            ))}
          </ol>
        </div>

        <div className="mt-6">
          {/* <button
            onClick={() => router.push(`/edit/recipe/${params.id}`)}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
          >
            Edit Recipe
          </button> */}

          <button
            onClick={() => router.back()}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          >
            Return Back
          </button>
        </div>
      </div>
    </div>
  );
}
