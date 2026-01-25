import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs"; // Importante para a senha

async function getManagedSetorId() {
  const sessionToken = (await cookies()).get("session_token")?.value;
  if (!sessionToken) return null;

  const gerencia = await prisma.gerencia.findUnique({
    where: { id: sessionToken },
    include: { managedSetor: true },
  });

  return gerencia?.managedSetor?.id ?? null;
}

// LISTAR TODOS
export async function GET() {
  try {
    const setorId = await getManagedSetorId();
    const funcionarios = await prisma.funcionario.findMany({
      where: setorId ? { setorId } : undefined,
      include: { setor: true },
      orderBy: { nome: "asc" },
    });
    return NextResponse.json(funcionarios);
  } catch (error) {
    console.error("Erro ao buscar funcionários:", error);
    return NextResponse.json(
      { error: "Erro ao buscar funcionários" },
      { status: 500 },
    );
  }
}

// CRIAR NOVO (COM OPÇÃO DE LOGIN)
export async function POST(req: Request) {
  try {
    const data = await req.json();

    // Separa a senha do resto dos dados
    const { password, ...funcionarioData } = data;

    const setorId = await getManagedSetorId();

    // 1. Cria o Funcionário na tabela de métricas
    const novoFuncionario = await prisma.funcionario.create({
      data: {
        ...funcionarioData,
        setorId: funcionarioData.setorId ?? setorId ?? undefined,
      },
    });

    // 2. Se tiver senha, cria TAMBÉM o usuário de acesso (Gerencia)
    if (password && funcionarioData.email) {
      const passwordHash = await hash(password, 10);

      // Verifica se já existe login com esse email
      const existeLogin = await prisma.gerencia.findUnique({
        where: { email: funcionarioData.email },
      });

      if (!existeLogin) {
        await prisma.gerencia.create({
          data: {
            name: funcionarioData.nome,
            email: funcionarioData.email,
            password: passwordHash,
            role: "USER", // Ou "ADMIN", se preferir
          },
        });
      }
    }

    return NextResponse.json(novoFuncionario, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erro ao criar funcionário" },
      { status: 500 },
    );
  }
}
