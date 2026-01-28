import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Verifica se o período está fechado para um funcionário
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const funcionarioId = searchParams.get('funcionarioId');
    const month = searchParams.get('month');
    const year = searchParams.get('year');

    if (!funcionarioId || !month || !year) {
      return NextResponse.json(
        { message: 'funcionarioId, month e year são obrigatórios' },
        { status: 400 },
      );
    }

    // Busca o funcionário para obter o setor
    const funcionario = await prisma.funcionario.findUnique({
      where: { id: funcionarioId },
      include: { setor: true },
    });

    if (!funcionario || !funcionario.setor) {
      return NextResponse.json({ isClosed: false });
    }

    // Verifica se o período está na lista de fechados
    const periodKey = `${year}-${month.padStart(2, '0')}`;
    const periodosFechados =
      ((funcionario.setor as Record<string, unknown>).periodosFechados as string) || '';
    const isClosed = periodosFechados.split(',').filter(Boolean).includes(periodKey);

    return NextResponse.json({
      isClosed,
      periodKey,
      setorName: funcionario.setor.name,
    });
  } catch (error) {
    console.error('Erro ao verificar status do período:', error);
    return NextResponse.json({ error: 'Erro ao verificar status' }, { status: 500 });
  }
}
