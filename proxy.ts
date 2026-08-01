import { NextRequest, NextResponse } from "next/server";
import { jwtUtils } from "./utils/jwt";
import { getNewAccessToken } from "./service/refreshToken";

const AUTH_ROUTES = ["/auth/login", "/auth/register"];
const PUBLIC_ROUTES = ["/", "/properties"];

export async function proxy(request: NextRequest) {
    const pathname = request.nextUrl.pathname;


    const isPublicRoute = PUBLIC_ROUTES.some((route) => pathname === route || pathname.startsWith(route + "/"));
    const isAuthRoute = AUTH_ROUTES.some((route) => pathname === route || pathname.startsWith(route + "/"));

    if (isPublicRoute) {
        return NextResponse.next();
    }

    let accessToken = request.cookies.get("accessToken")?.value;
    const refreshToken = request.cookies.get("refreshToken")?.value;

    let decodedAccessToken = accessToken
        ? jwtUtils.verifyToken(
            accessToken,
            process.env.JWT_ACCESS_TOKEN_SECRET!
        )
        : null;


    if (!decodedAccessToken?.success && refreshToken) {
        const decodedRefreshToken = jwtUtils.verifyToken(
            refreshToken,
            process.env.JWT_REFRESH_TOKEN_SECRET!
        );

        if (decodedRefreshToken.success) {
            const result = await getNewAccessToken();

            if (result?.success) {
                accessToken = result.data?.accessToken;

                decodedAccessToken = jwtUtils.verifyToken(
                    accessToken as string,
                    process.env.JWT_ACCESS_TOKEN_SECRET!
                );

                const response = NextResponse.next();

                response.cookies.set(
                    "accessToken",
                    result.data.accessToken,
                    {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === "production",
                        sameSite: "lax",
                        maxAge: 60 * 60 * 24,
                        path: "/",
                    }
                );
                // Continue request with refreshed cookie
                if (decodedAccessToken.success) {
                    const role = decodedAccessToken.data?.role;

                    if (
                        pathname.startsWith("/dashboard/admin") &&
                        role !== "ADMIN"
                    ) {
                        return NextResponse.redirect(
                            new URL("/not-found", request.url)
                        );
                    }

                    if (
                        pathname.startsWith("/dashboard/tenant") &&
                        role !== "TENANT"
                    ) {
                        return NextResponse.redirect(
                            new URL("/not-found", request.url)
                        );
                    }

                    if (
                        pathname.startsWith("/dashboard/landlord") &&
                        role !== "LANDLORD"
                    ) {
                        return NextResponse.redirect(
                            new URL("/not-found", request.url)
                        );
                    }

                    return response;
                }
            }
        }
    }

    if (!decodedAccessToken?.success) {
        if (isAuthRoute) {
            return NextResponse.next();
        }

        return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    const role = decodedAccessToken.data?.role;

    if (isAuthRoute) {
        return NextResponse.redirect(new URL(`/dashboard/${role.toLowerCase()}`, request.url));
    }


    if (pathname.startsWith("/dashboard/admin") && role !== "ADMIN") {
        return NextResponse.redirect(new URL("/not-found", request.url));
    }

    if (pathname.startsWith("/dashboard/tenant") && role !== "TENANT") {
        return NextResponse.redirect(new URL("/not-found", request.url));
    }

    if (pathname.startsWith("/dashboard/landlord") && role !== "LANDLORD") {
        return NextResponse.redirect(
            new URL("/not-found", request.url)
        );
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|webp)$).*)",
    ],
};