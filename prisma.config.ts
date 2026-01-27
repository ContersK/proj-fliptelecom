import 'dotenv/config';
import path from 'path';

const prismaConfig = {
  migrations: {
    path: 'prisma/migrations',
    seed: 'npx tsx prisma/seed.ts',
  },
  datasource: {
    // Use local SQLite for migrations
    url: `file:${path.resolve(__dirname, 'prisma/dev.db')}`,
  },
};

export default prismaConfig;
