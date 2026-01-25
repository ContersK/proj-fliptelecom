import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    // Idealmente, você recuperaria o usuário autenticado a partir do session/token
    // Por enquanto, como esse é um cenário de desenvolvimento, vamos retornar um setor padrão
    // Em produção, isso deveria verificar cookies/JWT tokens

    // Buscar o primeiro supervisor (para desenvolvimento)
    const supervisor = await prisma.gerencia.findFirst({
      where: { role: "SUPERVISOR" },
      include: { managedSetor: true },
    });

    if (!supervisor) {
      return NextResponse.json(
        { error: "Supervisor não encontrado" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      id: supervisor.id,
      name: supervisor.name,
      email: supervisor.email,
      role: supervisor.role,
      setor: supervisor.managedSetor,
    });
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    return NextResponse.json(
      { error: "Erro ao buscar usuário" },
      { status: 500 },
    );
  }
}
