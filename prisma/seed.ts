import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { hash } from "bcryptjs";

const databaseUrl = process.env.DATABASE_URL ?? "file:./dev.db";

// Cria adapter libsql diretamente via config (tipagem do pacote)
const adapter = new PrismaLibSql({ url: databaseUrl });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Iniciando o seed do banco de dados...");

  try {
    // 1. Criptografar a senha padrão
    const passwordHash = await hash("1871Flip2@@@*", 10);

    // 2. Criar (ou atualizar) o usuário Admin
    const admin = await prisma.gerencia.upsert({
      where: { email: "admin@fliptelecom.com.br" },
      update: {}, // Se já existir, não faz nada
      create: {
        email: "admin@fliptelecom.com.br",
        name: "Super Admin",
        password: passwordHash, // Senha criptografada
        role: "ADMIN",
      },
    });

    console.log("✅ Usuário Admin criado/verificado:", admin);
  } catch (error) {
    console.error("❌ Erro no seed:", error);
    throw error;
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log("✅ Seed concluído com sucesso!");
  })
  .catch(async (e) => {
    console.error("❌ Erro fatal:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
