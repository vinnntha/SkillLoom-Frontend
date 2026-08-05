import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  // Protected Dashboard Routes
  const isDashboardRoute =
    pathname.startsWith("/siswa") ||
    pathname.startsWith("/umkm") ||
    pathname.startsWith("/admin");

  if (isDashboardRoute && !token) {
    const loginUrl = new URL("/", request.url);
    loginUrl.searchParams.set("auth", "login");
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/siswa/:path*", "/umkm/:path*", "/admin/:path*"],
};
