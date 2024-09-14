"use client";
import TopMenu from "@/components/TopMenu";
import { useSession } from "next-auth/react";

export default function Create() {
  const { data: session, status } = useSession();
  console.log("Logged in user ID:", session?.user?.id);
  // create function
  return (
    <div>
      <TopMenu />
      <h1>Create recipe</h1>
      <h1>Logged in user ID: {session?.user?.id}</h1>
      <h1>Logged in user name: {session?.user?.username}</h1>
      <h1>Anmol create form</h1>
      <h1>
        form - create - api create api - fill user information - id - seesion id{" "}
      </h1>
    </div>

    // const recipeSchema = new mongoose.Schema({
    //   recipe_title: {
    //     type: String,
    //     required: true,
    //   },
    //   brief_description: {
    //     type: String,
    //     required: true,
    //   },
    //   preparation_time: {
    //     type: Number,
    //     required: true,
    //   },
    //   cooking_time: {
    //     type: Number,
    //     default: "",
    //   },
    //   ingredients: {
    //     type: String,
    //     required: true,
    //   },
    //   preparation: {
    //     type: String,
    //     required: true,
    //   },
    //   recipe_picture: {
    //     type: String,
    //     default: "",
    //   },
    //   user_id: {
    //     type: mongoose.Schema.Types.ObjectId, // Reference to the User collection
    //     ref: "users", // Must match the collection name of users
    //     required: true,
    //   },
    // });
  );
}
