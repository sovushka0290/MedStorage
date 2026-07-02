import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL || 'postgresql://postgres.tujqhyrndnxojlslgikk:Alikhan100!@aws-1-ap-northeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true',
      },
    },
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
