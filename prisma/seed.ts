import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import { hash } from 'bcryptjs';
import 'dotenv/config';

// Correção: Inicialização direta do adaptador com a configuração
const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 [SEED] Iniciando...');
  const passwordHash = await hash('1871Flip2@@@*', 10);

  // Criar Admin
  await prisma.gerencia.upsert({
    where: { email: 'admin@fliptelecom.com.br' },
    update: {},
    create: {
      email: 'admin@fliptelecom.com.br',
      name: 'Super Admin',
      password: passwordHash,
      role: 'ADMIN',
    },
  });

  console.log('✅ Seed finalizado!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
