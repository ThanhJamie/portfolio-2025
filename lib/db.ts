import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

type PrismaClientType = InstanceType<typeof PrismaClient>;

// Support both Turso (production) and local SQLite (development)
const tursoUrl = process.env.TURSO_DATABASE_URL;
const tursoAuthToken = process.env.TURSO_AUTH_TOKEN;

// Create LibSQL adapter with config
// - Production: Uses Turso cloud database (requires TURSO_DATABASE_URL)
// - Development: Uses local SQLite file
const adapter = new PrismaLibSql({
  url: tursoUrl || "file:./dev.db",
  authToken: tursoUrl ? tursoAuthToken : undefined,
});

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientType | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
