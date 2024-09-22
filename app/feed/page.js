"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import TopMenu from "@/components/TopMenu";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Review from "@/components/ui/review";
import { ReceiptCent, Star } from "lucide-react";

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

  const handleDeleteReview = (reviewId) => {
    setRecipes((prevRecipes) =>
      prevRecipes.map((recipe) => ({
        ...recipe,
        reviews: recipe.reviews.filter((review) => review._id !== reviewId),
      }))
    );
  };

  console.log(recipes);

  return (
    <div className="w-full">
      <TopMenu />
      <h1>Feed Page</h1>
      <button className="p-2 bg-slate-300 rounded-lg" onClick={handleRedirect}>
        Create Recipe
      </button>
      <div>
        {recipes.map((recipe) => {
          // State to manage visibility of reviews for this specific recipe
          const [showReviews, setShowReviews] = useState(false);

          return (
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
              <p>Title: {recipe.title}</p>
              <p>Desc: {recipe.description}</p>
              <p>Ingredients: {recipe.ingredients}</p>
              <p>Preparations: {recipe.preparation}</p>
              <hr />
              <p className="text-green-500">
                Uploaded by{" "}
                <span className="text-slate-800">
                  {recipe.userDetails?.username}
                </span>
              </p>
              <hr />

              <div className="py-3">
                <button
                  className="bg-teal-500 text-slate-200 rounded flex items-center py-1 px-2"
                  onClick={() => setShowReviews(!showReviews)}
                >
                  Reviews <Star className="h-5 w-5 text-yellow-500 fill-yellow-500 ml-1" />
                </button>
              </div>

              {showReviews && (
                <div>
                  {recipe?.reviews?.length > 0 ? (
                    recipe?.reviews?.map((review) => (
                      <Review
                        key={review._id}
                        title={review.review_title}
                        description={review.review_description}
                        rating={review.rating}
                        date={new Date(review.createdAt).toLocaleDateString()}
                        reviewId={review._id} // Pass the review ID
                        reviewUsers={review?.userDetails}
                        review_id={review._id}
                        loginSession={session}
                        onDelete={handleDeleteReview}
                      />
                    ))
                  ) : (
                    <p className="text-slate-800">No reviews yet</p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <button
        onClick={() => signOut({ callbackUrl: "http://localhost:3000/login" })}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      />
    </div>
  );
}
