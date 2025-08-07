import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { UserRole } from "@prisma/client";

// Helper function to get current user from session
async function getCurrentUser() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized: Please sign in");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
}

export const resolvers = {
  Query: {
    // Regular users query - returns only current user's data
    users: async () => {
      const currentUser = await getCurrentUser();
      return [currentUser];
    },

    // Admin-only query - returns all users
    allUsers: async () => {
      const currentUser = await getCurrentUser();
      if (currentUser.role !== "ADMIN") {
        throw new Error("Forbidden: Admin access required");
      }

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
    // Posts query - returns user's posts or all posts for admin
    posts: async () => {
      const currentUser = await getCurrentUser();

      // Admin can see all posts
      if (currentUser.role === "ADMIN") {
        return await prisma.post.findMany({
          include: {
            author: true,
          },
        });
      }

      // Regular users see only their posts
      return await prisma.post.findMany({
        where: { authorId: currentUser.id },
        include: {
          author: true,
        },
      });
    },

    // User's own posts
    myPosts: async () => {
      const currentUser = await getCurrentUser();
      return await prisma.post.findMany({
        where: { authorId: currentUser.id },
        include: {
          author: true,
        },
      });
    },

    // Admin-only query - returns all posts
    allPosts: async () => {
      const currentUser = await getCurrentUser();
      if (currentUser.role !== "ADMIN") {
        throw new Error("Forbidden: Admin access required");
      }

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
    changeUserRole: async (
      _: unknown,
      { id, role }: { id: string; role: string }
    ) => {
      return await prisma.user.update({
        where: { id: id },
        data: { role: role as any },
      });
    },
    createPost: async (
      _: unknown,
      { title, content }: { title: string; content?: string }
    ) => {
      const currentUser = await getCurrentUser();

      return await prisma.post.create({
        data: {
          title,
          content,
          authorId: currentUser.id,
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
      const currentUser = await getCurrentUser();

      // Check if post exists and user has permission
      const existingPost = await prisma.post.findUnique({
        where: { id },
        include: { author: true },
      });

      if (!existingPost) {
        throw new Error("Post not found");
      }

      // Only post author or admin can update
      if (
        existingPost.authorId !== currentUser.id &&
        currentUser.role !== "ADMIN"
      ) {
        throw new Error("Forbidden: You can only update your own posts");
      }

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
      const currentUser = await getCurrentUser();

      // Check if post exists and user has permission
      const existingPost = await prisma.post.findUnique({
        where: { id },
        include: { author: true },
      });

      if (!existingPost) {
        throw new Error("Post not found");
      }

      // Only post author, moderator, or admin can delete
      if (
        existingPost.authorId !== currentUser.id &&
        currentUser.role !== "ADMIN" &&
        currentUser.role !== "MODERATOR"
      ) {
        throw new Error("Forbidden: You can only delete your own posts");
      }

      return await prisma.post.delete({
        where: { id },
        include: {
          author: true,
        },
      });
    },
  },
};
