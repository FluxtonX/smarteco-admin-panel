// smarteco-admin-panel/next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        // When you fetch '/api/v1/collectors' in the frontend...
        source: '/api/:path*',
        // ...it will be proxied to your real production backend
        destination: `${process.env.NEXT_PUBLIC_API_URL}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
