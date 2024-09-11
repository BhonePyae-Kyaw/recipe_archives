import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1>Recipe Archives</h1>
      <div className="flex gap-4">
        <Link href="/register">
          <button className="text-slate-50 bg-green-500 p-2 rounded-lg cursor-pointer">
            Register
          </button>
        </Link>
        <Link href="/login">
          <button className="text-slate-50 bg-blue-500 p-2 rounded-lg cursor-pointer">
            Login
          </button>
        </Link>
      </div>
    </div>
  );
}
