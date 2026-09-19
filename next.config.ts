import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      { source: "/assets/:path*", destination: "https://zainabkabira.com/assets/:path*" },
    ];
  },
};

export default nextConfig;
