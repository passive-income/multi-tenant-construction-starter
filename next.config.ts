import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  reactStrictMode: true,
  images: {
    remotePatterns: [{ hostname: 'images.unsplash.com' }],
    formats: ['image/avif', 'image/webp'],
  },
  allowedDevOrigins: ['local-origin.dev', '*.local-origin.dev', '192.168.178.62:3000'],
};

export default nextConfig;
