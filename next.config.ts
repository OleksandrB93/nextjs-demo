import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["avatars.githubusercontent.com"],
  },
  serverExternalPackages: ["@prisma/client"],
};

export default nextConfig;
