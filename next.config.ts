// smarteco-admin-panel/next.config.ts
import path from "node:path";
import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   turbopack: {
//     root: process.cwd(),
//   },
//   async rewrites() {
//     const backendUrl =
//       process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
//     return [
//       {
//         source: "/api/:path*",
//         destination: `${backendUrl}/api/:path*`,
//       },
//     ];
//   },
// };
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
