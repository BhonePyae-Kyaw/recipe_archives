"use client";
import { signOut, useSession } from "next-auth/react";
import TopMenu from "@/components/TopMenu";
import { useEffect, useState } from "react";
import { PopoverDemo } from "@/components/EditModal";
import { useRouter } from "next/navigation";
import Review from "@/components/ui/review";
import { CldImage } from "next-cloudinary";
import { useParams } from "next/navigation";

export default function Profile() {
  const router = useRouter();
  const { data: session } = useSession();

  const id = useParams();
  const uid = id.id;

  const [user, setUser] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [activeTab, setActiveTab] = useState("recipes");

  useEffect(() => {
    if (uid) {
      fetch(`/api/user/${uid}`, {
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
  }, [uid]);

  useEffect(() => {
    if (uid) {
      fetch(`/api/recipe?userId=${uid}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch recipes");
          return res.json();
        })
        .then((data) => setRecipes(data))
        .catch((error) => console.error("Error fetching recipes:", error));
    }
  }, [uid]);

  useEffect(() => {
    if (uid) {
      fetch(`/api/review/${uid}`, {
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
          setReviews(data.review);
        })
        .catch((error) => console.error("Error fetching reviews:", error));
    }
  }, [uid]);

  return (
    <div className="bg-gray-100 p-6">
      <TopMenu />
      <div className="bg-white p-12 rounded-lg shadow-md m-4">
        <div className="flex justify-center items-center flex-col">
          <img
            src={session?.user?.image}
            alt="user image"
            width={200}
            height={200}
            className="rounded-full"
          />
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

                    <div className="mt-4 flex space-x-2">
                      <button
                        onClick={() => router.push(`/recipe/${recipe._id}`)}
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
                        reviewUserImage={user.ProfilePicture}
                        reviewUserId={review.user_id}
                        recipe_id={review.recipe_id}
                        review_id={review._id}
                        loginSession={session}
                        onDelete={() => {}}
                        details={false}
                        profile={true}
                        page={"other profile"}
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
