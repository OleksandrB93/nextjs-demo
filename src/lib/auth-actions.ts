"use server";

import { signIn } from "@/auth";
import { redirect } from "next/navigation";

export async function signInWithGitHub(callbackUrl: string) {
  try {
    await signIn("github", { redirectTo: callbackUrl });
  } catch (error) {
    console.error("GitHub sign in error:", error);
    // The error will be handled by NextAuth.js and redirected to signin page
    throw error;
  }
}

export async function signInWithLinkedIn(callbackUrl: string) {
  try {
    await signIn("linkedin", { redirectTo: callbackUrl });
  } catch (error) {
    console.error("LinkedIn sign in error:", error);
    // The error will be handled by NextAuth.js and redirected to signin page
    throw error;
  }
}

export async function signInWithCredentials(
  email: string,
  password: string,
  callbackUrl: string
) {
  try {
    const result = await signIn("credentials", {
      email,
      password,
      redirectTo: callbackUrl,
    } as any);

    if ((result as any)?.error) {
      // Handle specific credential errors
      if ((result as any).error === "CredentialsSignin") {
        throw new Error("Invalid email or password.");
      }
      throw new Error((result as any).error);
    }

    if ((result as any)?.url) {
      redirect((result as any).url);
    }
  } catch (error) {
    console.error("Credentials sign in error:", error);
    // Redirect to signin page with error
    redirect(
      `/auth/signin?error=CredentialsSignin&callbackUrl=${encodeURIComponent(
        callbackUrl
      )}`
    );
  }
}
