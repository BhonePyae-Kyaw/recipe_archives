"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import TopMenu from "@/components/TopMenu";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Review from "@/components/ui/review";

export default function Home() {
  const { data: session, status } = useSession();
  const [recipes, setRecipes] = useState([]);
  const [users, setUsers] = useState([]);

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

  const getUsers = async () => {
    const response = await fetch("/api/users", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const data = await response.json();
      setUsers(data);
    } else {
      console.error("Error fetching users:", response.statusText);
    }
  };

  useEffect(() => {
    getRecipes();
    getUsers();
  }, []);

  const handleRedirect = () => {
    console.log("Redirecting to create recipe page");
    router.push("/create/recipe");
  };

  const handleRedirectToReview = (id) => {
    console.log("Redirecting to review recipe page");
    router.push(`create/review/${id}`);
  };

  useEffect(() => {
    console.log("Fetched Users:", users); // Log the user data
  }, [users]);

  const findUsernameById = (userId) => {
    console.log("Looking for user with ID:", userId); // Log the user ID you're looking for
    const user = users.find((user) => user._id === userId); // Match with user._id
    console.log("Found user:", user); // Log the found user (or undefined)
    return user ? user.username : "Unknown User";
  };

  const handleDeleteReview = (reviewId) => {
    // Update the recipes state to remove the deleted review
    setRecipes((prevRecipes) =>
      prevRecipes.map((recipe) => ({
        ...recipe,
        reviews: recipe.reviews.filter((review) => review._id !== reviewId),
      }))
    );
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
            <p>Title: {recipe.recipe_title}</p>
            <p>Desc: {recipe.brief_description}</p>
            <p>Ingredients: {recipe.ingredients}</p>
            <p>Preparations: {recipe.preparation}</p>
            <hr />
            <h1 className="text-green-500">Uploaded by</h1>
            <p>{recipe.userDetails[0].username}</p>
            <hr />
            <h1 className="text-green-500 text-2xl">Reviews</h1>
            {recipe.reviews.map((review) => (
              <Review
                key={review._id}
                title={review.review_title}
                description={review.review_description}
                rating={review.rating}
                username={findUsernameById(review.userId)}
                date={new Date(review.createdAt).toLocaleDateString()}
                reviewId={review._id} // Pass the review ID
                onDelete={handleDeleteReview} // Pass the delete function
              />
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
