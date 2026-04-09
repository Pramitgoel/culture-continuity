import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  serverRuntimeConfig: {
    apiTimeout: 30000,
  },
  productionBrowserSourceMaps: false,
};

export default nextConfig;
