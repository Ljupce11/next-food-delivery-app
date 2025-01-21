import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // reactStrictMode: false,
  // experimental: {
  //   ppr: "incremental",
  // },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost", // Allow localhost during development
        port: "3000",
        pathname: "/api/image-proxy/**",
      },
    ],
  },
};

export default nextConfig;
