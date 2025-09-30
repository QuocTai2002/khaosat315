import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["filemeta.315healthcare.com"],
  },
};

export default nextConfig;
