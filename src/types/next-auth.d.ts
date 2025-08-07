import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

export type UserRole = "USER" | "ADMIN" | "MODERATOR";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role?: UserRole;
      createdAt?: string;
      updatedAt?: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role?: UserRole;
    createdAt?: string;
    updatedAt?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role?: UserRole;
    createdAt?: string;
    updatedAt?: string;
  }
}
