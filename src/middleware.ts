import { auth } from "@/auth";
import { NextResponse, userAgent } from "next/server";
import type { NextRequest } from "next/server";
import requestIp from "request-ip";
import { parseUserAgent } from "@/utils/user-agent";

export default auth((req) => {
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

  return response;
});

export const config = {
  matcher: [
    // Protected routes - require authentication
    "/",
    "/dashboard/:path*",
    "/profile/:path*",
    // Main page also protected
    "/((?!api|auth|_next/static|_next/image|favicon.ico|signin|signup|.*\\.).*)",
  ],
};
