import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const userRole = cookieStore.get('userRole')?.value;

    const { month, year, setorId } = await request.json();

    if (!month || !year) {
      return NextResponse.json({ error: 'Faltam parâmetros: month, year' }, { status: 400 });
    }

    // Formato do período
    const periodKey = `${year}-${String(month).padStart(2, '0')}`;

    // Determinar o filtro baseado no role
    let whereClause: Record<string, unknown> = { month, year };

    if (userRole === 'ADMIN') {
      // Admin pode fechar para todos os funcionários
      // Se setorId foi passado, filtra por setor específico
      if (setorId) {
        whereClause = {
          ...whereClause,
          funcionario: { setorId },
        };
      }
    } else {
      // Supervisor precisa de setorId
      if (!setorId) {
        return NextResponse.json(
          { error: 'Supervisor precisa especificar o setor' },
          { status: 400 },
        );
      }
      whereClause = {
        ...whereClause,
        funcionario: { setorId },
      };
    }

    // Buscar todas as métricas para o período
    const metricas = await prisma.metricasMensais.findMany({
      where: whereClause,
      include: {
        funcionario: {
          include: {
            setor: true,
          },
        },
      },
    });

    if (metricas.length === 0) {
      return NextResponse.json(
        { error: 'Nenhuma métrica encontrada para este período' },
        { status: 404 },
      );
    }

    // Agrupar métricas por setor para calcular média por setor
    const metricasPorSetor = new Map<string, typeof metricas>();

    metricas.forEach((metric) => {
      const setorNome = metric.funcionario?.setor?.name || 'Sem Setor';
      if (!metricasPorSetor.has(setorNome)) {
        metricasPorSetor.set(setorNome, []);
      }
      metricasPorSetor.get(setorNome)!.push(metric);
    });

    // Calcular média de atendimentos por setor
    const mediasPorSetor = new Map<string, number>();

    metricasPorSetor.forEach((setorMetricas, setorNome) => {
      const totalAtendimentos = setorMetricas.reduce((acc, metric) => {
        return (
          acc +
          (metric.countNota5 || 0) +
          (metric.countNota4 || 0) +
          (metric.countNota3 || 0) +
          (metric.countNota2 || 0) +
          (metric.countNota1 || 0)
        );
      }, 0);
      const media = Math.floor(totalAtendimentos / setorMetricas.length);
      mediasPorSetor.set(setorNome, media);
    });

    // Atualizar status de cada métrica
    let aprovados = 0;
    let reprovados = 0;

    const updatedMetricas = await Promise.all(
      metricas.map((metric) => {
        const atendimentos =
          (metric.countNota5 || 0) +
          (metric.countNota4 || 0) +
          (metric.countNota3 || 0) +
          (metric.countNota2 || 0) +
          (metric.countNota1 || 0);

        const setorNome = metric.funcionario?.setor?.name || 'Sem Setor';
        const mediaSetor = mediasPorSetor.get(setorNome) || 0;

        // Calcular pontuação e percentual
        const pontuacao =
          (metric.countNota5 || 0) * 5 +
          (metric.countNota4 || 0) * 4 +
          (metric.countNota3 || 0) * 3 +
          (metric.countNota2 || 0) * 2 +
          (metric.countNota1 || 0) * 1;
        const maxPossivel = atendimentos * 5;
        const percentual = maxPossivel > 0 ? Math.round((pontuacao / maxPossivel) * 100) : 0;

        // Aprovar se: atingiu média de atendimentos E tem performance >= 80%
        const status = atendimentos >= mediaSetor && percentual >= 80 ? 'APROVADO' : 'REPROVADO';

        if (status === 'APROVADO') aprovados++;
        else reprovados++;

        return prisma.metricasMensais.update({
          where: { id: metric.id },
          data: { statusComissao: status },
        });
      }),
    );

    // Se admin e fechando para todos, marcar período fechado em todos os setores
    if (userRole === 'ADMIN' && !setorId) {
      const setores = await prisma.setor.findMany();

      await Promise.all(
        setores.map(async (setor) => {
          const periodosFechados: string[] = [];
          const existing = (setor as Record<string, unknown>).periodosFechados as string;
          if (existing) {
            periodosFechados.push(...existing.split(',').filter(Boolean));
          }
          if (!periodosFechados.includes(periodKey)) {
            periodosFechados.push(periodKey);
          }
          return prisma.setor.update({
            where: { id: setor.id },
            data: { periodosFechados: periodosFechados.join(',') },
          });
        }),
      );
    } else if (setorId) {
      // Marcar período fechado apenas no setor específico
      const setor = await prisma.setor.findUnique({ where: { id: setorId } });
      if (setor) {
        const periodosFechados: string[] = [];
        const existing = (setor as Record<string, unknown>).periodosFechados as string;
        if (existing) {
          periodosFechados.push(...existing.split(',').filter(Boolean));
        }
        if (!periodosFechados.includes(periodKey)) {
          periodosFechados.push(periodKey);
        }
        await prisma.setor.update({
          where: { id: setorId },
          data: { periodosFechados: periodosFechados.join(',') },
        });
      }
    }

    return NextResponse.json({
      message: 'Período fechado com sucesso',
      period: periodKey,
      updatedCount: updatedMetricas.length,
      aprovados,
      reprovados,
    });
  } catch (error) {
    console.error('Erro ao fechar período:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

// PUT - Reabrir período (apenas admin)
export async function PUT(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const userRole = cookieStore.get('userRole')?.value;

    if (userRole !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Apenas administradores podem reabrir períodos' },
        { status: 403 },
      );
    }

    const { month, year, setorId } = await request.json();

    if (!month || !year) {
      return NextResponse.json({ error: 'Faltam parâmetros: month, year' }, { status: 400 });
    }

    const periodKey = `${year}-${String(month).padStart(2, '0')}`;

    // Determinar filtro
    let whereClause: Record<string, unknown> = { month, year };
    if (setorId) {
      whereClause = {
        ...whereClause,
        funcionario: { setorId },
      };
    }

    // Reverter status das métricas para PENDENTE
    await prisma.metricasMensais.updateMany({
      where: whereClause,
      data: { statusComissao: 'PENDENTE' },
    });

    // Remover período da lista de fechados
    if (setorId) {
      const setor = await prisma.setor.findUnique({ where: { id: setorId } });
      if (setor) {
        const existing = (setor as Record<string, unknown>).periodosFechados as string;
        const periodosFechados = existing ? existing.split(',').filter(Boolean) : [];
        const updated = periodosFechados.filter((p) => p !== periodKey);
        await prisma.setor.update({
          where: { id: setorId },
          data: { periodosFechados: updated.join(',') },
        });
      }
    } else {
      // Remover de todos os setores
      const setores = await prisma.setor.findMany();
      await Promise.all(
        setores.map(async (setor) => {
          const existing = (setor as Record<string, unknown>).periodosFechados as string;
          const periodosFechados = existing ? existing.split(',').filter(Boolean) : [];
          const updated = periodosFechados.filter((p) => p !== periodKey);
          return prisma.setor.update({
            where: { id: setor.id },
            data: { periodosFechados: updated.join(',') },
          });
        }),
      );
    }

    return NextResponse.json({
      message: 'Período reaberto com sucesso',
      period: periodKey,
    });
  } catch (error) {
    console.error('Erro ao reabrir período:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

// GET - Verificar status do período
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month');
    const year = searchParams.get('year');

    if (!month || !year) {
      return NextResponse.json({ error: 'Faltam parâmetros: month, year' }, { status: 400 });
    }

    const periodKey = `${year}-${String(month).padStart(2, '0')}`;

    // Contar métricas por status
    const metricas = await prisma.metricasMensais.findMany({
      where: {
        month: parseInt(month),
        year: parseInt(year),
      },
    });

    const pendentes = metricas.filter((m) => m.statusComissao === 'PENDENTE').length;
    const aprovados = metricas.filter((m) => m.statusComissao === 'APROVADO').length;
    const reprovados = metricas.filter((m) => m.statusComissao === 'REPROVADO').length;

    // O período está fechado se houver métricas e nenhuma estiver pendente
    // OU se houver aprovados/reprovados
    const isClosed = metricas.length > 0 && pendentes === 0 && (aprovados > 0 || reprovados > 0);

    // Verificar também nos setores (fallback)
    const setores = await prisma.setor.findMany();
    const setoresFechados: string[] = [];

    setores.forEach((setor) => {
      const existing = (setor as Record<string, unknown>).periodosFechados as string;
      const periodosFechados = existing ? existing.split(',').filter(Boolean) : [];
      if (periodosFechados.includes(periodKey)) {
        setoresFechados.push(setor.name);
      }
    });

    return NextResponse.json({
      period: periodKey,
      isClosed: isClosed || setoresFechados.length > 0,
      setoresFechados,
      stats: {
        total: metricas.length,
        pendentes,
        aprovados,
        reprovados,
      },
    });
  } catch (error) {
    console.error('Erro ao verificar período:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
