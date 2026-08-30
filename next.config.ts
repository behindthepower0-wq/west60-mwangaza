import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
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
  outputFileTracingIncludes: {
    "/*": [
      "node_modules/sharp/**/*",
      "node_modules/@img/sharp-libvips-linux-x64/**/*",
      "node_modules/@img/sharp-linux-x64/**/*",
    ],
  },
  serverExternalPackages: [
    "sharp",
    "better-sqlite3",
    "@prisma/client",
    ".prisma/client",
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
