import type { NextConfig } from "next";

const backendApiUrl =
  process.env.BACKEND_API_URL ?? process.env.NEXT_PUBLIC_BACKEND_URL;

if (!backendApiUrl) {
  throw new Error(
    "Missing BACKEND_API_URL (or NEXT_PUBLIC_BACKEND_URL) env var — required for API rewrites."
  );
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },

  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${backendApiUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;