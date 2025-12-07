import { PrismaClient, Prisma } from '@prisma/client';

// Singleton pattern para PrismaClient
// Evita crear múltiples instancias en desarrollo (hot-reload)
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Re-exportar Prisma para acceder a tipos y utilidades
export { Prisma };

