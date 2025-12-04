import { PrismaClient } from '@/app/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import "dotenv/config";

declare global {
  var prisma: PrismaClient | undefined;
}

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
})

// need this because of NextJS hot reload whenever we save a file in development to avoid initializing a new Prisma client every time
export const db = globalThis.prisma || new PrismaClient({ adapter: adapter});
// if not in production, store the db variable in globalThis.prisma, then when hot reload fires on the next iteration it will check if it has Prisma already intialized
if (process.env.NODE_ENV !== 'production') globalThis.prisma = db;
