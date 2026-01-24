import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// LISTAR MÉTRICAS
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const funcionarioId = searchParams.get("funcionarioId");
    const month = searchParams.get("month");
    const year = searchParams.get("year");

    const where: {
      funcionarioId?: string;
      month?: number;
      year?: number;
    } = {};
    if (funcionarioId) where.funcionarioId = funcionarioId;
    if (month) where.month = parseInt(month);
    if (year) where.year = parseInt(year);

    const metricas = await prisma.metricasMensais.findMany({
      where,
      include: {
        funcionario: {
          select: {
            id: true,
            nome: true,
          },
        },
      },
      orderBy: [{ year: "desc" }, { month: "desc" }],
    });

    return NextResponse.json(metricas);
  } catch (error) {
    console.error("Erro ao buscar métricas:", error);
    return NextResponse.json(
      { error: "Erro ao buscar métricas" },
      { status: 500 },
    );
  }
}

// CRIAR/ATUALIZAR MÉTRICAS
export async function POST(req: Request) {
  try {
    const data = await req.json();
    const {
      funcionarioId,
      month,
      year,
      countNota5,
      countNota4,
      countNota3,
      countNota2,
      countNota1,
    } = data;

    // Calcula o score final
    const totalAvaliacoes =
      countNota5 + countNota4 + countNota3 + countNota2 + countNota1;
    const somaNotas =
      countNota5 * 5 +
      countNota4 * 4 +
      countNota3 * 3 +
      countNota2 * 2 +
      countNota1 * 1;
    const finalScore = totalAvaliacoes > 0 ? somaNotas / totalAvaliacoes : 0;

    // Calcula a porcentagem (nota média / 5 * 100)
    const porcentagem = (finalScore / 5) * 100;

    // Busca regras de comissão do setor do funcionário
    const funcionario = await prisma.funcionario.findUnique({
      where: { id: funcionarioId },
      include: { setor: { include: { commissionRules: true } } },
    });

    let valorComissao = 0;
    if (funcionario?.setor?.commissionRules) {
      // Encontra a regra aplicável baseada na porcentagem
      const regra = funcionario.setor.commissionRules.find(
        (r) => porcentagem >= r.PorcentagemMin,
      );
      if (regra) {
        valorComissao = regra.ValorComissao;
      }
    }

    // Cria ou atualiza a métrica
    const metrica = await prisma.metricasMensais.upsert({
      where: {
        funcionarioId_month_year: {
          funcionarioId,
          month,
          year,
        },
      },
      update: {
        countNota5,
        countNota4,
        countNota3,
        countNota2,
        countNota1,
        finalScore,
        ValorComissao: valorComissao,
      },
      create: {
        funcionarioId,
        month,
        year,
        countNota5,
        countNota4,
        countNota3,
        countNota2,
        countNota1,
        finalScore,
        ValorComissao: valorComissao,
      },
    });

    return NextResponse.json(metrica, { status: 201 });
  } catch (error) {
    console.error("Erro ao salvar métrica:", error);
    return NextResponse.json(
      { error: "Erro ao salvar métrica" },
      { status: 500 },
    );
  }
}
