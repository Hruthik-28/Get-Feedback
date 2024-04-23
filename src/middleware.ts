import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
export { default } from "next-auth/middleware";

export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request });
    const path = request.nextUrl.pathname;

    const isPublicPath = path === "/sign-in" || path === "/sign-up" || path === "/verify";

    if (token && isPublicPath) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    if (!token && !isPublicPath) {
        return NextResponse.redirect(new URL("/sign-in", request.url));
    }
}

export const config = {
    matcher: ["/", "/sign-in", "/sign-up", "/dashboard", "/verify"],
};
