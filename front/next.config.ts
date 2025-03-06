import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/upload',
        destination: 'http://localhost:5005/upload',
      },
      {
        source: '/ask',
        destination: 'http://localhost:5005/ask',
      },
    ];
  },
};

export default nextConfig;
