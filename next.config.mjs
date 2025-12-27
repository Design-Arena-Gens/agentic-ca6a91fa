/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: {
      rules: {
        '*.md': ['@vercel/turbo-transformers/next-version'],
      },
    },
  },
  reactStrictMode: true,
};

export default nextConfig;
