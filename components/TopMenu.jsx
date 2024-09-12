// app/components/TopMenu.jsx
"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChefHat, Menu, Newspaper, User } from "lucide-react";
import Link from "next/link";

export default function TopMenu() {
  return (
    <div className="flex flex-col">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b">
        <Link className="flex items-center justify-center" href="#">
          <ChefHat className="h-6 w-6 text-primary" />
          <span className="ml-2 text-lg font-semibold">Recipe Archives</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="md:hidden" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Newspaper className="mr-2 h-4 w-4" />
                <span>Feed</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Link href="/feed">
            <Button variant="ghost" className="hidden md:flex" size="sm">
              <Newspaper className="mr-2 h-4 w-4" />
              Feed
            </Button>
          </Link>
          <Link href="/profile">
            <Button variant="ghost" className="hidden md:flex" size="sm">
              <User className="mr-2 h-4 w-4" />
              Profile
            </Button>
          </Link>
        </nav>
      </header>
      {/* <main className="flex-1 p-6">
        <h1 className="text-3xl font-bold">Welcome to Recipe Archives</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Discover, cook, and savor delicious recipes from around the world!
        </p>
      </main> */}
    </div>
  );
}
