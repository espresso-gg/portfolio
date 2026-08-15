import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The in-app preview uses 127.0.0.1 while Next advertises localhost.
  // Allow the preview origin so the HMR client does not stay in a reload loop.
  allowedDevOrigins: ["127.0.0.1"],
};

export default nextConfig;
