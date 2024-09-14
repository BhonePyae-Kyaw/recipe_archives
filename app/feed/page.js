"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import TopMenu from "@/components/TopMenu";
import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import { useRouter } from "next/navigation";
export default function Home() {
  const { data: session, status } = useSession();
  const [recipes, setRecipes] = useState([]);
  const router = useRouter();

  const getRecipes = async () => {
    const response = await fetch("/api/feed", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const data = await response.json();
      setRecipes(data);
    } else {
      console.error("Error fetching recipes:", response.statusText);
    }
  };

  useEffect(() => {
    getRecipes();
  }, []);

  const handleRedirect = () => {
    console.log("Redirecting to create recipe page");
    router.push("/create/recipe");
  };

  const handleRedirectToReview = (id) => {
    console.log("Redirecting to review recipe page");
    router.push(`create/review/${id}`);
  };

  console.log("Recipes:", recipes);
  return (
    <div className="w-full">
      <TopMenu />
      <h1>Feed Page</h1>
      <button className="p-2 bg-slate-300 rounded-lg" onClick={handleRedirect}>
        Create Recipe
      </button>
      <div>
        {recipes.map((recipe) => (
          <div
            key={recipe._id}
            className="bg-white p-12 rounded-lg shadow-md m-4 text-slate-800"
          >
            <hr />
            <h1 className="text-green-500">
              Recipe
              <button
                className="bg-gray-300 p-2 rounded-lg m-4 text-slate-800"
                onClick={() => handleRedirectToReview(recipe._id)}
              >
                Review Recipe
              </button>
            </h1>
            <p>title: {recipe.recipe_title}</p>
            <p>Desc: {recipe.brief_description}</p>
            <p>Ingredients{recipe.ingredients}</p>
            <p>preparations: {recipe.preparation}</p>
            <hr />
            <h1 className="text-green-500">Uploaded by</h1>
            <p>{recipe.userDetails[0].username}</p>
            <hr />
            <h1 className="text-green-500">Reviews</h1>
            {recipe.reviews.map((review) => (
              <div key={review._id}>
                <p>{review.review_description}</p>
                <p>Rating: {review.rating}</p>
                <hr />
              </div>
            ))}
          </div>
        ))}
      </div>
      <button
        onClick={() => signOut({ callbackUrl: "http://localhost:3000/login" })}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      />
    </div>
  );
}
