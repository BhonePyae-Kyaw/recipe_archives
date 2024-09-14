"use client";
import TopMenu from "@/components/TopMenu";
import { useSession } from "next-auth/react";

export default function Create() {
  const { data: session, status } = useSession();
  console.log("Logged in user ID:", session?.user?.id);
  return (
    <div>
      <TopMenu />
      <h1>Create recipe</h1>
      <h1>Logged in user ID: {session?.user?.id}</h1>
      <h1>Logged in user name: {session?.user?.username}</h1>
    </div>
  );
}
