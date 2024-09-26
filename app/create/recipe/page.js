"use client";
import TopMenu from "@/components/TopMenu";
import { useSession } from "next-auth/react";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { CldUploadButton, CldImage } from "next-cloudinary";

export default function Create() {
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

  const formRef = useRef(formData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    formRef.current = { ...formRef.current, [name]: value };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToSubmit = { ...formRef.current, user_id: session?.user?.id };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/recipe`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataToSubmit),
        }
      );

      if (response.ok) {
        alert("Recipe created successfully!");
        router.push("/feed");
      } else {
        alert("Error creating recipe");
      }
    } catch (error) {
      console.error("Error submitting form", error);
    }
  };

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

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <TopMenu />
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold mb-6 text-cyan-700">Create Recipe</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
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
          <div className="flex flex-col">
            <label className="font-semibold mb-1">Upload Recipe Picture:</label>
            <CldUploadButton
              uploadPreset="recipe_archives"
              onSuccess={handleUploadSuccess}
              className="bg-cyan-800 text-white font-semibold rounded-lg py-2 hover:bg-cyan-500 transition duration-200 w-[200px]"
            />
          </div>

          {formData?.recipe_picture && (
            <CldImage
              width="500"
              height="500"
              src={formData.recipe_picture}
              alt="Recipe Image"
              className="rounded-lg max-w-full max-h-[500px] object-cover mt-4 object-center m-auto"
            />
          )}

          <button
            type="submit"
            className="w-full bg-cyan-800 text-white font-semibold rounded-lg py-2 hover:bg-cyan-500 transition duration-200"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
