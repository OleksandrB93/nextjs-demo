import { prisma } from "@/lib/prisma";

export const resolvers = {
  Query: {
    users: async () => {
      return await prisma.user.findMany({
        include: {
          posts: true,
        },
      });
    },
    user: async (_: unknown, { id }: { id: string }) => {
      return await prisma.user.findUnique({
        where: { id },
        include: {
          posts: true,
        },
      });
    },
    posts: async () => {
      return await prisma.post.findMany({
        include: {
          author: true,
        },
      });
    },
    post: async (_: unknown, { id }: { id: string }) => {
      return await prisma.post.findUnique({
        where: { id },
        include: {
          author: true,
        },
      });
    },
  },
  Mutation: {
    createUser: async (
      _: unknown,
      { email, name }: { email: string; name?: string }
    ) => {
      return await prisma.user.create({
        data: {
          email,
          name,
        },
        include: {
          posts: true,
        },
      });
    },
    createPost: async (
      _: unknown,
      {
        title,
        content,
        authorId,
      }: { title: string; content?: string; authorId: string }
    ) => {
      return await prisma.post.create({
        data: {
          title,
          content,
          authorId,
        },
        include: {
          author: true,
        },
      });
    },
    updatePost: async (
      _: unknown,
      {
        id,
        title,
        content,
        published,
      }: { id: string; title?: string; content?: string; published?: boolean }
    ) => {
      return await prisma.post.update({
        where: { id },
        data: {
          title,
          content,
          published,
        },
        include: {
          author: true,
        },
      });
    },
    deletePost: async (_: unknown, { id }: { id: string }) => {
      return await prisma.post.delete({
        where: { id },
        include: {
          author: true,
        },
      });
    },
  },
};
