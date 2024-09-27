"use client";
import { useEffect, useState } from "react";
import Review from "@/components/ui/review";
import { CldImage } from "next-cloudinary";
import { useSession } from "next-auth/react";
import TopMenu from "@/components/TopMenu";
import { useRouter } from "next/navigation";

export default function ReviewDetailPage({ params }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { recipeId, reviewId } = params;
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  // Function to fetch the recipe data
  const getRecipes = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/feed`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        // Filter to find the specific recipe using recipeId
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

  // Function to handle review deletion
  const handleDeleteReview = (reviewId) => {
    setRecipe((prevRecipe) => ({
      ...prevRecipe,
      reviews: prevRecipe.reviews.filter((review) => review._id !== reviewId),
    }));
  };

  useEffect(() => {
    getRecipes();
  }, [recipeId]);

  if (loading) return <p>Loading...</p>;

  if (!recipe) return <p>Recipe not found.</p>;

  // Filter the specific review matching the reviewId
  const selectedReview = recipe.reviews.find(
    (review) => review._id === reviewId
  );

  return (
    <div className="bg-slate-100 rounded-xl p-6">
      <TopMenu />
      <div>
        <div
          key={recipe._id}
          className="bg-white p-6 m-4 rounded-lg shadow-lg text-slate-800 flex"
        >
          <div className="pr-4 w-1/2">
            <CldImage
              src={
                recipe.recipe_picture !== ""
                  ? recipe.recipe_picture
                  : "https://res-console.cloudinary.com/dr22j6tar/media_explorer_thumbnails/0e3bdaec01c04842bb461d16525866ef/detailed"
              }
              alt="recipe picture"
              width="500"
              height="500"
              className="rounded-lg max-w-[500px] max-h-[500px] object-cover object-center mb-4 mt-2"
            />
            <h1 className="text-cyan-700 text-2xl font-bold">
              {recipe.title}
              {/* <button
                className="bg-cyan-700 text-white text-sm p-3 rounded-lg ml-4 mb-2 hover:bg-cyan-500 transition text-xl"
                onClick={() => handleRedirectToReview(recipe._id)}
              >
                Write a review
              </button> */}
            </h1>
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
            <hr className="my-4" />
            <div className="flex-1">
              {selectedReview ? (
                <Review
                  key={selectedReview._id}
                  title={selectedReview.review_title}
                  description={selectedReview.review_description}
                  rating={selectedReview.rating}
                  date={new Date(selectedReview.createdAt).toLocaleDateString()}
                  reviewUserName={selectedReview?.userDetails.username}
                  reviewUserImage={selectedReview?.userDetails.ProfilePicture}
                  reviewUserId={selectedReview?.userDetails._id}
                  recipe_id={recipe._id}
                  review_id={selectedReview._id}
                  loginSession={session}
                  onDelete={handleDeleteReview}
                  details={true}
                  profile={false}
                />
              ) : (
                <p>No review found with the provided ID.</p>
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
