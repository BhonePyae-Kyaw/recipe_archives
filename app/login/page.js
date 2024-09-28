// app/login/page.js

// Force dynamic rendering on the server
export const dynamic = "force-dynamic";

import LoginForm from "./form";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  let session = null;
  try {
    session = await getServerSession(authOptions);
  } catch (error) {
    console.error("Error fetching session:", error);
    // Optionally handle the error or display an error message
  }

  if (session) {
    redirect("/feed");
  }

  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <h1 className="text-xl font-bold my-2">Login Page</h1>
      <LoginForm />
    </div>
  );
}
