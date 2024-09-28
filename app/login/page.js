// app/login/page.js

// Force dynamic rendering on the server
export const dynamic = "force-dynamic";

import LoginForm from "./form";

export default async function LoginPage() {
  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <h1 className="text-xl font-bold my-2">Login Page</h1>
      <LoginForm />
    </div>
  );
}
