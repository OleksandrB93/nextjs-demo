export interface User {
  id: string;
  email: string;
  name: string | null;
  posts: Post[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Post {
  id: string;
  title: string;
  content: string | null;
  published: boolean;
  author: User;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserInput {
  email: string;
  name?: string;
}

export interface CreatePostInput {
  title: string;
  content?: string;
  authorId: string;
}

export interface UpdatePostInput {
  id: string;
  title?: string;
  content?: string;
  published?: boolean;
}

import { PrismaClient } from "@prisma/client";

export interface GraphQLContext {
  prisma: PrismaClient;
}
