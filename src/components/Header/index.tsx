import React from "react";
import { SignOut } from "./SignOut";
import { UserProfile } from "./UserProfile";

export function Header() {
  return (
    <header className="w-full bg-white shadow fixed top-0 left-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <a href="/" className="text-2xl font-bold text-indigo-700">
          Next.js GraphQL Demo
        </a>
        <UserProfile />
      </div>
    </header>
  );
}
