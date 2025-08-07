import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./lib/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
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
        const bcrypt = require("bcrypt");
        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isValid) {
          throw new Error("Invalid credentials.");
        }

        // Return all user data including image and dates
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          createdAt: user.createdAt.toISOString(),
          updatedAt: user.updatedAt.toISOString(),
        };
      },
    }),
    GitHub,
  ],
  pages: {
    signIn: "/auth/signin", // Custom sign in page
  },
  callbacks: {
    authorized: async ({ auth }) => {
      // Return true if user is authorized
      return !!auth;
    },
    async signIn({ user, account, profile }) {
      // Handle GitHub account linking
      if (account?.provider === "github" && user.email) {
        try {
          // Check if user already exists
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email },
            include: { accounts: true },
          });

          if (existingUser) {
            // Check if GitHub account is already linked
            const hasGitHubAccount = existingUser.accounts.some(
              (acc) => acc.provider === "github"
            );

            if (!hasGitHubAccount) {
              // Link GitHub account to existing user
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

            // Update user with GitHub image and name
            await prisma.user.update({
              where: { id: existingUser.id },
              data: {
                image: user.image,
                name: user.name || existingUser.name,
              },
            });

            // Update the user object for JWT
            user.id = existingUser.id;
          }
        } catch (error) {
          console.error("Error linking GitHub account:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      // Save user info to token when signing in
      if (user) {
        token.id = user.id;
        token.image = user.image;
        token.name = user.name;
        token.email = user.email;
        token.createdAt = user.createdAt;
        token.updatedAt = user.updatedAt;
      }
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client
      if (token) {
        session.user.id = token.id as string;
        session.user.image = token.image as string;
        session.user.name = token.name as string;
        session.user.createdAt = token.createdAt as string;
        session.user.updatedAt = token.updatedAt as string;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // After successful authentication, redirect to home page
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl; // Redirect to home page
    },
  },
});
