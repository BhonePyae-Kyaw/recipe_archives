import React from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Edit } from "lucide-react";

// Review component
export default function Review({
  recipe_id,
  review_id,
  title,
  description,
  date,
  rating,
  loginSession,
  onDelete,
  details,
  reviewUserName,
  reviewUserImage,
  reviewUserId,
  profile,
  page,
}) {
  const { data: session } = useSession();
  const router = useRouter();

  // Function to render stars based on the rating
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={
            i <= rating ? "text-yellow-500 text-2xl" : "text-gray-300 text-2xl"
          }
        >
          ★
        </span>
      );
    }
    return stars;
  };

  // Function to handle delete
  const handleDelete = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/review/${review_id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete review");
      }

      onDelete(review_id);
    } catch (error) {
      console.error("Error deleting review:", error.message);
    }
  };

  const handleRedirectToEdit = (title, description, rating, review_id) => {
    if (review_id) {
      const encodedTitle = encodeURIComponent(title);
      const encodedDescription = encodeURIComponent(description);
      const encodedRating = rating;

      // Ensure the path matches your actual file structure
      router.push(
        `/edit/review/${review_id}?title=${encodedTitle}&description=${encodedDescription}&rating=${encodedRating}&review_id=${review_id}`
      );
    } else {
      console.error("No review_id provided!");
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-3 max-w-ful ">
      {/* User Info and Date */}
      <div className="flex justify-between items-center text-sm text-black-500 mb-4">
        <div className="flex items-center">
          <img
            src={
              reviewUserImage == ""
                ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAd5avdba8EiOZH8lmV3XshrXx7dKRZvhx-A&s"
                : reviewUserImage
            }
            alt={"reviewUserName"}
            className="w-8 h-8 rounded-full mr-2"
          />
          <span className="font-bold text-lg ">{reviewUserName}</span>
        </div>
        <span>{new Date(date).toLocaleDateString()}</span>
      </div>

      {/* Title */}
      <div className="flex justify-between items-center mb-2">
        <span className="text-2xl font-semibold text-gray-800">{title}</span>
        <div className="flex items-center">{renderStars(rating)}</div>
      </div>

      {/* Description */}
      {details && <p className="text-gray-600 mb-2">{description}</p>}

      {/* Rating (Stars) */}

      {/* Action Buttons */}
      <div className="flex justify-between pt-2">
        {/* Non-conditional button */}
        <div className="flex justify-start">
          {!details && ( // Check if details is false
            <button
              onClick={() => {
                router.push(`/review/${recipe_id}/${review_id}`);
              }}
              className="bg-cyan-600 text-white text-sm py-1 px-2 rounded hover:bg-cyan-500"
            >
              Details
            </button>
          )}
        </div>

        {/* Conditional Buttons */}
        {session?.user?.id === reviewUserId && page != "other profile" && (
          <div className="flex justify-end space-x-2">
            <button
              onClick={handleDelete}
              className="bg-rose-800 text-white text-sm py-1 px-2 rounded hover:bg-rose-600"
            >
              Delete Review
            </button>
            <button
              onClick={() => {
                handleRedirectToEdit(title, description, rating, review_id);
              }}
              className="bg-cyan-800 text-white text-sm py-1 px-1 rounded hover:bg-cyan-500"
            >
              <Edit className="h-4 w-4 m-1" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
