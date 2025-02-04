import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export const isAuthenticatedConfig = {
    matcher: ['/api/auth/:function*', '/user/:function*']
};

export async function isAuthenticatedMiddleware(request: NextRequest) {
    const token = await getToken({ req: request });

    if (!token) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
}

export const isAdminConfig = {
    matcher: ['/admin/:function*'],
};

export async function isAdminMiddleware(request: NextRequest) {
    const token = await getToken({ req: request });

    if (!token) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    if (!token.isAdmin) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
}

export const isDeliveryConfig = {
    matcher: ['/delivery/:function*'],
};

export async function isDeliveryMiddleware(request: NextRequest) {
    const token = await getToken({ req: request });

    if (!token) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    if (!token.isDelivery) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
}
