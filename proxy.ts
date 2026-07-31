import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import { JwtPayload } from 'jsonwebtoken'
import { jwtUtils } from './utils/jwt';
import { getNewAccessToken } from './service/refreshToken';
import { cookies } from 'next/headers';

const AUTH_ROUTES = ['/auth/login', '/auth/register'];
const PUBLIC_ROUTES = ['/', '/properties']
export async function proxy(request: NextRequest) {
    const pathName = request.nextUrl.pathname;
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;
    // const accessToken = request.cookies.get('accessToken')?.value;
    const refreshToken = request.cookies.get('refreshToken')?.value;
    const decodedAccessToken = accessToken ? jwtUtils.verifyToken(accessToken, process.env.JWT_ACCESS_TOKEN_SECRET as string) as JwtPayload : null;
    const decodedRefreshToken = accessToken ? jwtUtils.verifyToken(refreshToken as string, process.env.JWT_REFRESH_TOKEN_SECRET as string) as JwtPayload : null;

    if (!decodedAccessToken?.success && decodedRefreshToken?.success) {
        const result = await getNewAccessToken();
        if (result.success) {
            const newAccessToken = result.data.accessToken;
            cookieStore.set(
                "accessToken",
                newAccessToken,
                {
                    httpOnly: true,
                    secure: false,
                    sameSite: "lax",
                    maxAge: 60 * 60 * 24,
                    path: "/"
                }
            );
        }
    }
    let userRole = null;

    if (!decodedAccessToken?.success) {
        return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    if (decodedAccessToken?.success) {
        userRole = decodedAccessToken?.data.role
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