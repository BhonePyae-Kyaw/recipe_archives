"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import TopMenu from "@/components/TopMenu";
import { Button } from "@/components/ui/button";
import { Suspense } from "react";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";

export default function Edit() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();

  // Local state to store query parameters
  const [queryParams, setQueryParams] = useState({
    title: "",
    description: "",
    rating: 1,
    review_id: "",
  });

  // useEffect to parse query parameters from the URL
  useEffect(() => {
    const title = searchParams.get("title") || "";
    const description = searchParams.get("description") || "";
    const rating = searchParams.get("rating") || 1;
    const review_id = searchParams.get("review_id") || "";

    setQueryParams({ title, description, rating, review_id });
    console.log("Query params:", { title, description, rating, review_id });
  }, [searchParams]);

  // Initialize the form with empty default values
  const form = useForm({
    defaultValues: {
      title: queryParams.title,
      review: queryParams.description,
      rating: queryParams.rating,
    },
  });

  // When queryParams changes, update form values
  useEffect(() => {
    form.reset({
      title: queryParams.title,
      review: queryParams.description,
      rating: queryParams.rating,
    });
  }, [queryParams, form]);

  // onSubmit function to handle the form submission
  const onSubmit = async (data) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/review/${queryParams.review_id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: data.title,
            description: data.review,
            rating: parseInt(data.rating),
          }),
        }
      );
      console.log("Reviewid:", queryParams.review_id, 11);

      if (!response.ok) {
        throw new Error("Failed to update review");
      }

      console.log("Review updated successfully!");
      router.push(`/feed`);
    } catch (error) {
      console.error("Error updating review:", error);
    }
  };

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <div>
        <TopMenu />
        <div className="max-w-lg mx-auto my-8 p-4 rounded-md shadow-md bg-white">
          <h1 className="text-2xl font-semibold text-center mb-4 text-cyan-700">
            Edit Your Review
          </h1>

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
                Update Review
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </Suspense>
  );
}
