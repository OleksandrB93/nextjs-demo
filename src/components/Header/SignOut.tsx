"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export function SignOut() {
  return (
    <form
      action={async () => {
        await signOut();
      }}
    >
      <button type="submit">
        <LogOut className="w-4 h-4" />
      </button>
    </form>
  );
}
