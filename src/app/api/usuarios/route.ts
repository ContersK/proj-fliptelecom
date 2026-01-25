import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { name, email, password, role } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'Nome, email e senha são obrigatórios' },
        { status: 400 },
      );
    }

    const existing = await prisma.gerencia.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ message: 'Já existe um usuário com este email' }, { status: 409 });
    }

    const passwordHash = await hash(password, 10);

    const user = await prisma.gerencia.create({
      data: {
        name,
        email,
        password: passwordHash,
        role: role || 'SUPERVISOR',
      },
    });

    return NextResponse.json({ id: user.id, email: user.email }, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    return NextResponse.json({ message: 'Erro ao criar usuário' }, { status: 500 });
  }
}
