import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  const { pathname } = request.nextUrl;

  // Routes publiques qui ne nécessitent pas d'authentification
  const isPublicRoute = pathname === '/login' || pathname === '/';
  
  // Routes protégées qui nécessitent une authentification
  const isProtectedRoute = pathname.startsWith('/dashboard');

  // Si l'utilisateur essaie d'accéder à une route protégée sans token
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Si l'utilisateur connecté essaie d'accéder à la page de login
  if (isPublicRoute && token && pathname !== '/') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}; 