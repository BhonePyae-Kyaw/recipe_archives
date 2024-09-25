"use client";
import TopMenu from "@/components/TopMenu";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { CldImage, CldUploadButton } from "next-cloudinary";
import { useRef } from "react";

export default function EditRecipe({ params }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    recipe_title: "",
    brief_description: "",
    preparation_time: "",
    cooking_time: "",
    ingredients: "",
    preparation: "",
    recipe_picture: "",
  });

  useEffect(() => {
    const fetchRecipe = async () => {
      const response = await fetch(`/api/recipe/${params.id}`);
      const data = await response.json();
      if (response.ok) {
        setFormData({
          recipe_title: data.recipe_title,
          brief_description: data.brief_description,
          preparation_time: data.preparation_time,
          cooking_time: data.cooking_time,
          ingredients: data.ingredients,
          preparation: data.preparation,
          recipe_picture: data.recipe_picture,
        });
      }
    };

    fetchRecipe();
  }, [params.id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const formRef = useRef(formData);

  const handleUploadSuccess = (result) => {
    const { event, info } = result;
    if (event === "success") {
      const publicId = info.public_id;
      setFormData((prevData) => ({
        ...prevData,
        recipe_picture: publicId,
      }));
      formRef.current = { ...formRef.current, recipe_picture: publicId }; // Persist image URL in ref
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const dataToSubmit = { ...formData, user_id: session?.user?.id };

    const response = await fetch(`/api/recipe/${params.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataToSubmit),
    });

    if (response.ok) {
      alert("Recipe updated successfully!");
      router.back();
    } else {
      const errorData = await response.json();
      console.error("Error updating recipe:", errorData.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <TopMenu />
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold mb-6">Edit Recipe</h1>
        <form onSubmit={handleUpdate} className="space-y-4">
          {[
            {
              label: "Recipe Title",
              name: "recipe_title",
              type: "text",
              required: true,
            },
            {
              label: "Brief Description",
              name: "brief_description",
              type: "text",
              required: true,
            },
            {
              label: "Preparation Time (mins)",
              name: "preparation_time",
              type: "number",
              required: true,
            },
            {
              label: "Cooking Time (mins)",
              name: "cooking_time",
              type: "number",
            },
            {
              label: "Ingredients",
              name: "ingredients",
              type: "text",
              required: true,
            },
            {
              label: "Preparation",
              name: "preparation",
              type: "text",
              required: true,
            },
          ].map(({ label, name, type, required }) => (
            <div key={name} className="flex flex-col">
              <label className="font-semibold mb-1">{label}:</label>
              <input
                type={type}
                name={name}
                required={required}
                value={formData[name]}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}
          {formData?.recipe_picture && (
            <CldImage
              width={500}
              height={500}
              src={formData.recipe_picture}
              alt="Recipe Image"
              className="rounded-lg max-w-full max-h-[500px] object-cover mt-4 object-center m-auto"
            />
          )}
          <div className="">
            <label className="font-semibold mb-1">Edit Recipe Picture:</label>
            <CldUploadButton
              uploadPreset="recipe_archives"
              onSuccess={handleUploadSuccess}
              className="bg-cyan-800 text-white font-semibold rounded-lg py-2 hover:bg-cyan-500 transition duration-200 w-[200px]"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-semibold rounded-lg py-2 hover:bg-blue-600 transition duration-200"
          >
            Update Recipe
          </button>
        </form>
      </div>
    </div>
  );
}
