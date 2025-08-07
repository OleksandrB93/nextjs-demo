export { auth as middleware } from "@/auth";

export const config = {
  matcher: [
    // Protected routes - require authentication
    "/",
    "/dashboard/:path*",
    "/profile/:path*",
    // Main page also protected
    "/((?!api|auth|_next/static|_next/image|favicon.ico|signin|signup).*)",
  ],
};
