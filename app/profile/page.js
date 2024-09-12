"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import TopMenu from "@/components/TopMenu";
import Image from "next/image";
import { PopoverDemo } from "@/components/EditModal";
import { useEffect, useState } from "react";

export default function Home() {
  const { data: session, status } = useSession();
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (session) {
      // Fetch user data
      fetch(`/api/user?id=${session.user?.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setUser(data);
        })
        .catch((error) => console.error("Error fetching user:", error));
    }
  }, [session]);

  const handleDelete = async () => {
    const response = await fetch("/api/user", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: user?.[0]?._id,
      }),
    });

    if (response.ok) {
      console.log("User deleted successfully");
      signOut({ callbackUrl: "http://localhost:3000/login" });
    } else {
      const errorData = await response.json();
      console.error("Error deleting user:", errorData.message);
    }
  };

  console.log("User data:", user?.[0]?.username);
  return (
    <div className="w-full">
      <TopMenu />
      <div className="bg-white p-12 rounded-lg shadow-md m-4">
        <div className="flex justify-center items-center flex-col">
          <img
            src={session?.user?.image}
            alt="user image"
            width={200}
            height={200}
            className="rounded-full"
          />
          <div className="mt-6">
            <PopoverDemo action={"Edit"} user={user} />{" "}
            {/* Pass the `user` state instead of `session` */}
            <button
              onClick={() =>
                signOut({ callbackUrl: "http://localhost:3000/login" })
              }
              className="bg-slate-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Log out
            </button>
          </div>
        </div>
        <div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2 min-w-[200px]">
              Username:
            </label>
            <input
              type="text"
              value={user?.[0]?.username || ""}
              disabled
              className="w-full p-3 rounded-md bg-gray-100 text-gray-600 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2 min-w-[200px]">
              Email:
            </label>
            <input
              type="text"
              value={user?.[0]?.email || ""}
              disabled
              className="w-full p-3 rounded-md bg-gray-100 text-gray-600 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
        </div>

        <button
          onClick={handleDelete}
          className="bg-red-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Delete Account
        </button>
      </div>
    </div>
  );
}
