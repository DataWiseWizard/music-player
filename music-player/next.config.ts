import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/music/:path*',
        destination: 'https://www.soundhelix.com/examples/mp3/:path*', 
      },
    ];
  },
};

export default nextConfig;
