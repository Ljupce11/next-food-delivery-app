import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    ppr: "incremental",
  },
  images: {
    domains: [
      "marketplace.canva.com",
      "assets.zenn.com",
      "coreldrawdesign.com",
      "media.istockphoto.com",
      "st3.depositphotos.com",
    ],
  },
};

export default nextConfig;
