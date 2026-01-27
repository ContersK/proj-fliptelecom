import { createClient } from '@libsql/client';
import 'dotenv/config';

async function syncDatabase() {
  const client = createClient({
    url: process.env.DATABASE_URL || '',
    authToken: process.env.TURSO_AUTH_TOKEN,
  });

  console.log('🔄 Sincronizando tabela Notificacao com Turso...');

  try {
    // Criar tabela de notificações se não existir
    await client.execute(`
      CREATE TABLE IF NOT EXISTS Notificacao (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        message TEXT NOT NULL,
        type TEXT DEFAULT 'info',
        read INTEGER DEFAULT 0,
        createdAt TEXT DEFAULT (datetime('now')),
        createdById TEXT,
        targetId TEXT,
        FOREIGN KEY (createdById) REFERENCES Gerencia(id),
        FOREIGN KEY (targetId) REFERENCES Gerencia(id)
      )
    `);

    console.log('✅ Tabela Notificacao criada/verificada com sucesso!');

    // Verificar se a tabela foi criada
    const result = await client.execute(
      `SELECT name FROM sqlite_master WHERE type='table' AND name='Notificacao'`,
    );
    if (result.rows.length > 0) {
      console.log('✅ Tabela Notificacao existe no banco de dados.');
    }
  } catch (error) {
    console.error('❌ Erro ao sincronizar:', error);
    throw error;
  } finally {
    client.close();
  }
}

syncDatabase().catch(console.error);
