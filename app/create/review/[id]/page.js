"use client";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { date } from "zod";
import TopMenu from "@/components/TopMenu";

export default function Create() {
  // Get the dynamic id from the URL
  const { id } = useParams();
  const { data: session, status } = useSession();

  console.log("Recipe ID:", id);
  console.log("Logged in user ID:", session?.user?.id);
  console.log(session);

  return (
    <div>
      <TopMenu />
      <h1>Create review for Recipe ID: {id}</h1>
      <h1>Logged in user ID: {session?.user?.id}</h1>

      <h1>Logged in user name: {session?.user?.username}</h1>
    </div>
  );
}
