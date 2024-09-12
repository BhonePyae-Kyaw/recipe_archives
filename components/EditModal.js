"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
// import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import React from "react";

export function PopoverDemo({ user, action }) {
  console.log(user);
  const [name, setName] = useState(user?.[0]?.username);
  const [email, setEmail] = useState(user?.[0]?.email);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      setName(user?.[0]?.username);
      setEmail(user?.[0]?.email);
    }
  }, [user]);

  const handleSave = async () => {
    const response = await fetch("/api/user", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json", // Make sure to set the Content-Type header
      },
      body: JSON.stringify({
        id: user?.[0]?._id,
        name,
        email,
      }),
    });

    if (response.ok) {
      console.log("User updated successfully");
      window.location.reload();
    } else {
      const errorData = await response.json();
      console.error("Error updating user:", errorData.message);
    }
  };

  return (
    <Popover className="relative">
      <PopoverTrigger asChild>
        <Button
          className="bg-green-500 hover:bg-slate-200 text-white font-bold py-2 px-4 rounded mr-4"
          variant="outline"
        >
          {action}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[500px] max-h-[500px]">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Edit Profile</h4>
          </div>
          <div className="grid gap-2">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="width">Name</Label>
              <Input
                id="width"
                className="col-span-2 h-8"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="maxWidth">Email</Label>
              <Input
                id="maxWidth"
                value={email}
                className="col-span-2 h-8"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <Button
                className="bg-green-500 hover:bg-slate-200 text-white font-bold py-2 px-4 rounded mr-4"
                variant="outline"
                onClick={handleSave}
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
