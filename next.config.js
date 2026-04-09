/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // API timeout configuration
  serverRuntimeConfig: {
    apiTimeout: 30000,
  },
}

module.exports = nextConfig
