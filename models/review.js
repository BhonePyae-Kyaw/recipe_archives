import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  review_title: {
    type: String,
    required: true,
  },
  review_description: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId, // Reference to the User collection
    ref: "users", // Must match the collection name of users
    required: true,
  },
  recipe_id: {
    type: mongoose.Schema.Types.ObjectId, // Reference to the Recipe collection
    ref: "recipes", // Must match the collection name of recipes
    required: true,
  },
  review_picture: {
    type: String,
    default: "",
  },
});

const Review = mongoose.models.review || mongoose.model("review", reviewSchema);

export default Review;
