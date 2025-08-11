import {
  signInWithGitHub,
  signInWithGoogle,
  signInWithLinkedIn,
} from "@/lib/auth-actions";

// Configuration of providers
export const providers = [
  {
    id: "github",
    name: "GitHub",
    action: signInWithGitHub,
    description: "Use on production",
    icon: "github",
    className:
      "bg-background w-full flex justify-center py-2 px-4 border border-foreground/10 rounded-md shadow-sm text-sm font-medium text-foreground bg-background hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 cursor-pointer",
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    action: signInWithLinkedIn,
    description: "Use on development",
    icon: "linkedin",
    className:
      "bg-blue-700 w-full flex justify-center py-2 px-4 border border-foreground/10 rounded-md shadow-sm text-sm font-medium text-foreground bg-background hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 cursor-pointer",
  },
  {
    id: "google",
    name: "Google",
    action: signInWithGoogle,
    description: "Google is working on development and production",
    icon: "search",
    className:
      "bg-blue-700 w-full flex justify-center py-2 px-4 border border-foreground/10 rounded-md shadow-sm text-sm font-medium text-foreground bg-background hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 cursor-pointer",
  },
];
