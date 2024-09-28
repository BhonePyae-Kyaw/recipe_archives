// app/register/page.js

// Force dynamic rendering on the server
export const dynamic = "force-dynamic";
import RegisterForm from "./form";

export default async function RegisterPage() {
  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <h1 className="text-xl font-bold my-2">Register</h1>
      <RegisterForm />
    </div>
  );
}
