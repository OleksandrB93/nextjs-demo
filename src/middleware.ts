import { auth } from "@/auth";
import { NextResponse, userAgent } from "next/server";
import requestIp from "request-ip";
import { parseUserAgent } from "@/utils/user-agent";

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  // Get user data for tracking
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ip = requestIp.getClientIp(req as any);
  const ua = userAgent(req);
  const parsedUA = parseUserAgent(ua.ua || "");

  // Create response with headers
  const response = NextResponse.next();

  response.headers.set("x-user-ip", ip || "unknown");
  response.headers.set("x-user-agent", ua.ua || "unknown");
  response.headers.set("x-user-browser", parsedUA.browser);
  response.headers.set("x-user-os", parsedUA.os);
  response.headers.set("x-user-device", parsedUA.device);

  // If user is not logged in and trying to access protected routes
  if (!isLoggedIn) {
    const signInUrl = new URL("/auth/signin", nextUrl.origin);
    signInUrl.searchParams.set("callbackUrl", nextUrl.pathname);
    return NextResponse.redirect(signInUrl);
  }

  return response;
});

export const config = {
  matcher: [
    // Protected routes - require authentication
    "/",
    "/dashboard/:path*",
    "/profile/:path*",
    // Exclude auth pages, API routes, and static files
    "/((?!api|auth|_next/static|_next/image|favicon.ico|.*\\.).*)",
  ],
};
