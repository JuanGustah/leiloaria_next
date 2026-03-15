import { NextRequest, NextResponse } from "next/server";
import { ADMIN_EMAIL, getPostAuthRedirectPath } from "@/lib/auth/access";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const email = request.cookies.get("auth_email")?.value;
  const pathname = request.nextUrl.pathname;

  // Se tem token e está na home, redireciona para dashboard correto
  if (token && pathname === "/") {
    const redirectPath = getPostAuthRedirectPath({ email });
    return NextResponse.redirect(new URL(redirectPath, request.url));
  }

  // Se não tem token e tenta acessar dashboard protegido, redireciona para login
  if (!token && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // Se não tem token e tenta acessar admin, redireciona para login
  if (!token && pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard/:path*", "/admin/:path*"],
};
