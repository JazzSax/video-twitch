import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["precise-internal-skink.ngrok-free.app"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.ufs.sh",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
