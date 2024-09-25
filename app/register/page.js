import RegisterForm from "./form";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/feed");
  }
  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <h1 className="text-xl text-bolder my-2">Register</h1>
      <RegisterForm />
    </div>
  );
}
