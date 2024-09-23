import React from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Edit } from "lucide-react";

// Review component
export default function Review({
  review_id,
  title,
  description,
  date,
  rating,
  reviewUsers,
  loginSession,
  onDelete,
}) {
  console.log("User details:", reviewUsers);
  console.log(loginSession);

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
    console.log(review_id);
    try {
      const response = await fetch(`/api/review/${review_id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete review");
      }
      console.log("Review deleted successfully!");
      onDelete(review_id);
    } catch (error) {
      console.error("Error deleting review:", error.message);
    }
  };

  const handleRedirectToEdit = (title, description, rating, review_id) => {
    console.log("Redirecting to review edit page");
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
    <div className="bg-white shadow-md rounded-lg p-6 mb-4 max-w-full">
      {/* User Info and Date */}
      <div className="flex justify-between items-center text-sm text-black-500 mb-6">
        <div className="flex items-center">
          <img
            src={reviewUsers?.image}
            alt={"reviewUsers?.username"}
            className="w-8 h-8 rounded-full mr-2"
          />
          <span className="font-bold text-xl ">{reviewUsers?.username}</span>
        </div>
        <span>{new Date(date).toLocaleDateString()}</span>
      </div>

      {/* Title */}
      <div className="flex justify-between items-center mb-4">
        <span className="text-2xl font-semibold text-gray-800">{title}</span>
        <div className="flex items-center">{renderStars(rating)}</div>
      </div>

      {/* Description */}
      <p className="text-gray-600 mb-6">{description}</p>

      {/* Rating (Stars) */}

      {/* Action Buttons */}
      {session?.user?.id === reviewUsers?._id && (
        <div className="flex justify-end space-x-2">
          <button
            onClick={handleDelete}
            className="bg-red-950 text-white text-sm py-1 px-2 rounded hover:bg-red-600"
          >
            Delete Review
          </button>
          <button
            onClick={() => {
              console.log("Review ID before redirect:", review_id);
              handleRedirectToEdit(title, description, rating, review_id);
            }}
            className="bg-cyan-800 text-white text-sm py-1 px-1 rounded hover:bg-cyan-500"
          >
            <Edit className="h-4 w-4 m-1" />
          </button>
        </div>
      )}
    </div>
  );
}
