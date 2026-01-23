import "dotenv/config";

const prismaConfig = {
  migrations: {
    path: "prisma/migrations",
    seed: "npx tsx prisma/seed.ts",
  },
  datasource: {
    url: process.env.DATABASE_URL,
  },
};

export default prismaConfig;
