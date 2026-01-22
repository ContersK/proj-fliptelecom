-- CreateTable
CREATE TABLE "Gerencia" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'SUPERVISOR',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Setor" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "supervisorId" TEXT NOT NULL,
    CONSTRAINT "Setor_supervisorId_fkey" FOREIGN KEY ("supervisorId") REFERENCES "Gerencia" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Funcionario" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "setorId" TEXT NOT NULL,
    CONSTRAINT "Funcionario_setorId_fkey" FOREIGN KEY ("setorId") REFERENCES "Setor" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MetricasMensais" (
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
    "funcionarioId" TEXT NOT NULL,
    CONSTRAINT "MetricasMensais_funcionarioId_fkey" FOREIGN KEY ("funcionarioId") REFERENCES "Funcionario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RegrasDeComissao" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "PorcentagemMin" REAL NOT NULL,
    "ValorComissao" REAL NOT NULL,
    "setorId" TEXT NOT NULL,
    CONSTRAINT "RegrasDeComissao_setorId_fkey" FOREIGN KEY ("setorId") REFERENCES "Setor" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Gerencia_email_key" ON "Gerencia"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Setor_supervisorId_key" ON "Setor"("supervisorId");

-- CreateIndex
CREATE UNIQUE INDEX "MetricasMensais_funcionarioId_month_year_key" ON "MetricasMensais"("funcionarioId", "month", "year");
