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
import { signIn } from "next-auth/react";
import { useState } from "react";
import { set } from "mongoose";

const formSchema = z.object({
  email: z
    .string()
    .min(1, {
      message: "This field has to be filled.",
    })
    .email("This is not a valid email."),

  password: z.string().min(8, {
    message: "Password has to be at least 8 characters long.",
  }),
});

const LoginForm = () => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [responseError, setResponseError] = useState(null);
  const [responseSuccess, setResponseSuccess] = useState(null);

  const router = useRouter();

  if (session) {
    router.push("/feed");
  }
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  // 2. Define a submit handler.
  async function onSubmit(values) {
    setLoading(true);
    try {
      const response = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });
      if (response?.error) {
        setResponseError("Invalid email or password.");
        setTimeout(() => {
          setResponseError(null);
        }, 3000);
        setLoading(false);
      } else {
        setResponseSuccess("Login successful.");
        setLoading(false);
        setTimeout(() => {
          router.push("/feed");
          setResponseSuccess(null);
        }, 1000);
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    }
  }

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 border border-slate-300 p-8 bg-slate-100 rounded-lg"
        >
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
          <p className="text-slate-600">
            Don&apos;t have an account yet?{" "}
            <span
              className="text-cyan-700 cursor-pointer font-semibold"
              onClick={() => router.push("register")}
            >
              Register
            </span>
          </p>
          <div className="w-full flex items-center justicy-center">
            <Button className="m-auto bg-cyan-700" type="submit">
              Log in
            </Button>
          </div>
        </form>
      </Form>
      {loading && <div>Loading...</div>}
      {responseError && (
        <div className="p-4 bg-red-500 text-white rounded-lg">
          {responseError}
        </div>
      )}
      {responseSuccess && (
        <div className="p-4 bg-green-500 text-white rounded-lg">
          {responseSuccess}
        </div>
      )}
    </div>
  );
};

export default LoginForm;
