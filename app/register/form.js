"use client";
import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

// Define the schema with zod
const formSchema = z
  .object({
    email: z
      .string()
      .min(1, { message: "This field has to be filled." })
      .email("This is not a valid email."),
    username: z.string().min(1, { message: "This field has to be filled." }),
    password: z
      .string()
      .min(8, { message: "Password has to be 8 characters long." }),
    confirmPassword: z
      .string()
      .min(6, { message: "Confirm password has to be 6 characters long." }),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: "custom",
        message: "Passwords do not match.",
        path: ["confirmPassword"],
      });
    }
  });

const RegisterForm = () => {
  const router = useRouter();
  const { data: session } = useSession();
  if (session) {
    router.push("/feed");
  }
  // Initialize the form with useForm hook
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  // Define the submit handler
  async function onSubmit(values) {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE}/auth/register`,
      {
        method: "POST",
        body: JSON.stringify(values),
      }
    );
    const data = await response.json();

    if (data.error) {
      toast.error(data.error);
    } else {
      toast.success("Account created successfully.");
      router.push("/login");
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 border border-slate-300 p-8 bg-slate-100 rounded-lg"
      >
        <div></div>
        <div className="md:flex gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="johndoe@gmail.com" {...field} />
                </FormControl>
                <FormDescription>
                  Email you want to use for your account.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="User Name" {...field} />
                </FormControl>
                <FormDescription>
                  User name you want to use for your account.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div>
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormDescription>Password</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormDescription>Confirm your password.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <p className="text-slate-600">
          Already have an account?{" "}
          <span
            className="text-cyan-700 cursor-pointer font-semibold"
            onClick={() => router.push("login")}
          >
            Log in
          </span>
        </p>

        <div className="w-full flex items-center justicy-center">
          <Button className="bg-cyan-700 cursor-pointer m-auto" type="submit">
            Register
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default RegisterForm;
