import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema(
  {
    recipe_title: {
      type: String,
      required: true,
    },
    brief_description: {
      type: String,
      required: true,
    },
    preparation_time: {
      type: Number,
      required: true,
    },
    cooking_time: {
      type: Number,
      default: "",
    },
    ingredients: {
      type: String,
      required: true,
    },
    preparation: {
      type: String,
      required: true,
    },
    recipe_picture: {
      type: String,
      default: "",
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId, // Reference to the User collection
      ref: "users", // Must match the collection name of users
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Recipe = mongoose.models.recipe || mongoose.model("recipe", recipeSchema);

export default Recipe;
