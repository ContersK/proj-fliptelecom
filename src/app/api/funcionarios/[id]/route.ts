import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// EDITAR
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const data = await req.json();
    const { id } = await params;

    const atualizado = await prisma.funcionario.update({
      where: { id },
      data,
    });
    return NextResponse.json(atualizado);
  } catch (error) {
    console.error('Erro ao atualizar funcionário:', error);
    return NextResponse.json({ error: 'Erro ao atualizar' }, { status: 500 });
  }
}

// DELETAR (Opcional, ou mudar status para INATIVO)
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.funcionario.delete({ where: { id } });
    return NextResponse.json({ message: 'Deletado' });
  } catch (error) {
    console.error('Erro ao deletar funcionário:', error);
    return NextResponse.json({ error: 'Erro ao deletar' }, { status: 500 });
  }
}
