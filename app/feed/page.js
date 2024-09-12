"use client";
import { signIn, signOut, useSession } from "next-auth/react";
export default function Home() {
  const { data: session, status } = useSession();
  return (
    <div className="m-4">
      <h1>Feed Page</h1>
      <p>{JSON.stringify(session)}</p>
      <button
        onClick={() => signOut({ callbackUrl: "http://localhost:3000/login" })}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      />
    </div>
  );
}
