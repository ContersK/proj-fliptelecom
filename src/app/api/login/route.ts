import { NextResponse } from 'next/server';
import { compare } from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ message: 'Email e senha são obrigatórios' }, { status: 400 });
    }

    const user = await prisma.gerencia.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ message: 'Credenciais inválidas' }, { status: 401 });
    }

    const valid = await compare(password, user.password);
    if (!valid) {
      return NextResponse.json({ message: 'Credenciais inválidas' }, { status: 401 });
    }

    const response = NextResponse.json({ message: 'ok' });
    response.cookies.set('session_token', user.id, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 1 dia
    });

    return response;
  } catch (error) {
    console.error('Erro no login:', error);
    return NextResponse.json({ message: 'Erro ao fazer login' }, { status: 500 });
  }
}
