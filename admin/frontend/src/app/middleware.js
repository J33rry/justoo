import { NextResponse } from "next/server";

export function middleware(request) {
    const { pathname } = request.nextUrl;

    // Get token from cookies
    const token = request.cookies.get("auth_token")?.value;

    // Define protected and auth routes
    const isAuthRoute = pathname.startsWith("/signIn") || pathname === "/";
    const isProtectedRoute = pathname.startsWith("/dashboard");

    // If user is authenticated
    if (token) {
        // Redirect authenticated users away from auth pages
        if (isAuthRoute && pathname === "/dashboard") {
            // console.log(
            //     `[Middleware] Redirecting authenticated user from ${pathname} to /dashboard`
            // );
            return NextResponse.redirect(new URL("/dashboard", request.url));
        }
    } else {
        // If user is not authenticated
        if (isProtectedRoute) {
            return NextResponse.redirect(new URL("/signIn", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        "/signIn",
        "/dashboard",
        "/",
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
    ],
};
