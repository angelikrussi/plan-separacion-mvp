import { NextRequest, NextResponse } from "next/server";
import { verificarSesionEdge, SESSION_COOKIE_NAME } from "@/lib/auth/session";

// TASK-022 — protección de rutas por sesión y rol.
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }
  const isAdminRoute = pathname.startsWith("/admin") || pathname.startsWith("/api/admin");
  const isClienteRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/perfil") ||
    pathname.startsWith("/planes") ||
    pathname.startsWith("/api/planes") ||
    pathname.startsWith("/api/clientes");

  if (!isAdminRoute && !isClienteRoute) {
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = await verificarSesionEdge(token);

  if (isAdminRoute) {
    if (!session || session.rol !== "administrador") {
      return denegar(request, pathname);
    }
  } else if (isClienteRoute) {
    if (!session || session.rol !== "cliente") {
      return denegar(request, pathname);
    }
  }

  return NextResponse.next();
}

function denegar(request: NextRequest, pathname: string) {
  if (pathname.startsWith("/api")) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "No autorizado" } },
      { status: 401 }
    );
  }
  const loginUrl = pathname.startsWith("/admin") ? "/admin/login" : "/login";
  return NextResponse.redirect(new URL(loginUrl, request.url));
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
    "/dashboard/:path*",
    "/perfil/:path*",
    "/planes/:path*",
    "/api/planes/:path*",
    "/api/clientes/:path*",
  ],
};
