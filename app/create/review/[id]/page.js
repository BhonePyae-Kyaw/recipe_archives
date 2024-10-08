"use client";
import { redirect, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import TopMenu from "@/components/TopMenu";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export default function Create() {
  const { id } = useParams(); // Get recipe ID from URL
  const { data: session } = useSession(); // Get session details
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      title: "",
      review: "",
      rating: 1,
    },
  });

  const onSubmit = async (data) => {
    // Handle the review submission (API call to save the review)
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/review`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            recipe_id: id, // Use `recipe_id` from the URL params
            user_id: session?.user?.id, // Use `user_id` from session
            review_title: data.title, // Use `review_title` for the title
            review_description: data.review, // Use `review_description` for the review text
            rating: parseInt(data.rating), // Ensure rating is a number
            review_picture: "", // If there's a picture, add it here; otherwise leave empty or use a default value
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit review");
      }

      // Redirect to the recipe page after submission
      router.push(`/feed`);
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  return (
    <div className="bg-slate-100 p-6 min-h-screen">
      <TopMenu />
      {/* <h1>Create review for Recipe ID: {id}</h1>
      <h1>Logged in user ID: {session?.user?.id}</h1>
      <h1>Logged in user name: {session?.user?.username}</h1> */}
      {session ? (
        <div className="max-w-lg mx-auto my-8 p-4 rounded-md shadow-md bg-white">
          <h1 className="text-2xl font-semibold text-center mb-4 text-cyan-700">
            Submit Your Review
          </h1>

          {/* Form starts here */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Title Input */}
              <FormField
                name="title"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Review Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Title of your review" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Review Text Input */}
              <FormField
                name="review"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Review</FormLabel>
                    <FormControl>
                      <textarea
                        className="w-full h-24 p-2 border border-input rounded-md text-sm"
                        placeholder="Write your review here"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Rating Input */}
              <FormField
                name="rating"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rating</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Rate from 1 to 5"
                        {...field}
                        min={1}
                        max={5}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <Button
                type="submit"
                variant="default"
                className="w-full bg-cyan-800 hover:bg-cyan-500"
              >
                Submit Review
              </Button>
            </form>
          </Form>
        </div>
      ) : (
        <div>You need to be logged in to create a recipe.</div>
      )}
    </div>
  );
}
