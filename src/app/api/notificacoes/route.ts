import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

// GET - Listar notificações (para o usuário logado ou todas para admin)
export async function GET(_request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const userRole = cookieStore.get('userRole')?.value;
    const userId = cookieStore.get('userId')?.value;

    // Buscar notificações não lidas primeiro, depois as lidas, ordenadas por data
    const notificacoes = await prisma.notificacao.findMany({
      where:
        userRole === 'ADMIN'
          ? {} // Admin vê todas
          : {
              OR: [
                { targetId: userId }, // Notificações específicas para o usuário
                { targetId: null }, // Notificações para todos
              ],
            },
      include: {
        createdBy: {
          select: { name: true },
        },
        target: {
          select: { name: true },
        },
      },
      orderBy: [
        { read: 'asc' }, // Não lidas primeiro
        { createdAt: 'desc' }, // Mais recentes primeiro
      ],
      take: 50, // Limitar a 50 notificações
    });

    return NextResponse.json(notificacoes);
  } catch (error) {
    console.error('Erro ao buscar notificações:', error);
    return NextResponse.json({ message: 'Erro ao buscar notificações' }, { status: 500 });
  }
}

// POST - Criar nova notificação (apenas admin)
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const userRole = cookieStore.get('userRole')?.value;
    const userId = cookieStore.get('userId')?.value;

    if (userRole !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Apenas administradores podem enviar notificações' },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { title, message, type = 'info', targetId } = body;

    if (!title || !message) {
      return NextResponse.json({ message: 'Título e mensagem são obrigatórios' }, { status: 400 });
    }

    const notificacao = await prisma.notificacao.create({
      data: {
        title,
        message,
        type,
        createdById: userId,
        targetId: targetId || null, // null = para todos supervisores
      },
    });

    return NextResponse.json(notificacao, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar notificação:', error);
    return NextResponse.json({ message: 'Erro ao criar notificação' }, { status: 500 });
  }
}

// PUT - Marcar notificação como lida
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, markAllRead } = body;

    const cookieStore = await cookies();
    const userId = cookieStore.get('userId')?.value;
    const userRole = cookieStore.get('userRole')?.value;

    if (markAllRead) {
      // Marcar todas como lidas
      await prisma.notificacao.updateMany({
        where:
          userRole === 'ADMIN'
            ? {}
            : {
                OR: [{ targetId: userId }, { targetId: null }],
              },
        data: { read: true },
      });
      return NextResponse.json({ message: 'Todas notificações marcadas como lidas' });
    }

    if (!id) {
      return NextResponse.json({ message: 'ID da notificação é obrigatório' }, { status: 400 });
    }

    await prisma.notificacao.update({
      where: { id },
      data: { read: true },
    });

    return NextResponse.json({ message: 'Notificação marcada como lida' });
  } catch (error) {
    console.error('Erro ao atualizar notificação:', error);
    return NextResponse.json({ message: 'Erro ao atualizar notificação' }, { status: 500 });
  }
}

// DELETE - Deletar notificação (apenas admin)
export async function DELETE(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const userRole = cookieStore.get('userRole')?.value;

    if (userRole !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Apenas administradores podem deletar notificações' },
        { status: 403 },
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const deleteAll = searchParams.get('deleteAll');

    if (deleteAll === 'true') {
      await prisma.notificacao.deleteMany({});
      return NextResponse.json({ message: 'Todas notificações deletadas' });
    }

    if (!id) {
      return NextResponse.json({ message: 'ID da notificação é obrigatório' }, { status: 400 });
    }

    await prisma.notificacao.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Notificação deletada com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar notificação:', error);
    return NextResponse.json({ message: 'Erro ao deletar notificação' }, { status: 500 });
  }
}
