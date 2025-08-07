import React from "react";
import { UserProfile } from "./UserProfile";
import { ModeToggle } from "./ModeToggle";
import Link from "next/link";

export function Header() {
  return (
    <header className="w-full bg-background shadow fixed top-0 left-0 z-50 border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-primary">
          Next.js GraphQL Demo
        </Link>
        <div className="flex items-center gap-2">
          <UserProfile />
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
