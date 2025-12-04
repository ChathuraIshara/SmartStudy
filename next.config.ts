import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["pdf-parse"],
  },
  devIndicators:false
  /* config options here */
};

export default nextConfig;
