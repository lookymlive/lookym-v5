/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.cache = false;
    return config;
  },
  images: {
    domains: ["i.giphy.com"],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb', // aumenta el límite a 10 MB
    },
  },
};

export default nextConfig;
