import type { NextConfig } from "next";

const uploadthingAppId = process.env.UPLOADTHING_APP_ID;

const nextConfig: NextConfig = {
  allowedDevOrigins: ["precise-internal-skink.ngrok-free.app"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
        pathname: "/f/**",
      },
      ...(uploadthingAppId
        ? [
            {
              protocol: "https" as const,
              hostname: `${uploadthingAppId}.ufs.sh`,
              pathname: "/f/**",
            },
          ]
        : []),
    ],
  },
};

export default nextConfig;
