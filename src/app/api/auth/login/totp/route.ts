import { prisma } from "@/lib/db";
import { verificarLoginToken, crearSesion, limpiarLoginToken } from "@/lib/auth/session";
import { verificarTotp } from "@/lib/auth/totp";
import { ApiError, errorResponse } from "@/lib/errors";

// TASK-004 — FR-002, AC-002, paso 2: valida TOTP y abre sesión.
export async function POST(request: Request) {
  try {
    const { codigo } = (await request.json()) ?? {};
    const loginToken = await verificarLoginToken();
    if (!loginToken) {
      throw new ApiError(401, "LOGIN_EXPIRED", "La sesión de login expiró, inicia de nuevo");
    }
    if (!codigo) {
      throw new ApiError(400, "VALIDATION_ERROR", "Código TOTP requerido");
    }

    const cliente = await prisma.cliente.findUnique({ where: { id: loginToken.sub } });
    if (!cliente || !cliente.totpSecret) {
      throw new ApiError(401, "INVALID_TOTP", "Código incorrecto");
    }

    const valido = verificarTotp(codigo, cliente.totpSecret);
    if (!valido) {
      throw new ApiError(401, "INVALID_TOTP", "Código incorrecto");
    }

    if (!cliente.totpHabilitado) {
      await prisma.cliente.update({ where: { id: cliente.id }, data: { totpHabilitado: true } });
    }

    await crearSesion({ sub: cliente.id, rol: "cliente" });
    limpiarLoginToken();

    return Response.json({ session: { rol: "cliente" } });
  } catch (error) {
    return errorResponse(error);
  }
}
