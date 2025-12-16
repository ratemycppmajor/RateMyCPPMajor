import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.cpp.edu',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
