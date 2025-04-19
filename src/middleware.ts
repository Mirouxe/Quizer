import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Ignorer les requêtes API et les requêtes vers la page d'authentification
  if (
    request.nextUrl.pathname.startsWith('/api') ||
    request.nextUrl.pathname === '/auth' ||
    request.nextUrl.pathname === '/'
  ) {
    return NextResponse.next();
  }

  // Vérifier si l'utilisateur est authentifié via un cookie
  const authCookie = request.cookies.get('quizAuthStatus');
  const isAuthenticated = authCookie?.value === 'authenticated';

  // Rediriger vers la page d'authentification si non authentifié
  if (!isAuthenticated) {
    const url = request.nextUrl.clone();
    url.pathname = '/auth';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Configurer les chemins sur lesquels le middleware doit s'exécuter
export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /fonts (inside /public)
     * 4. /favicon.ico, /sitemap.xml (static files)
     */
    '/((?!api|_next|fonts|favicon.ico|sitemap.xml).*)',
  ],
}; 