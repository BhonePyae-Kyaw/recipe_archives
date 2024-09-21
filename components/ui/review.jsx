import React from "react";

// Review component
export default function Review({
  review_id,
  title,
  description,
  username,
  date,
  rating,
  reviewId,
  // onDelete,
  reviewUsers,
  loginSession,
}) {
  console.log("User details:", reviewUsers);
  console.log(loginSession);
  // loginsession user id - review - userdetails -id (if they match, show delete button, edit button)
  // Function to render stars based on the rating
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={i <= rating ? "text-yellow-500" : "text-gray-300"}
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
    } catch (error) {
      console.error("Error deleting review:", error.message);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-4 max-w-full">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <div className="text-xl">{renderStars(rating)}</div>
      </div>
      <p className="text-gray-600 mb-4">{description}</p>
      <div className="flex justify-between text-sm text-gray-500">
        <span className="font-medium">{reviewUsers?.username}</span>
        <span>{new Date(date).toLocaleDateString()}</span>
      </div>
      <button
        onClick={handleDelete}
        className="mt-4 bg-red-900 text-white py-1 px-2 rounded hover:bg-red-600"
      >
        Delete Review
      </button>
    </div>
  );
}
