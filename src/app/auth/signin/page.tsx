import { SignIn } from "@/components/SignIn";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

interface SearchParams {
  error?: string;
  callbackUrl?: string;
  message?: string;
}

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const session = await auth();

  // If user is already authenticated, redirect to callback URL or home
  if (session) {
    redirect(params.callbackUrl || "/");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-foreground">
            Enter your account
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Or{" "}
            <a
              href="/auth/signup"
              className="font-medium text-primary hover:text-primary/80"
            >
              create a new account
            </a>
          </p>
        </div>

        {/* Success message */}
        {params.message && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
            {params.message}
          </div>
        )}

        {/* Error message */}
        {params.error && (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-md">
            {params.error === "SessionRequired"
              ? "Please sign in to access this page."
              : params.error === "CredentialsSignin"
              ? "Invalid email or password."
              : "An error occurred during sign in."}
          </div>
        )}

        <SignIn />
      </div>
    </div>
  );
}
