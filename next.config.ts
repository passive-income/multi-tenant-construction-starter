import type { NextConfig } from 'next';

// Enable bundle analyzer when ANALYZE env var is truthy
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
  images: {
    remotePatterns: [
      { hostname: 'images.unsplash.com' },
      { hostname: 'cdn.sanity.io', protocol: 'https', pathname: '/images/**' },
      { hostname: 'staticmap.openstreetmap.de' },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    qualities: [55, 60, 70, 75],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: false,
  },
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-accordion',
      '@radix-ui/react-dropdown-menu',
    ],
  },
  allowedDevOrigins: ['local-origin.dev', '*.local-origin.dev', '192.168.178.62:3000'],
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
        ],
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

module.exports = withBundleAnalyzer(nextConfig);
