import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ihgez7ccyzskts9i.public.blob.vercel-storage.com",
        pathname: "/menu-items/**",
        search: "",
      },
    ],
  },
};

export default nextConfig;
