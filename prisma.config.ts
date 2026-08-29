import { defineConfig } from "prisma/config";
import path from "node:path";

export default defineConfig({
  schema: "./prisma/schema.prisma",
  migrations: {
    path: "./prisma/migrations",
    seed: "ts-node --compiler-options {\"module\":\"commonjs\"} prisma/seed.ts",
  },
  datasource: {
    url: process.env.DATABASE_URL || `file:${path.join(process.cwd(), "prisma", "west60.db")}`,
  },
});
