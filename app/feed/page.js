"use client";
import { signOut, useSession } from "next-auth/react";
import TopMenu from "@/components/TopMenu";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Review from "@/components/ui/review";
import { ReceiptCent, Star } from "lucide-react";

export default function Home() {
  const { data: session, status } = useSession();
  const [recipes, setRecipes] = useState([]);
  const [users, setUsers] = useState([]);
  const [showReviews, setShowReviews] = useState(false);

  const router = useRouter();
  const recipeRefs = useRef([]);

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

  useEffect(() => {
    const updateReviewsHeight = () => {
      recipeRefs.current.forEach((ref) => {
        if (ref) {
          const recipeInfoHeight =
            ref.querySelector(".recipe-info").offsetHeight;
          const reviewsSection = ref.querySelector(".reviews-section");
          reviewsSection.style.maxHeight = `${recipeInfoHeight}px`;
        }
      });
    };

    updateReviewsHeight();
    window.addEventListener("resize", updateReviewsHeight);

    return () => window.removeEventListener("resize", updateReviewsHeight);
  }, [recipes]);

  const handleRedirect = () => {
    router.push("/create/recipe");
  };

  const handleRedirectToReview = (id) => {
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
    <div className="min-h-screen bg-gray-100 p-6">
      <TopMenu />
      <h1 className="text-3xl font-bold mb-6 text-center">Recipe Feed</h1>
      <button
        className="p-2 bg-blue-500 text-white rounded-lg mb-6 hover:bg-blue-600 transition"
        onClick={handleRedirect}
      >
        Create Recipe
      </button>
      <div className="flex flex-col space-y-4">
        {recipes.map((recipe, index) => (
          <div
            key={recipe._id}
            className="bg-white p-6 rounded-lg shadow-lg text-slate-800 flex"
            ref={(el) => (recipeRefs.current[index] = el)}
          >
            <div className="flex-1 overflow-hidden pr-4 recipe-info">
              <h1 className="text-green-500 text-xl font-semibold">
                {recipe.recipe_title}
                <button
                  className="bg-green-500 text-white p-1 rounded-lg ml-4 hover:bg-green-600 transition"
                  onClick={() => handleRedirectToReview(recipe._id)}
                >
                  Write a Review
                </button>
              </h1>
              <p>
                <strong>Description:</strong> {recipe.brief_description}
              </p>
              <p>
                <strong>Ingredients:</strong> {recipe.ingredients}
              </p>
              <p>
                <strong>Preparation:</strong> {recipe.preparation}
              </p>
              <hr className="my-4" />
              <h1 className="text-green-500">Uploaded by</h1>
              <p>{recipe.userDetails[0]?.username}</p>
            </div>

            <div className="w-1/3 ml-4 flex flex-col reviews-section overflow-y-auto hide-scrollbar">
              <h1 className="text-green-500 mb-2">Reviews</h1>
              <div className="flex-1">
                {recipe.reviews.length > 0 ? (
                  recipe.reviews.map((review, reviewIndex) => (
                    <div
                      key={review._id}
                      className={`p-2 mb-2 bg-gray-50 rounded-md border border-gray-200 ${
                        reviewIndex < 3 ? "" : "hidden"
                      }`}
                    >
                      <p>
                        <strong>Review:</strong> {review.review_description}
                      </p>
                      <p>
                        <strong>Rating:</strong> {review.rating}
                      </p>
                    </div>
                  ))
                ) : (
                  <p>No reviews available for this recipe.</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={() => signOut({ callbackUrl: "http://localhost:3000/login" })}
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4 transition"
      >
        Sign Out
      </button>

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .reviews-section {
          overflow-y: auto;
          max-height: 300px; /* Can be adjusted based on design */
        }
      `}</style>
    </div>
  );
}
