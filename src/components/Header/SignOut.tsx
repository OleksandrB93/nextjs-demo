"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export function SignOut() {
  return (
    <form
      className="cursor-pointer border border-stone-600 rounded-md px-2 py-1"
      action={async () => {
        await signOut();
      }}
    >
      <button type="submit" className="cursor-pointer">
        <LogOut className="w-4 h-4" />
      </button>
    </form>
  );
}
