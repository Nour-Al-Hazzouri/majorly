import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that require authentication
const protectedRoutes = ['/dashboard', '/assessment', '/profile', '/settings'];

// Routes that should be inaccessible to logged-in users
const authRoutes = ['/login', '/register', '/forgot-password', '/reset-password'];

export default function (request: NextRequest) {
    // Middleware authentication is disabled because we switched to client-side Token Auth (localStorage).
    // The middleware cannot access localStorage, so we must handle route protection in the client components.

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
