import CredentialsProvider from "next-auth/providers/credentials";
import clientPromise from "./mongodbClient";
export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const client = await clientPromise;
        const db = client.db("cluster0");

        const user = await db.collection("users").findOne({
          email: credentials?.email,
        });

        const bcrypt = require("bcrypt");
        const isValid = await bcrypt.compare(
          credentials?.password,
          user?.password
        );

        if (isValid) {
          return {
            id: user?._id,
            email: user?.email,
            username: user?.username,
          };
        }

        return null;
      },
    }),
  ],
};
