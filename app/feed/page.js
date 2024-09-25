"use client";
import { signOut, useSession } from "next-auth/react";
import TopMenu from "@/components/TopMenu";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { ReceiptCent, Star } from "lucide-react";
import Review from "@/components/ui/review";
import { CldImage } from "next-cloudinary";
// import { ReceiptCent, Star } from "lucide-react";

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

  // console.log(recipes.userid,session.user.userid,"equal?");

  return (
    <div className="bg-gray-100 p-6">
      <TopMenu />
      <h1 className="text-3xl font-bold mb-6 text-center">Explore Recipes!</h1>
      <button
        className="p-2 bg-cyan-700 text-white rounded-lg mb-6 hover:bg-cyan-500 transition"
        onClick={handleRedirect}
      >
        Create Recipe
      </button>
      <div>
        {recipes.map((recipe, index) => (
          <div
            key={recipe._id}
            className="bg-white p-6 m-4 rounded-lg shadow-lg text-slate-800 flex"
            ref={(el) => (recipeRefs.current[index] = el)}
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
                {recipe.user_id !== session.user.id && ( // Show button only if the user IDs are not equal
                  <button
                    className="bg-cyan-700 text-white text-sm p-3 rounded-lg ml-4 mb-2 hover:bg-cyan-500 transition text-xl"
                    onClick={() => handleRedirectToReview(recipe._id)}
                  >
                    Write a review
                  </button>
                )}
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
              <div className="pr-2 w-full flex flex-col reviews-section">
                <hr className="my-4 " />
                <div className="flex-1">
                  {recipe.reviews.length > 0 ? (
                    // Limit displayed reviews to the first 3 using slice
                    recipe.reviews.slice(0, 3).map((review) => (
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
                  {recipe?.reviews?.length > 2 && (
                    <button
                      className="bg-cyan-700 hover:bg-cyan-500 text-white px-2 py-1 text-sm rounded-sm my-2"
                      onClick={() => router.push(`/review?recipeId=${recipe._id}`)} // Pass recipe._id as a query param
                    >
                      View More
                    </button>
                  )}
                </div>
              </div>

            </div>
          </div>
        ))}
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
