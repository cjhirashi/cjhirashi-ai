import { type NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { guestRegex, isDevelopmentEnvironment } from "./lib/constants";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Playwright health check
  if (pathname.startsWith("/ping")) {
    return new Response("pong", { status: 200 });
  }

  // 2. Allow all /api/auth routes (login, register, session)
  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
    secureCookie: !isDevelopmentEnvironment,
  });

  // 3. PUBLIC ROUTES: Allow without authentication
  const publicRoutes = ["/"];
  const authRoutes = ["/login", "/register"];

  if (publicRoutes.includes(pathname) || authRoutes.includes(pathname)) {
    // Already authenticated? Handle based on user type
    if (token && authRoutes.includes(pathname)) {
      const isGuest = guestRegex.test(token?.email ?? "");

      if (isGuest) {
        // Guest users: redirect from /login to /register to complete registration
        if (pathname === "/login") {
          return NextResponse.redirect(new URL("/register?message=Please complete your registration", request.url));
        }
        // Allow guests to access /register
        return NextResponse.next();
      } else {
        // Registered users: redirect away from auth pages to dashboard
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }

    return NextResponse.next();
  }

  // 4. DASHBOARD ROUTES: Require registered user authentication
  if (pathname.startsWith("/dashboard")) {
    // No session? → Login with return URL
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("returnUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Session exists but is guest? → Force registration
    const isGuest = guestRegex.test(token?.email ?? "");
    if (isGuest) {
      const registerUrl = new URL("/register", request.url);
      registerUrl.searchParams.set(
        "message",
        "Please register to access the dashboard"
      );
      return NextResponse.redirect(registerUrl);
    }

    // Registered user → Allow access
    return NextResponse.next();
  }

  // 5. API ROUTES: Require authentication
  if (pathname.startsWith("/api/")) {
    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Check if guest trying to access protected endpoints
    const isGuest = guestRegex.test(token?.email ?? "");
    const guestRestrictedEndpoints = ["/api/document", "/api/files/upload"];

    if (
      isGuest &&
      guestRestrictedEndpoints.some((ep) => pathname.startsWith(ep))
    ) {
      return NextResponse.json(
        { error: "This feature requires a registered account" },
        { status: 403 }
      );
    }

    return NextResponse.next();
  }

  // 6. LEGACY ROUTES: Handle backward compatibility
  if (pathname === "/chat") {
    return NextResponse.redirect(new URL("/dashboard/chat", request.url));
  }

  if (pathname.startsWith("/chat/")) {
    const chatId = pathname.replace("/chat/", "");
    return NextResponse.redirect(
      new URL(`/dashboard/chat/${chatId}`, request.url)
    );
  }

  // 7. Default: Allow (for static assets, etc.)
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/dashboard/:path*",
    "/chat/:path*", // Legacy route handling
    "/api/:path*",
    "/login",
    "/register",
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
