"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from 'next/navigation';
import Review from "@/components/ui/review";
import { CldImage } from "next-cloudinary";
import { useSession } from "next-auth/react";
import TopMenu from "@/components/TopMenu";

export default function ReviewPage() {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const recipeId = searchParams.get('recipeId');
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  const getRecipes = async () => {
    try {
      const response = await fetch("/api/feed", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        // Filter the recipe that matches the recipeId from searchParams
        const foundRecipe = data.find((item) => item._id === recipeId);
        setRecipe(foundRecipe || null);
      } else {
        console.error("Error fetching recipes:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching recipes:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleDeleteReview = (reviewId) => {
    setRecipes((prevRecipes) =>
      prevRecipes.map((recipe) => ({
        ...recipe,
        reviews: recipe.reviews.filter((review) => review._id !== reviewId),
      }))
    );
  };

  useEffect(() => {
    getRecipes();
  }, [recipeId]);

  if (loading) return <p>Loading...</p>;

  if (!recipe) return <p>Recipe not found.</p>;

  return (
    <div className="bg-cyan-100 rounded-xl p-6">
      <TopMenu />
      {/* <h1 className="text-3xl font-bold mb-6 text-center text-cyan-700">Explore Recipes with US!</h1> */}
      <div>
          <div
            key={recipe._id}
            className="bg-white p-6 m-4 rounded-lg shadow-lg text-slate-800 flex"
          >
            <div className="pr-4">
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
                  className="rounded-lg max-w-[500px] max-h-[500px] object-cover object-center mb-4 mt-2"
                />
              </div>
              <h1 className="text-cyan-700 text-2xl font-bold">
                {recipe.title}
                <button
                  className="bg-cyan-700 text-white text-sm p-3 rounded-lg ml-4 mb-2 hover:bg-cyan-500 transition text-xl"
                  onClick={() => handleRedirectToReview(recipe._id)}
                >
                  Write a review
                </button>
              </h1>
              {/* <p>{JSON.stringify(recipe)}</p> */}
              <p className="text-lg mt-2">
                <strong>Description:</strong> {recipe.description}
              </p>
              <p className="text-lg mt-2">
                <strong>Ingredients:</strong> {recipe.ingredients}
              </p>
              <p className="text-lg mt-2">
                <strong>Preparation:</strong> {recipe.preparation}
              </p>
              <hr className="my-4" />
              <h1 className="text-cyan-700 font-medium text-lg">Uploaded by</h1>
              <p>{recipe.userDetails.username}</p>
            </div>

            <div className="ml-4 w-full flex flex-col reviews-section">
              {/* <h1 className="text-cyan-700 mb-2">Reviews</h1> */}
              <hr className="my-4" />
              <div className="flex-1">
                {recipe.reviews.length > 0 ? (
                  recipe.reviews.map((review) => (
                    <Review
                      key={review._id}
                      title={review.review_title}
                      description={review.review_description}
                      rating={review.rating}
                      date={new Date(review.createdAt).toLocaleDateString()}
                      reviewUserName={review?.userDetails.username}
                      reviewUserImage={review?.userDetails.image}
                      reviewUserId={review?.userDetails._id}
                      recipe_id={recipe._id}
                      review_id={review._id}
                      loginSession={session}
                      onDelete={handleDeleteReview}
                      details={false}
                      profile={false}
                    />
                  ))
                ) : (
                  <p>No reviews available for this recipe yet.</p>
                )}
              </div>
            </div>
          </div>
      </div>

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .reviews-section {
        }
      `}</style>
    </div>
  );
}
