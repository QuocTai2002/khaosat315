import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["filemeta.315healthcare.com"],
  },
  output: "standalone", // Bật cho Docker deployment
};

export default nextConfig;
