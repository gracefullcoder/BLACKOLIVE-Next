// // middleware.js
// import { isAuthenticatedMiddleware, isAuthenticatedConfig, isAdminMiddleware, isAdminConfig } from '@/src/middleware/authMiddleware';
// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';
// export const config = {
//     matcher: [
//         "/admin/**"
//     ],
// };

// export function middleware(request: NextRequest) {
//     console.log('Admin Middleware Invoked:', request.nextUrl.pathname);
    
//     if (request.nextUrl.pathname.startsWith('/api/auth')) {
//         return isAuthenticatedMiddleware(request);
//     }
    
//     if (request.nextUrl.pathname.startsWith('/admin')) {
//         return isAdminMiddleware(request);
//     }

//     return NextResponse.next();
// }
