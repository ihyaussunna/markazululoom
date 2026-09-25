/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '20mb',
    },
    middlewareClientMaxBodySize: '20mb',
  },
  serverActions: {
    bodySizeLimit: '20mb',
  },
};

export default nextConfig;
