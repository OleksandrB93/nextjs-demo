"use server";

import { signIn } from "@/auth";

export async function signInWithGitHub(callbackUrl: string) {
  await signIn("github", { redirectTo: callbackUrl });
}

export async function signInWithCredentials(
  email: string,
  password: string,
  callbackUrl: string
) {
  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: callbackUrl,
    });
  } catch (error) {
    // Error will be handled by NextAuth.js
    throw error;
  }
}
