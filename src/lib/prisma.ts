import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Correção: Passamos a config direto para o adaptador, sem usar createClient antes
const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL || 'file:./dev.db',
  authToken: process.env.TURSO_AUTH_TOKEN,
});

export const prisma = globalForPrisma.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
