import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 1. Defina quais rotas são protegidas
const protectedRoutes = ['/'];
const publicRoutes = ['/login'];

// Next.js proxy handler (substitui o antigo middleware)
export function proxy(request: NextRequest) {
  // 2. Tenta pegar o cookie de autenticação (vamos chamar de 'session_token')
  const token = request.cookies.get('session_token')?.value;

  // 3. Verifica a rota atual
  const path = request.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path) || path.startsWith('/dashboard');
  const isPublicRoute = publicRoutes.includes(path);

  // 4. Lógica do Porteiro

  // Se tentar acessar área protegida SEM token -> Manda pro Login
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Se tentar acessar Login COM token -> Manda pro Dashboard (já está logado)
  if (isPublicRoute && token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

// Configura em quais caminhos o middleware vai rodar (pra não rodar em imagens, favicon, etc)
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
