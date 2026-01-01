import type { NextConfig } from "next";

// Enable bundle analyzer when ANALYZE env var is truthy
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { hostname: "images.unsplash.com" },
      { hostname: "cdn.sanity.io", protocol: 'https', pathname: '/images/**' },
      { hostname: "staticmap.openstreetmap.de" },
    ],
    formats: ["image/avif", "image/webp"],
  },
  allowedDevOrigins: [
    "local-origin.dev",
    "*.local-origin.dev",
    "192.168.178.62:3000",
  ],
};

module.exports = withBundleAnalyzer(nextConfig);
