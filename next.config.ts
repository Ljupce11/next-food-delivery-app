import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ihgez7ccyzskts9i.public.blob.vercel-storage.com",
        pathname: "/menu-items/**",
        search: "",
      },
      {
        protocol: "https",
        hostname: "ihgez7ccyzskts9i.public.blob.vercel-storage.com",
        pathname: "/restaurants/**",
        search: "",
      },
    ],
  },
};

export default nextConfig;
