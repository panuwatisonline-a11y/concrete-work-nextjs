import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/concrete-work-nextjs",
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
