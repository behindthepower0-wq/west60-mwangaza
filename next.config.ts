import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],
    formats: ["image/webp", "image/avif"],
    unoptimized: true,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  serverExternalPackages: [
    "sharp",
    "better-sqlite3",
    "@prisma/client",
    ".prisma/client",
    "@prisma/adapter-better-sqlite3",
    "@prisma/adapter-d1",
    "@prisma/adapter-libsql",
    "@libsql/client",
  ],
};

export default nextConfig;

// Only init Cloudflare dev when running on Workers or in local dev with wrangler
if (process.env.CLOUDFLARE || process.env.WRANLGE_DEV) {
  try {
    const { initOpenNextCloudflareForDev } = require("@opennextjs/cloudflare");
    initOpenNextCloudflareForDev();
  } catch { /* not on Cloudflare */ }
}
