import { prisma } from "@/lib/db";
import { verifyPassword } from "@/lib/auth/password";
import { crearSesion } from "@/lib/auth/session";
import { ApiError, errorResponse } from "@/lib/errors";

// ADR-002 — sin 2FA para administrador en el MVP.
export async function POST(request: Request) {
  try {
    const { usuario, password } = (await request.json()) ?? {};
    if (!usuario || !password) {
      throw new ApiError(400, "VALIDATION_ERROR", "Usuario y contraseña son obligatorios");
    }

    const admin = await prisma.administrador.findUnique({ where: { usuario } });
    const passwordValida = admin ? await verifyPassword(password, admin.passwordHash) : false;

    if (!admin || !passwordValida) {
      throw new ApiError(401, "INVALID_CREDENTIALS", "Usuario o contraseña incorrectos");
    }

    await crearSesion({ sub: admin.id, rol: "administrador" });
    return Response.json({ session: { rol: "administrador" } });
  } catch (error) {
    return errorResponse(error);
  }
}
