"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import TopMenu from "@/components/TopMenu";
export default function Home() {
  const { data: session, status } = useSession();
  return (
    <div className="w-full">
      <TopMenu />
      <h1>Profile Page</h1>
      {/* <p>{JSON.stringify(session)}</p> */}
      <button
        onClick={() => signOut({ callbackUrl: "http://localhost:3000/login" })}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      />
    </div>
  );
}
