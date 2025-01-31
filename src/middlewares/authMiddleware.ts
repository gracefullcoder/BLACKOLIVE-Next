import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export const isAuthenticatedConfig = {
    matcher: ['/api/auth/:function*', '/user/:function*']
};

export async function isAuthenticatedMiddleware(request: NextRequest) {
    const token = await getToken({ req: request });

    if (!token) {
        return NextResponse.json(
            { message: 'Unauthorized: Please log in to access this resource.' },
            { status: 401 }
        );
    }

    return NextResponse.next();
}

export const isAdminConfig = {
    matcher: ['/admin/:function*'],
};

export async function isAdminMiddleware(request: NextRequest) {
    const token = await getToken({ req: request });
    console.log("In admin middleware token is ", token)

    if (!token) {
        return NextResponse.json(
            { message: 'Unauthorized: Please log in to access this resource.' },
            { status: 401 }
        );
    }

    if (!token.isAdmin) {
        return NextResponse.json(
            { message: 'Forbidden: You do not have permission to access this resource.' },
            { status: 403 }
        );
    }

    return NextResponse.next();
}

export const isDeliveryConfig = {
    matcher: ['/delivery/:function*'],
};

export async function isDeliveryMiddleware(request: NextRequest) {
    const token = await getToken({ req: request });
    console.log(token)

    if (!token) {
        return NextResponse.json(
            { message: 'Unauthorized: Please log in to access this resource.' },
            { status: 401 }
        );
    }

    if (!token.isDelivery) {
        return NextResponse.json(
            { message: 'Forbidden: You do not have permission to access this resource.' },
            { status: 403 }
        );
    }

    return NextResponse.next();
}
