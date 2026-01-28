import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hash } from 'bcryptjs';

// GET - Lista todos os supervisores (não admins)
export async function GET() {
  try {
    const supervisores = await prisma.gerencia.findMany({
      where: {
        role: 'SUPERVISOR',
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json(supervisores);
  } catch (error) {
    console.error('Erro ao buscar supervisores:', error);
    return NextResponse.json({ message: 'Erro ao buscar supervisores' }, { status: 500 });
  }
}

// PUT - Atualizar supervisor
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, name, email, password } = body;

    if (!id) {
      return NextResponse.json({ message: 'ID é obrigatório' }, { status: 400 });
    }

    // Verificar se o supervisor existe e não é admin
    const supervisor = await prisma.gerencia.findUnique({
      where: { id },
    });

    if (!supervisor) {
      return NextResponse.json({ message: 'Supervisor não encontrado' }, { status: 404 });
    }

    if (supervisor.role === 'ADMIN') {
      return NextResponse.json(
        { message: 'Não é possível editar administradores' },
        { status: 403 },
      );
    }

    // Preparar dados para atualização
    const updateData: { name?: string; email?: string; password?: string } = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (password) updateData.password = await hash(password, 10);

    const updated = await prisma.gerencia.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Erro ao atualizar supervisor:', error);
    return NextResponse.json({ message: 'Erro ao atualizar supervisor' }, { status: 500 });
  }
}

// DELETE - Deletar supervisor
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const action = searchParams.get('action');

    // Ação especial: limpar dados ou resetar sistema
    if (action === 'limpar-dados') {
      // Limpa supervisores e funcionários, mantém admins
      await prisma.$transaction([
        // Deletar métricas mensais
        prisma.metricasMensais.deleteMany(),
        // Deletar regras de comissão
        prisma.regrasDeComissao.deleteMany(),
        // Deletar funcionários
        prisma.funcionario.deleteMany(),
        // Deletar setores
        prisma.setor.deleteMany(),
        // Deletar supervisores (não admins)
        prisma.gerencia.deleteMany({
          where: { role: 'SUPERVISOR' },
        }),
      ]);

      return NextResponse.json({ message: 'Dados limpos com sucesso. Administradores mantidos.' });
    }

    if (action === 'resetar-sistema') {
      // Limpa TUDO exceto admins
      await prisma.$transaction([
        // Deletar métricas mensais
        prisma.metricasMensais.deleteMany(),
        // Deletar regras de comissão
        prisma.regrasDeComissao.deleteMany(),
        // Deletar funcionários
        prisma.funcionario.deleteMany(),
        // Deletar setores
        prisma.setor.deleteMany(),
        // Deletar supervisores (não admins)
        prisma.gerencia.deleteMany({
          where: { role: 'SUPERVISOR' },
        }),
      ]);

      return NextResponse.json({
        message: 'Sistema resetado com sucesso. Apenas administradores mantidos.',
      });
    }

    // Deletar supervisor específico
    if (!id) {
      return NextResponse.json({ message: 'ID é obrigatório' }, { status: 400 });
    }

    // Verificar se o supervisor existe e não é admin
    const supervisor = await prisma.gerencia.findUnique({
      where: { id },
    });

    if (!supervisor) {
      return NextResponse.json({ message: 'Supervisor não encontrado' }, { status: 404 });
    }

    if (supervisor.role === 'ADMIN') {
      return NextResponse.json(
        { message: 'Não é possível deletar administradores' },
        { status: 403 },
      );
    }

    // Verificar se tem setor vinculado
    const setor = await prisma.setor.findUnique({
      where: { supervisorId: id },
    });

    if (setor) {
      // Deletar setor e dados relacionados primeiro
      await prisma.$transaction([
        prisma.regrasDeComissao.deleteMany({ where: { setorId: setor.id } }),
        prisma.funcionario.updateMany({ where: { setorId: setor.id }, data: { setorId: null } }),
        prisma.setor.delete({ where: { id: setor.id } }),
      ]);
    }

    await prisma.gerencia.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Supervisor deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar:', error);
    return NextResponse.json({ message: 'Erro ao deletar' }, { status: 500 });
  }
}
