// import { cookies } from 'next/headers';
import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { jwtUtils } from './utils/jwt';

const AUTH_ROUTES = ['/auth/login', '/auth/register'];
const PUBLIC_ROUTES = ['/', '/properties']
export async function proxy(request: NextRequest) {
    const pathName = request.nextUrl.pathname;
    // const cookieStore = await cookies();
    // const accessToken = cookieStore.get('accessToken')?.value;
    const accessToken = request.cookies.get('accessToken')?.value;
    const decodedToken = accessToken ? await jwtUtils.verifyToken(accessToken, process.env.JWT_ACCESS_TOKEN_SECRET as string) as JwtPayload : null;
    let userRole = null;
    if (decodedToken) {
        userRole = decodedToken.role
    }
    if (accessToken && AUTH_ROUTES.includes(pathName)) {
        return NextResponse.redirect(new URL(`/dashboard/${userRole.toLowerCase()}`, request.url));
    }

    const isPublicRoute = PUBLIC_ROUTES.some((route) => pathName === route || pathName.startsWith(route + "/"));
    const isAuthRoute = AUTH_ROUTES.some((route) => pathName === route || pathName.startsWith(route + "/"));
    if (!accessToken && !isPublicRoute && !isAuthRoute) {
        return NextResponse.redirect(new URL(`/auth/login`, request.url));
    }

    if (pathName.startsWith('/dashboard/tenant') && userRole !== 'TENANT') {
        return NextResponse.redirect(new URL('/not-found', request.url));
    }
    else if (pathName.startsWith('/dashboard/admin') && userRole !== 'ADMIN') {
        return NextResponse.redirect(new URL('/not-found', request.url));
    }
    else if (pathName.startsWith('/dashboard/landlord') && userRole !== 'LANDLORD') {
        return NextResponse.redirect(new URL('/not-found', request.url));
    }
    return NextResponse.next();
}

// Alternatively, you can use a default export:
// export default function proxy(request: NextRequest) { ... }

export const config = {
    matcher: '/((?!api|_next/static|favicon.ico|_next/image|.*\\.png$).*)',
}