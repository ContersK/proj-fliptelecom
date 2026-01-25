import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { month, year, setorId } = await request.json();

    if (!month || !year || !setorId) {
      return NextResponse.json(
        { error: "Faltam parâmetros: month, year, setorId" },
        { status: 400 },
      );
    }

    // Buscar o setor
    const setor = await prisma.setor.findUnique({
      where: { id: setorId },
    });

    if (!setor) {
      return NextResponse.json(
        { error: "Setor não encontrado" },
        { status: 404 },
      );
    }

    // Formato do período
    const periodKey = `${year}-${String(month).padStart(2, "0")}`;

    // Buscar todas as métricas do setor para o período
    const metricas = await prisma.metricasMensais.findMany({
      where: {
        month,
        year,
        funcionario: {
          setorId,
        },
      },
      include: {
        funcionario: true,
      },
    });

    if (metricas.length === 0) {
      return NextResponse.json(
        { error: "Nenhuma métrica encontrada para este período" },
        { status: 404 },
      );
    }

    // Calcular média de atendimentos do setor
    const totalAtendimentos = metricas.reduce((acc, metric) => {
      const total =
        (metric.countNota5 || 0) +
        (metric.countNota4 || 0) +
        (metric.countNota3 || 0) +
        (metric.countNota2 || 0) +
        (metric.countNota1 || 0);
      return acc + total;
    }, 0);

    const mediaAtendimentos = Math.floor(totalAtendimentos / metricas.length);

    // Atualizar status de cada métrica
    const updatedMetricas = await Promise.all(
      metricas.map((metric) => {
        const atendimentos =
          (metric.countNota5 || 0) +
          (metric.countNota4 || 0) +
          (metric.countNota3 || 0) +
          (metric.countNota2 || 0) +
          (metric.countNota1 || 0);

        // Verificar se atingiu a média mínima de atendimentos
        const status =
          atendimentos >= mediaAtendimentos ? "APROVADO" : "REPROVADO";

        return prisma.metricasMensais.update({
          where: { id: metric.id },
          data: { statusComissao: status },
        });
      }),
    );

    // Adicionar o período à lista de períodos fechados do setor
    const periodosFechados: string[] = [];

    // Parse dos períodos fechados se existirem
    if (
      setor &&
      "periodosFechados" in setor &&
      typeof (setor as Record<string, unknown>).periodosFechados === "string"
    ) {
      const existing = (setor as Record<string, unknown>)
        .periodosFechados as string;
      if (existing) {
        periodosFechados.push(...existing.split(","));
      }
    }

    if (!periodosFechados.includes(periodKey)) {
      periodosFechados.push(periodKey);
    }

    await prisma.setor.update({
      where: { id: setorId },
      data: {
        periodosFechados: periodosFechados.join(","),
      } as Record<string, unknown>,
    });

    return NextResponse.json({
      message: "Período fechado com sucesso",
      period: periodKey,
      mediaAtendimentos,
      updatedCount: updatedMetricas.length,
    });
  } catch (error) {
    console.error("Erro ao fechar período:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}
