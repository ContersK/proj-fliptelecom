import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hash } from 'bcryptjs';

// POST - Solicitar reset de senha (cria notificação para admins)
export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ message: 'Email é obrigatório' }, { status: 400 });
    }

    // Verifica se o usuário existe
    const user = await prisma.gerencia.findUnique({
      where: { email },
    });

    if (!user) {
      // Por segurança, não revelamos se o email existe ou não
      return NextResponse.json({
        message: 'Se o email estiver cadastrado, uma solicitação será enviada aos administradores.',
      });
    }

    // Cria uma notificação para todos os administradores
    const admins = await prisma.gerencia.findMany({
      where: { role: 'ADMIN' },
    });

    // Cria notificação de solicitação de reset para cada admin
    for (const admin of admins) {
      await prisma.notificacao.create({
        data: {
          title: '🔐 Solicitação de Reset de Senha',
          message: `O usuário "${user.name}" (${user.email}) solicitou reset de senha. Acesse as Configurações > Gerenciar Supervisores para redefinir a senha.`,
          type: 'warning',
          targetId: admin.id,
        },
      });
    }

    return NextResponse.json({
      message: 'Solicitação enviada! Os administradores serão notificados para resetar sua senha.',
    });
  } catch (error) {
    console.error('Erro ao solicitar reset de senha:', error);
    return NextResponse.json({ message: 'Erro ao processar solicitação' }, { status: 500 });
  }
}

// PUT - Resetar senha (apenas admin pode fazer)
export async function PUT(req: Request) {
  try {
    const { userId, newPassword } = await req.json();

    if (!userId || !newPassword) {
      return NextResponse.json(
        { message: 'userId e newPassword são obrigatórios' },
        { status: 400 },
      );
    }

    // Hash da nova senha
    const passwordHash = await hash(newPassword, 10);

    // Atualiza a senha
    await prisma.gerencia.update({
      where: { id: userId },
      data: { password: passwordHash },
    });

    return NextResponse.json({
      message: 'Senha resetada com sucesso!',
    });
  } catch (error) {
    console.error('Erro ao resetar senha:', error);
    return NextResponse.json({ message: 'Erro ao resetar senha' }, { status: 500 });
  }
}
