import { isAuthenticatedMiddleware, isAuthenticatedConfig, isAdminMiddleware, isAdminConfig } from '@/src/middlewares/authMiddleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
export const config = {
    matcher: [
        ...isAuthenticatedConfig.matcher,
        ...isAdminConfig.matcher
    ],
};

console.log("in")

export function middleware(request: NextRequest) {
    console.log('Middleware Invoked:', request.nextUrl.pathname);

    if (request.nextUrl.pathname.startsWith('/user')) {
        return isAuthenticatedMiddleware(request);
    }

    if (request.nextUrl.pathname.startsWith('/admin')) {
        return isAdminMiddleware(request);
    }

    return NextResponse.next();
}
