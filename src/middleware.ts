import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
export { default } from "next-auth/middleware";

export async function middleware(request: NextRequest) {
    const token = await getToken({
        req: request,
        secret: process.env.NEXT_AUTH_SECRET,
    });
    const path = request.nextUrl.pathname;

    if (
        (token && path.startsWith("/sign-in")) ||
        path.startsWith("/sign-up") ||
        path.startsWith("/verify")
    ) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    if (!token && path.startsWith("/dashboard")) {
        return NextResponse.redirect(new URL("/sign-in", request.url));
    }
}

export const config = {
    matcher: [
        "/",
        "/sign-in",
        "/sign-up",
        "/dashboard/:path*",
        "/verify/:path*",
    ],
};
