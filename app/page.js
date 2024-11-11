// app/page.js or app/home/page.js (depending on your file structure)

// Force dynamic rendering on the server
export const dynamic = "force-dynamic";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Home() {
  redirect("/feed");
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="bg-slate-100 p-8 m-auto w-auto h-auto rounded-lg ">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Welcome to Recipe Archives!
        </h1>
        <p className="text-xl text-gray-600 mb-6">
          Discover, Cook, and Share Your Favorite Recipes with the World!
        </p>
        <div className="flex gap-4">
          <Link href="/register">
            <button className="text-white bg-green-500 p-3 rounded-lg text-lg hover:bg-green-600 transition duration-300">
              Register
            </button>
          </Link>
          <Link href="/login">
            <button className="text-white bg-blue-500 p-3 rounded-lg text-lg hover:bg-blue-600 transition duration-300">
              Login
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
