"use client";
import { useParams } from "next/navigation";

export default async function Home() {
  const id = useParams().id;
  return (
    <div className="m-4">
      <h1>Review Page by recipe ID {id}</h1>
    </div>
  );
}
