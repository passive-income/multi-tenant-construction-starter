import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com'],
  },
  allowedDevOrigins: ['local-origin.dev', '*.local-origin.dev', '192.168.178.62:3000'],
};

export default nextConfig;
