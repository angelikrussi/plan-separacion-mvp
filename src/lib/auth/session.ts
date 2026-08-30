import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

// TASK-004/TASK-022 — sesión propia vía cookie firmada (jose funciona en
// Edge runtime, necesario para src/middleware.ts). Sustituye a NextAuth
// para poder controlar el flujo de login en dos pasos (password + TOTP).

const SECRET = new TextEncoder().encode(process.env.SESSION_SECRET ?? "dev-secret");
const SESSION_COOKIE = "principal_session";
const LOGIN_TOKEN_COOKIE = "principal_login_token";

export type SessionPayload = {
  sub: string; // id de cliente o administrador
  rol: "cliente" | "administrador";
};

export async function crearSesion(payload: SessionPayload) {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("2h")
    .sign(SECRET);

  cookies().set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 2,
  });
}

export async function obtenerSesion(): Promise<SessionPayload | null> {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export function cerrarSesion() {
  cookies().delete(SESSION_COOKIE);
}

// Login token de corto plazo: emitido tras validar password, antes del TOTP.
export async function crearLoginToken(clienteId: string) {
  const token = await new SignJWT({ sub: clienteId, paso: "totp-pendiente" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("5m")
    .sign(SECRET);

  cookies().set(LOGIN_TOKEN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 5,
  });
  return token;
}

export async function verificarLoginToken(): Promise<{ sub: string } | null> {
  const token = cookies().get(LOGIN_TOKEN_COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, SECRET);
    if (payload.paso !== "totp-pendiente") return null;
    return { sub: payload.sub as string };
  } catch {
    return null;
  }
}

export function limpiarLoginToken() {
  cookies().delete(LOGIN_TOKEN_COOKIE);
}

export async function verificarSesionEdge(token: string | undefined) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export const SESSION_COOKIE_NAME = SESSION_COOKIE;
