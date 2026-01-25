/*
  Warnings:

  - You are about to drop the column `ativo` on the `Funcionario` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Funcionario` table. All the data in the column will be lost.
  - Added the required column `nome` to the `Funcionario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `turno` to the `Funcionario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Funcionario` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Funcionario" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "email" TEXT,
    "telefone" TEXT,
    "cargo" TEXT NOT NULL DEFAULT 'Suporte N1',
    "turno" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ATIVO',
    "dataAdmissao" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "setorId" TEXT,
    CONSTRAINT "Funcionario_setorId_fkey" FOREIGN KEY ("setorId") REFERENCES "Setor" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Funcionario" ("id", "setorId") SELECT "id", "setorId" FROM "Funcionario";
DROP TABLE "Funcionario";
ALTER TABLE "new_Funcionario" RENAME TO "Funcionario";
CREATE UNIQUE INDEX "Funcionario_email_key" ON "Funcionario"("email");
CREATE TABLE "new_MetricasMensais" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "countNota5" INTEGER NOT NULL DEFAULT 0,
    "countNota4" INTEGER NOT NULL DEFAULT 0,
    "countNota3" INTEGER NOT NULL DEFAULT 0,
    "countNota2" INTEGER NOT NULL DEFAULT 0,
    "countNota1" INTEGER NOT NULL DEFAULT 0,
    "finalScore" REAL,
    "ValorComissao" REAL,
    "statusComissao" TEXT NOT NULL DEFAULT 'PENDENTE',
    "funcionarioId" TEXT NOT NULL,
    CONSTRAINT "MetricasMensais_funcionarioId_fkey" FOREIGN KEY ("funcionarioId") REFERENCES "Funcionario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_MetricasMensais" ("ValorComissao", "countNota1", "countNota2", "countNota3", "countNota4", "countNota5", "finalScore", "funcionarioId", "id", "month", "year") SELECT "ValorComissao", "countNota1", "countNota2", "countNota3", "countNota4", "countNota5", "finalScore", "funcionarioId", "id", "month", "year" FROM "MetricasMensais";
DROP TABLE "MetricasMensais";
ALTER TABLE "new_MetricasMensais" RENAME TO "MetricasMensais";
CREATE UNIQUE INDEX "MetricasMensais_funcionarioId_month_year_key" ON "MetricasMensais"("funcionarioId", "month", "year");
CREATE TABLE "new_Setor" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "supervisorId" TEXT NOT NULL,
    "periodosFechados" TEXT NOT NULL DEFAULT '',
    CONSTRAINT "Setor_supervisorId_fkey" FOREIGN KEY ("supervisorId") REFERENCES "Gerencia" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Setor" ("id", "name", "supervisorId") SELECT "id", "name", "supervisorId" FROM "Setor";
DROP TABLE "Setor";
ALTER TABLE "new_Setor" RENAME TO "Setor";
CREATE UNIQUE INDEX "Setor_supervisorId_key" ON "Setor"("supervisorId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
