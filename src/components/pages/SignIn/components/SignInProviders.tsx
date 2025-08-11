import { useSearchParams } from "next/navigation";
import { DynamicIcon } from "lucide-react/dynamic";
import { motion } from "framer-motion";

import { signInWithCredentials } from "@/lib/auth-actions";
import { cn } from "@/lib/utils";
import { providers } from "@/configs/signIn-providers";

const SignInProviders = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  return (
    <div>
      {/* OAuth providers */}
      {providers.map((provider) => (
        <form
          key={provider.id}
          action={async () => {
            await provider.action(callbackUrl);
          }}
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className={cn(provider.className, "relative")}
          >
            <DynamicIcon
              name={provider.icon as any}
              size={20}
              className="absolute left-4 text-foreground"
            />
            Sign in with {provider.name}
          </motion.button>
          <span className="text-xs text-muted-foreground">
            {provider.description}
          </span>
        </form>
      ))}

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-background text-muted-foreground">Or</span>
        </div>
      </div>

      {/* Email/Password Login */}
      <form
        action={async (formData) => {
          const email = formData.get("email") as string;
          const password = formData.get("password") as string;
          await signInWithCredentials(email, password, callbackUrl);
        }}
        className="space-y-6"
      >
        <div>
          <label htmlFor="email" className="sr-only">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="appearance-none rounded-md relative block w-full px-3 py-2 border border-border placeholder-muted-foreground text-foreground focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            placeholder="Email address"
          />
        </div>
        <div>
          <label htmlFor="password" className="sr-only">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="appearance-none rounded-md relative block w-full px-3 py-2 border border-border placeholder-muted-foreground text-foreground focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            placeholder="Password"
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-foreground bg-primary hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer"
        >
          Sign in
        </motion.button>
        <span className="text-xs text-muted-foreground -mt-4">
          Credentials are working on development and production
        </span>
      </form>
    </div>
  );
};

export default SignInProviders;
