import { NextRequest, NextResponse } from "next/server";
import { jwtUtils } from "./utils/jwt";
import { getNewAccessToken } from "./service/refreshToken";

const AUTH_ROUTES = ["/auth/login", "/auth/register"];
const PUBLIC_ROUTES = ["/", "/properties"];

type Role = "ADMIN" | "TENANT" | "LANDLORD";

function isPublicRoute(pathname: string) {
    return PUBLIC_ROUTES.some(
        (route) => pathname === route || pathname.startsWith(route + "/")
    );
}

function isAuthRoute(pathname: string) {
    return AUTH_ROUTES.some(
        (route) => pathname === route || pathname.startsWith(route + "/")
    );
}

function isRoleAllowed(pathname: string, role?: Role) {
    if (pathname.startsWith("/dashboard/admin") && role !== "ADMIN") return false;
    if (pathname.startsWith("/dashboard/tenant") && role !== "TENANT") return false;
    if (pathname.startsWith("/dashboard/landlord") && role !== "LANDLORD") return false;
    return true;
}

export async function proxy(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    if (isPublicRoute(pathname)) {
        return NextResponse.next();
    }

    let accessToken = request.cookies.get("accessToken")?.value;
    const refreshToken = request.cookies.get("refreshToken")?.value;

    let decoded = accessToken
        ? jwtUtils.verifyToken(accessToken, process.env.JWT_ACCESS_TOKEN_SECRET!)
        : null;

    // Access token missing/invalid but we have a refresh token — try to refresh.
    if (!decoded?.success && refreshToken) {
        const decodedRefresh = jwtUtils.verifyToken(
            refreshToken,
            process.env.JWT_REFRESH_TOKEN_SECRET!
        );

        if (decodedRefresh.success) {
            const result = await getNewAccessToken();

            if (result?.success && result.data?.accessToken) {
                accessToken = result.data.accessToken;
                decoded = jwtUtils.verifyToken(
                    accessToken,
                    process.env.JWT_ACCESS_TOKEN_SECRET!
                );

                if (decoded.success) {
                    const role = decoded.data?.role as Role | undefined;

                    if (!isRoleAllowed(pathname, role)) {
                        return NextResponse.redirect(new URL("/not-found", request.url));
                    }

                    const response = NextResponse.next();
                    response.cookies.set("accessToken", result.data.accessToken, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === "production",
                        sameSite: "lax",
                        maxAge: 60 * 60 * 24,
                        path: "/",
                    }
                    );
                    return response;
                }
            }
        }
    }

    // No valid session at this point (refresh failed or wasn't attempted).
    if (!decoded?.success) {
        if (isAuthRoute(pathname)) {
            return NextResponse.next();
        }
        return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    const role = decoded.data?.role as Role | undefined;

    if (isAuthRoute(pathname)) {
        // Already logged in — bounce away from login/register.
        if (!role) {
            return NextResponse.redirect(new URL("/auth/login", request.url));
        }
        return NextResponse.redirect(
            new URL(`/dashboard/${role.toLowerCase()}`, request.url)
        );
    }

    if (!isRoleAllowed(pathname, role)) {
        return NextResponse.redirect(new URL("/not-found", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico|woff|woff2|ttf)$).*)",
    ],
};