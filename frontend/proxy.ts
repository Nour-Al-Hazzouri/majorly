import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const authRoutes = ['/login', '/register', '/forgot-password', '/reset-password'];
const publicMarketingRoutes = ['/', '/about'];

// Next.js 16 Proxy: Traffic routing and optimistic navigation guards
export default function proxy(request: NextRequest) {
    const { nextUrl, cookies } = request;
    const isAuthenticated = cookies.get('is_authenticated')?.value === 'true';
    const path = nextUrl.pathname;

    // 1. Authorized Users: Prevent access to Auth routes (Home remains restricted to move them to Dashboard)
    if (isAuthenticated) {
        if (path === '/' || authRoutes.includes(path)) {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }
    }

    // 2. Unauthorized Users: Redirect from protected routes to landing page
    if (!isAuthenticated) {
        const isAllowedPath = publicMarketingRoutes.includes(path) || authRoutes.includes(path);

        if (!isAllowedPath) {
            return NextResponse.redirect(new URL('/', request.url));
        }
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
