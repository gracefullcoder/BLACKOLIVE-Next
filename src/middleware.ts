import { isAuthenticatedMiddleware, isAuthenticatedConfig, isAdminMiddleware, isAdminConfig, isDeliveryMiddleware, isDeliveryConfig } from '@/src/middlewares/authMiddleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
export const config = {
    matcher: [
        ...isAuthenticatedConfig.matcher,
        ...isAdminConfig.matcher,
        ...isDeliveryConfig.matcher
    ],
};

export function middleware(request: NextRequest) {

    if (request.nextUrl.pathname.startsWith('/user')) {
        return isAuthenticatedMiddleware(request);
    }

    if (request.nextUrl.pathname.startsWith('/admin')) {
        return isAdminMiddleware(request);
    }

    if (request.nextUrl.pathname.startsWith('/delivery')) {
        return isDeliveryMiddleware(request);
    }

    return NextResponse.next();
}
