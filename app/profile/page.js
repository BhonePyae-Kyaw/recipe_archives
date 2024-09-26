"use client";
import { signOut, useSession } from "next-auth/react";
import TopMenu from "@/components/TopMenu";
import { useEffect, useState } from "react";
import { PopoverDemo } from "@/components/EditModal";
import { useRouter } from "next/navigation";
import Review from "@/components/ui/review";
import { CldImage } from "next-cloudinary";

export default function Profile() {
  const Router = useRouter();
  const { data: session } = useSession();
  const [user, setUser] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [activeTab, setActiveTab] = useState("recipes");

  useEffect(() => {
    if (session) {
      fetch(`${process.env.NEXT_PUBLIC_API_BASE}/user/${session.user?.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch user data");
          return res.json();
        })
        .then((data) => setUser(data))
        .catch((error) => console.error("Error fetching user:", error));
    }
  }, [session]);

  useEffect(() => {
    if (session) {
      fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/recipe?userId=${session.user.id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch recipes");
          return res.json();
        })
        .then((data) => setRecipes(data))
        .catch((error) => console.error("Error fetching recipes:", error));
    }
  }, [session]);

  useEffect(() => {
    if (session) {
      fetch(`${process.env.NEXT_PUBLIC_API_BASE}/review/${session.user.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch reviews");
          return res.json();
        })
        .then((data) => {
          // const reviewPromises = data.map((review) => {
          //   if (review.recipe_id?.$oid) {
          //     return fetch(`/api/recipe/${review.recipe_id.$oid}`)
          //       .then((res) => res.json())
          //       .then((recipe) => ({
          //         ...review,
          //         recipeTitle: recipe.recipe_title,
          //       }));
          //   }
          //   return Promise.resolve(review);
          // });

          // Promise.all(reviewPromises).then(setReviews);
          setReviews(data.review);
        })
        .catch((error) => console.error("Error fetching reviews:", error));
    }
  }, [session]);

  const handleDelete = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/user`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: user?._id,
      }),
    });
    console.log(response);

    if (response.ok) {
      console.log("User deleted successfully");

      signOut({
        callbackUrl: `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/register`,
      });
    } else {
      const errorData = await response.json();
      console.error("Error deleting user:", errorData.message);
    }
  };

  const handleDeleteRecipe = async (recipeId) => {
    if (confirm("Are you sure you want to delete this recipe?")) {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/recipe/${recipeId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        setRecipes(recipes.filter((recipe) => recipe._id.$oid !== recipeId));
        console.log("Recipe deleted successfully");
        window.location.reload();
      } else {
        const errorData = await response.json();
        console.error("Error deleting recipe:", errorData.message);
      }
    }
  };

  const handleDeleteReview = (reviewId) => {
    setRecipes((prevRecipes) =>
      prevRecipes.map((recipe) => ({
        ...recipe,
        // Check if reviews is an array; if not, default to an empty array to prevent errors
        reviews: Array.isArray(recipe.reviews)
          ? recipe.reviews.filter((review) => {
              const reviewIdString = review._id?.$oid || review._id;
              return reviewIdString !== reviewId;
            })
          : [],
      }))
    );
  };
  console.log(user);

  return (
    <div className="bg-gray-100 md:p-6">
      <TopMenu />
      <div className="bg-white md:p-12 p-2 rounded-lg shadow-md m-4">
        <div className="flex justify-center items-center flex-col">
          <img
            src={session?.user?.image}
            alt="user image"
            width={200}
            height={200}
            className="rounded-full"
          />
          <div className="mt-6">
            <PopoverDemo action={"Edit"} user={user} />
            <button
              onClick={() =>
                signOut({
                  callbackUrl: `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/login`,
                })
              }
              className="bg-slate-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Log out
            </button>
          </div>
        </div>
        <div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2 min-w-[200px]">
              Username:
            </label>
            <input
              type="text"
              value={user?.username || ""}
              disabled
              className="w-full p-3 rounded-md bg-gray-100 text-gray-600 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2 min-w-[200px]">
              Email:
            </label>
            <input
              type="text"
              value={user?.email || ""}
              disabled
              className="w-full p-3 rounded-md bg-gray-100 text-gray-600 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
        </div>

        <button
          onClick={handleDelete}
          className="bg-red-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Delete Account
        </button>

        <div className="mt-8">
          <div className="flex space-x-4 border-b-2 pb-2">
            <button
              className={`font-semibold ${
                activeTab === "recipes" ? "border-b-2 border-blue-500" : ""
              }`}
              onClick={() => setActiveTab("recipes")}
            >
              Recipes
            </button>
            <button
              className={`font-semibold ${
                activeTab === "reviews" ? "border-b-2 border-blue-500" : ""
              }`}
              onClick={() => setActiveTab("reviews")}
            >
              Reviews
            </button>
          </div>

          {activeTab === "recipes" && (
            <div className="mt-4">
              {recipes.length > 0 ? (
                recipes.map((recipe) => (
                  <div
                    key={recipe._id.$oid}
                    className="bg-gray-100 p-4 rounded-lg mb-4 shadow-sm"
                  >
                    <h2 className="text-xl font-semibold">
                      {recipe.recipe_title}
                    </h2>
                    <p>{recipe.brief_description}</p>

                    <CldImage
                      src={
                        recipe.recipe_picture
                          ? recipe.recipe_picture
                          : "https://res.cloudinary.com/dr22j6tar/image/upload/v1727199860/samples/coffee.jpg"
                      }
                      width={200}
                      height={200}
                      alt={recipe.recipe_title}
                      className="mt-2 rounded-lg"
                    />

                    <div className="mt-4 md:flex space-x-2">
                      <button
                        onClick={() =>
                          (window.location.href = `/edit/recipe/${recipe._id}`)
                        }
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteRecipe(recipe._id)}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() =>
                          (window.location.href = `recipe/${recipe._id}`)
                        }
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded"
                      >
                        More Details
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p>No recipes found.</p>
              )}
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="mt-4">
              {reviews.length > 0 ? (
                reviews
                  .filter((review) => review.user_id === session?.user?.id) // Filter reviews by session user id
                  .map((review) => (
                    <div
                      key={review._id.$oid || review._id}
                      className="bg-gray-100 p-4 rounded-lg mb-4 shadow-sm"
                    >
                      <h2 className="text-xl font-semibold">
                        {review.recipeTitle}
                      </h2>
                      {/* <p>{review.review_description}</p> */}
                      {review.review_picture && (
                        <img
                          src={review.review_picture}
                          alt={review.recipeTitle}
                          className="mt-2"
                        />
                      )}
                      <Review
                        key={review._id}
                        title={review.review_title}
                        description={review.review_description}
                        rating={review.rating}
                        date={new Date(review.createdAt).toLocaleDateString()}
                        reviewUserName={session?.user?.username}
                        reviewUserImage={session?.user?.image}
                        reviewUserId={review.user_id}
                        recipe_id={review.recipe_id}
                        review_id={review._id}
                        loginSession={session}
                        onDelete={handleDeleteReview}
                        details={false}
                        profile={true}
                      />
                    </div>
                  ))
              ) : (
                <p>No reviews found.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
