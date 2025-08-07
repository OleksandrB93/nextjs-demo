"use client";

import { useSession } from "next-auth/react";
import { SignOut } from "./SignOut";

export function UserProfile() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
        <span className="text-gray-500 text-sm">Loading...</span>
      </div>
    );
  }

  if (!session || !session.user) {
    return null;
  }

  return (
    <div className="flex items-center space-x-3">
      {session.user.image && (
        <img
          src={session.user.image}
          alt={session.user.name || "User"}
          className="w-8 h-8 rounded-full border border-gray-300"
        />
      )}
      <span className="text-gray-700 font-medium text-sm">
        {session.user.name || session.user.email}
      </span>
      <SignOut />
    </div>
  );
}
