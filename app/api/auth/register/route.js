import clientPromise from "@/lib/mongodbClient";
import { NextResponse } from "next/server";
import { Profiler } from "react";

export async function POST(request) {
  try {
    const { email, password, username } = await request.json();
    const bcrypt = require("bcrypt");
    const hashedPassword = await bcrypt.hash(password, 10);

    const client = await clientPromise;
    const db = client.db("cluster0");
    const createAccount = await db.collection("users").insertOne({
      email,
      password: hashedPassword,
      username: username,
      ProfilePicture: "https://www.gravatar.com/avatar",
    });
    return NextResponse.json(
      { message: "Account created successfully." },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ error: "An error occurred." }, { status: 500 });
  }
}
