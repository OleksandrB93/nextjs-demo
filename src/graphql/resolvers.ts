import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
// UserRole is used in type checking, so we keep the import but mark it as used
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

// Helper function to get current user from session (no error if not authorized)
async function getCurrentUserOptional() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return null;
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    return user;
  } catch {
    return null;
  }
}

export const resolvers = {
  // Add resolver for UserTrackingEvent to properly serialize data
  UserTrackingEvent: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: (parent: any) => {
      // If data is object, serialize to JSON
      if (typeof parent.data === "object" && parent.data !== null) {
        return JSON.stringify(parent.data);
      }
      // If it's already string, return as is
      return parent.data;
    },
  },

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
          trackingEvents: {
            orderBy: { timestamp: "desc" },
            take: 5, // Last 5 events for each user
          },
        },
      });
    },

    user: async (_: unknown, { id }: { id: string }) => {
      return await prisma.user.findUnique({
        where: { id },
        include: {
          posts: true,
          trackingEvents: {
            orderBy: { timestamp: "desc" },
            take: 10,
          },
        },
      });
    },

    posts: async () => {
      const currentUser = await getCurrentUser();
      return await prisma.post.findMany({
        where: {
          authorId: currentUser.id,
        },
        include: {
          author: true,
        },
      });
    },

    myPosts: async () => {
      const currentUser = await getCurrentUser();
      return await prisma.post.findMany({
        where: {
          authorId: currentUser.id,
        },
        include: {
          author: true,
        },
      });
    },

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

    // === TRACKING QUERIES ===
    trackingEvents: async (
      _: unknown,
      {
        userId,
        sessionToken,
        type,
        limit = 50,
        offset = 0,
      }: {
        userId?: string;
        sessionToken?: string;
        type?: "CLICK" | "SCROLL" | "PAGEVIEW";
        limit?: number;
        offset?: number;
      }
    ) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const where: any = {};
      if (userId) where.userId = userId;
      if (sessionToken) where.sessionToken = sessionToken;
      if (type) where.type = type;

      return await prisma.userTrackingEvent.findMany({
        where,
        include: {
          user: true,
        },
        orderBy: { timestamp: "desc" },
        take: limit,
        skip: offset,
      });
    },

    pageAnalytics: async (
      _: unknown,
      {
        path,
        limit = 50,
        offset = 0,
      }: {
        path?: string;
        limit?: number;
        offset?: number;
      }
    ) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const where: any = {};
      if (path) where.path = path;

      return await prisma.pageAnalytics.findMany({
        where,
        orderBy: { viewCount: "desc" },
        take: limit,
        skip: offset,
      });
    },

    clickHeatmap: async (
      _: unknown,
      { path, limit = 100 }: { path: string; limit?: number }
    ) => {
      return await prisma.clickHeatmap.findMany({
        where: { path },
        orderBy: { clickCount: "desc" },
        take: limit,
      });
    },

    trackingStats: async (
      _: unknown,
      {
        userId,
        dateFrom,
        dateTo,
      }: {
        userId?: string;
        dateFrom?: string;
        dateTo?: string;
      }
    ) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const where: any = {};
      if (userId) where.userId = userId;
      if (dateFrom || dateTo) {
        where.timestamp = {};
        if (dateFrom) where.timestamp.gte = new Date(dateFrom);
        if (dateTo) where.timestamp.lte = new Date(dateTo);
      }

      const [totalEvents, clickEvents, scrollEvents, pageViewEvents] =
        await Promise.all([
          prisma.userTrackingEvent.count({ where }),
          prisma.userTrackingEvent.count({
            where: { ...where, type: "CLICK" },
          }),
          prisma.userTrackingEvent.count({
            where: { ...where, type: "SCROLL" },
          }),
          prisma.userTrackingEvent.count({
            where: { ...where, type: "PAGEVIEW" },
          }),
        ]);

      const topPages = await prisma.pageAnalytics.findMany({
        orderBy: { viewCount: "desc" },
        take: 10,
      });

      const recentEvents = await prisma.userTrackingEvent.findMany({
        where,
        include: {
          user: true,
        },
        orderBy: { timestamp: "desc" },
        take: 10,
      });

      // Browser statistics
      const browserAggregation = await prisma.userTrackingEvent.groupBy({
        by: ["browser"],
        where: { ...where, browser: { not: null } },
        _count: { browser: true },
      });

      const totalBrowserUsers = browserAggregation.reduce(
        (sum, item) => sum + item._count.browser,
        0
      );
      const browserStats = browserAggregation.map((item) => ({
        browser: item.browser || "Unknown",
        count: item._count.browser,
        percentage:
          totalBrowserUsers > 0
            ? (item._count.browser / totalBrowserUsers) * 100
            : 0,
      }));

      // OS statistics
      const osAggregation = await prisma.userTrackingEvent.groupBy({
        by: ["os"],
        where: { ...where, os: { not: null } },
        _count: { os: true },
      });

      const totalOSUsers = osAggregation.reduce(
        (sum, item) => sum + item._count.os,
        0
      );
      const osStats = osAggregation.map((item) => ({
        os: item.os || "Unknown",
        count: item._count.os,
        percentage:
          totalOSUsers > 0 ? (item._count.os / totalOSUsers) * 100 : 0,
      }));

      // Country statistics
      const countryAggregation = await prisma.userTrackingEvent.groupBy({
        by: ["country"],
        where: { ...where, country: { not: null } },
        _count: { country: true },
      });

      const totalCountryUsers = countryAggregation.reduce(
        (sum, item) => sum + item._count.country,
        0
      );
      const countryStats = countryAggregation.map((item) => ({
        country: item.country || "Unknown",
        count: item._count.country,
        percentage:
          totalCountryUsers > 0
            ? (item._count.country / totalCountryUsers) * 100
            : 0,
      }));

      // Device statistics
      const deviceAggregation = await prisma.userTrackingEvent.groupBy({
        by: ["device"],
        where: { ...where, device: { not: null } },
        _count: { device: true },
      });

      const totalDeviceUsers = deviceAggregation.reduce(
        (sum, item) => sum + item._count.device,
        0
      );
      const deviceStats = deviceAggregation.map((item) => ({
        device: item.device || "Unknown",
        count: item._count.device,
        percentage:
          totalDeviceUsers > 0
            ? (item._count.device / totalDeviceUsers) * 100
            : 0,
      }));

      return {
        totalEvents,
        clickEvents,
        scrollEvents,
        pageViewEvents,
        browserStats,
        osStats,
        countryStats,
        deviceStats,
        topPages,
        recentEvents,
      };
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
      });
    },

    changeUserRole: async (
      _: unknown,
      { id, role }: { id: string; role: UserRole }
    ) => {
      const currentUser = await getCurrentUser();
      if (currentUser.role !== "ADMIN") {
        throw new Error("Forbidden: Admin access required");
      }

      return await prisma.user.update({
        where: { id },
        data: { role },
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
      }: {
        id: string;
        title?: string;
        content?: string;
        published?: boolean;
      }
    ) => {
      const currentUser = await getCurrentUser();

      // Check if the post belongs to the current user
      const post = await prisma.post.findUnique({
        where: { id },
      });

      if (!post) {
        throw new Error("Post not found");
      }

      if (post.authorId !== currentUser.id && currentUser.role !== "ADMIN") {
        throw new Error("Forbidden: You can only edit your own posts");
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

      // Check if the post belongs to the current user
      const post = await prisma.post.findUnique({
        where: { id },
      });

      if (!post) {
        throw new Error("Post not found");
      }

      if (post.authorId !== currentUser.id && currentUser.role !== "ADMIN") {
        throw new Error("Forbidden: You can only delete your own posts");
      }

      return await prisma.post.delete({
        where: { id },
        include: {
          author: true,
        },
      });
    },

    // === TRACKING MUTATIONS ===
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    createTrackingEvent: async (_: unknown, { input }: { input: any }) => {
      const currentUser = await getCurrentUserOptional();

      // Parse JSON data if it's string
      let parsedData;
      try {
        parsedData =
          typeof input.data === "string" ? JSON.parse(input.data) : input.data;
      } catch (error) {
        console.error("Failed to parse tracking data:", error);
        parsedData = input.data;
      }

      const createData: any = {
        type: input.type,
        timestamp: new Date(input.timestamp),
        data: parsedData,
        sessionToken: input.sessionToken,
        userAgent: input.userAgent,
        ipAddress: input.ipAddress,
        browser: input.browser,
        browserVersion: input.browserVersion,
        os: input.os,
        osVersion: input.osVersion,
        device: input.device,
        country: input.country,
        city: input.city,
        region: input.region,
        timezone: input.timezone,
      };

      // Only add userId if user is authenticated
      if (currentUser?.id) {
        createData.userId = currentUser.id;
      }

      return await prisma.userTrackingEvent.create({
        data: createData,
        include: {
          user: true,
        },
      });
    },

    updatePageAnalytics: async (
      _: unknown,
      { path, title }: { path: string; title?: string }
    ) => {
      return await prisma.pageAnalytics.upsert({
        where: { path },
        update: {
          viewCount: { increment: 1 },
          lastVisited: new Date(),
          title: title || undefined,
        },
        create: {
          path,
          title,
          viewCount: 1,
          uniqueViews: 1,
          lastVisited: new Date(),
        },
      });
    },

    updateClickHeatmap: async (
      _: unknown,
      {
        path,
        elementType,
        elementId,
        elementClass,
        x,
        y,
      }: {
        path: string;
        elementType: string;
        elementId?: string;
        elementClass?: string;
        x: number;
        y: number;
      }
    ) => {
      // Try to find existing click at the same location
      const existingClick = await prisma.clickHeatmap.findFirst({
        where: {
          path,
          elementType,
          elementId: elementId || null,
          x,
          y,
        },
      });

      if (existingClick) {
        // Update counter
        return await prisma.clickHeatmap.update({
          where: { id: existingClick.id },
          data: {
            clickCount: { increment: 1 },
            updatedAt: new Date(),
          },
        });
      } else {
        // Create new record
        return await prisma.clickHeatmap.create({
          data: {
            path,
            elementType,
            elementId,
            elementClass,
            x,
            y,
            clickCount: 1,
          },
        });
      }
    },
  },
};
