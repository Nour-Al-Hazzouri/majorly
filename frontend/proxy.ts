import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that require authentication
const protectedRoutes = ['/dashboard', '/assessment', '/profile', '/settings'];

// Routes that should be inaccessible to logged-in users
const authRoutes = ['/login', '/register', '/forgot-password', '/reset-password'];

export default function (request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Check for our custom authenticated cookie (reliable)
    const isAuthenticated = request.cookies.has('majorly_logged_in');

    // Debugging (Remove in production)
    if (pathname.startsWith('/dashboard') || pathname.startsWith('/login')) {
        console.log(`[Proxy] Path: ${pathname} | Authed: ${isAuthenticated}`);
    }

    // 1. Redirect unauthenticated users from protected routes to login
    if (!isAuthenticated && protectedRoutes.some(route => pathname.startsWith(route))) {
        const url = new URL('/login', request.url);
        // Optional: Add a redirect parameter to return here after login
        // url.searchParams.set('redirect', pathname);
        return NextResponse.redirect(url);
    }

    // 2. Redirect authenticated users away from auth pages to dashboard
    if (isAuthenticated && authRoutes.some(route => pathname.startsWith(route))) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
}

// See "Matcher" below to learn more
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
