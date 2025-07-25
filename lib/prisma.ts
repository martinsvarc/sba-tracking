import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient() {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  })
}

// Only create a new Prisma Client instance if one doesn't already exist
export const prisma = globalForPrisma.prisma ?? createPrismaClient()

// In development, attach the Prisma Client to the global object
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma 