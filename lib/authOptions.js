import CredentialsProvider from "next-auth/providers/credentials";
import clientPromise from "./mongodbClient";
import bcrypt from "bcrypt";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        try {
          const client = await clientPromise;
          const db = client.db("cluster0");

          const user = await db.collection("users").findOne({
            email: credentials?.email,
          });

          if (!user) {
            console.error("No user found with the provided email.");
            return null;
          }

          const isValid = await bcrypt.compare(
            credentials?.password,
            user?.password
          );

          if (!isValid) {
            console.error("Invalid password.");
            return null;
          }

          return {
            id: user._id.toString(),
            email: user.email,
            username: user.username,
          };
        } catch (error) {
          console.error("Error during authorization:", error);
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      // If user is returned from `authorize`, attach the user ID to the token
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.username = user.username;
        token.picture = user.image;
      }
      console.log("token", token);
      return token;
    },

    async session({ session, token }) {
      // Attach the user ID from the token to the session object
      if (token?.id) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.username = token.username;
        session.user.image = token.image;
      }
      return session;
    },
  },

  session: {
    strategy: "jwt", // Use JWT to store session data
  },
};
