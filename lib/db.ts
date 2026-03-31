import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import path from "path";

function createPrismaClient() {
  // DATABASE_URL is "file:./dev.db" → resolve to absolute path
  const rawUrl = process.env.DATABASE_URL ?? "file:./dev.db";
  const dbUrl = rawUrl.startsWith("file:")
    ? `file:${path.resolve(process.cwd(), rawUrl.replace("file:", "").replace(/^\.\//, ""))}`
    : rawUrl;

  const adapter = new PrismaLibSql({ url: dbUrl });
  return new PrismaClient({ adapter });
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
