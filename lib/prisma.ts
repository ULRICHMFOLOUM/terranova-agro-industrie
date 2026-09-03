import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

// Nettoyer et valider DATABASE_URL (enlever d'éventuels guillemets superflus)
let dbUrl = process.env.DATABASE_URL?.trim();
if (dbUrl) {
  if (
    (dbUrl.startsWith('"') && dbUrl.endsWith('"')) ||
    (dbUrl.startsWith("'") && dbUrl.endsWith("'"))
  ) {
    dbUrl = dbUrl.slice(1, -1).trim();
  }
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "warn", "error"] : ["warn", "error"],
    datasources: dbUrl
      ? {
          db: {
            url: dbUrl,
          },
        }
      : undefined,
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
