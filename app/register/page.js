import RegisterForm from "./form";

export default async function Home() {
  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <h1>Register</h1>
      <RegisterForm />
    </div>
  );
}
