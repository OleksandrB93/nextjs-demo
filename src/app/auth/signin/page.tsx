import { SignIn } from "@/components/pages/SignIn";
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

  // Function to get error message
  const getErrorMessage = (error: string) => {
    switch (error) {
      case "SessionRequired":
        return "Please sign in to access this page.";
      case "CredentialsSignin":
        return "Invalid email or password.";
      case "OAuthAccountNotLinked":
        return "An account with this email already exists. Please sign in with your original method or use a different email.";
      case "OAuthSignin":
        return "Error occurred during OAuth sign in. Please try again.";
      case "OAuthCallback":
        return "Error occurred during OAuth callback. Please try again.";
      case "OAuthCreateAccount":
        return "Error occurred while creating OAuth account. Please try again.";
      case "EmailCreateAccount":
        return "Error occurred while creating email account. Please try again.";
      case "Callback":
        return "Error occurred during callback. Please try again.";
      case "OAuthAccountNotLinked":
        return "An account with this email already exists. Please sign in with your original method or use a different email.";
      case "EmailSignin":
        return "Error occurred during email sign in. Please try again.";
      case "CredentialsSignin":
        return "Invalid email or password.";
      case "Default":
        return "An error occurred during sign in.";
      default:
        return "An error occurred during sign in.";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-background/50 rounded-lg p-8 backdrop-blur-sm border border-foreground/10">
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
            {getErrorMessage(params.error)}
          </div>
        )}

        <SignIn />
      </div>
    </div>
  );
}
