import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import LinkedIn from "next-auth/providers/linkedin";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./lib/prisma";
import { getAuthConfig } from "./lib/auth-config";

const { nextAuthUrl } = getAuthConfig();

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  trustHost: true,
  debug: process.env.NODE_ENV === "development",
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials.");
        }

        // Find user by email with all data
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email as string,
          },
        });

        if (!user || !user.password) {
          throw new Error("Invalid credentials.");
        }

        // Verify password
        const { verifyPassword } = await import("@/utils/password");
        const isValid = await verifyPassword(
          credentials.password as string,
          user.password
        );

        if (!isValid) {
          throw new Error("Invalid credentials.");
        }

        // Return all user data including image, dates, and role
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
          createdAt: user.createdAt.toISOString(),
          updatedAt: user.updatedAt.toISOString(),
        };
      },
    }),
    GitHub,
    LinkedIn,
    Google,
  ],
  pages: {
    signIn: "/auth/signin", // Custom sign in page
    error: "/auth/signin", // Redirect errors to signin page
  },
  callbacks: {
    authorized: async ({ auth, request }) => {
      const { pathname } = request.nextUrl;

      // Allow access to auth pages without authentication
      if (pathname.startsWith("/auth/")) {
        return true;
      }

      // Return true if user is authorized
      return !!auth;
    },
    async signIn({ user, account, profile }) {
      // Handle OAuth account linking for both GitHub and LinkedIn
      if (account?.provider && user.email) {
        try {
          // Check if user already exists
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email },
            include: { accounts: true },
          });

          if (existingUser) {
            // Check if this OAuth provider is already linked
            const hasProviderAccount = existingUser.accounts.some(
              (acc) => acc.provider === account.provider
            );

            if (!hasProviderAccount) {
              // Link OAuth account to existing user
              await prisma.account.create({
                data: {
                  userId: existingUser.id,
                  type: account.type,
                  provider: account.provider,
                  providerAccountId: account.providerAccountId,
                  refresh_token: account.refresh_token,
                  access_token: account.access_token,
                  expires_at: account.expires_at,
                  token_type: account.token_type,
                  scope: account.scope,
                  id_token: account.id_token,
                  session_state: account.session_state as string,
                },
              });
            }

            // Update user with OAuth provider image and name if not already set
            const updateData: any = {};
            if (user.image && !existingUser.image) {
              updateData.image = user.image;
            }
            if (user.name && !existingUser.name) {
              updateData.name = user.name;
            }

            if (Object.keys(updateData).length > 0) {
              await prisma.user.update({
                where: { id: existingUser.id },
                data: updateData,
              });
            }

            // Update the user object for JWT
            user.id = existingUser.id;
            user.role = existingUser.role;
            user.createdAt = existingUser.createdAt.toISOString();
            user.updatedAt = existingUser.updatedAt.toISOString();
          } else {
            // Create new user with OAuth account
            const newUser = await prisma.user.create({
              data: {
                email: user.email,
                name: user.name,
                image: user.image,
                role: "USER", // Default role
              },
            });

            // Create the OAuth account
            await prisma.account.create({
              data: {
                userId: newUser.id,
                type: account.type,
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                refresh_token: account.refresh_token,
                access_token: account.access_token,
                expires_at: account.expires_at,
                token_type: account.token_type,
                scope: account.scope,
                id_token: account.id_token,
                session_state: account.session_state as string,
              },
            });

            // Update the user object for JWT
            user.id = newUser.id;
            user.role = newUser.role;
            user.createdAt = newUser.createdAt.toISOString();
            user.updatedAt = newUser.updatedAt.toISOString();
          }
        } catch (error) {
          console.error(`Error linking ${account.provider} account:`, error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, trigger }) {
      // Save user info to token when signing in
      if (user) {
        token.id = user.id;
        token.image = user.image;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;
        token.createdAt = user.createdAt;
        token.updatedAt = user.updatedAt;
      }

      if (trigger === "update") {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
        });

        if (dbUser) {
          token.role = dbUser.role;
        }
      }
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client
      if (token) {
        session.user.id = token.id as string;
        session.user.image = token.image as string;
        session.user.name = token.name as string;
        session.user.role = token.role as "USER" | "ADMIN" | "MODERATOR";
        session.user.createdAt = token.createdAt as string;
        session.user.updatedAt = token.updatedAt as string;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Handle redirects properly for both local and production
      const { nextAuthUrl, isProduction } = getAuthConfig();
      const actualBaseUrl = nextAuthUrl || baseUrl;

      // If the URL is relative, make it absolute
      if (url.startsWith("/")) {
        return `${actualBaseUrl}${url}`;
      }

      // If the URL is already absolute and matches our base URL, allow it
      if (url.startsWith(actualBaseUrl)) {
        return url;
      }

      // If the URL is external, redirect to home
      if (url.startsWith("http")) {
        return actualBaseUrl;
      }

      // Default fallback
      return actualBaseUrl;
    },
  },
  events: {
    async signIn({ user, account, profile, isNewUser }) {
      console.log(
        `User signed in: ${user.email} via ${
          account?.provider || "credentials"
        }`
      );
    },
    async signOut(message) {
      if ("token" in message) {
        console.log(`User signed out: ${message.token?.email}`);
      }
    },
    async linkAccount({ user, account, profile }) {
      console.log(`Account linked: ${user.email} with ${account.provider}`);
    },
  },
});
