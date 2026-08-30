import { prisma } from "@/lib/db";
import { verifyPassword } from "@/lib/auth/password";
import { crearLoginToken, crearSesion } from "@/lib/auth/session";
import { generarSecretoTotp, totpUri } from "@/lib/auth/totp";
import { authenticator } from "otplib";
import { ApiError, errorResponse } from "@/lib/errors";

// TASK-004 — FR-002, paso 1: valida credenciales, emite loginToken.
export async function POST(request: Request) {
  try {
    const { correo, password } = (await request.json()) ?? {};
    if (!correo || !password) {
      throw new ApiError(400, "VALIDATION_ERROR", "Correo y contraseña son obligatorios");
    }

    const cliente = await prisma.cliente.findUnique({ where: { correo } });
    const passwordValida = cliente ? await verifyPassword(password, cliente.passwordHash) : false;

    if (!cliente || !passwordValida) {
      throw new ApiError(401, "INVALID_CREDENTIALS", "Correo o contraseña incorrectos");
    }

    // Desactivación temporal de 2FA para navegar el resto de vistas sin fricción.
    // Ver ADR-002 / BR-010 — revertir (borrar este bloque) antes de cualquier despliegue real.
    if (process.env.SKIP_2FA === "true") {
      await crearSesion({ sub: cliente.id, rol: "cliente" });
      return Response.json({ requiereTotp: false, session: { rol: "cliente" } });
    }

    await crearLoginToken(cliente.id);

    if (!cliente.totpHabilitado) {
      const secret = generarSecretoTotp();
      await prisma.cliente.update({ where: { id: cliente.id }, data: { totpSecret: secret } });
      return Response.json({
        requiereTotp: true,
        configurarTotp: true,
        totpUri: totpUri(cliente.correo, secret),
        // Solo en desarrollo: evita depender de una app autenticadora para probar el flujo localmente.
        codigoDev: process.env.NODE_ENV !== "production" ? authenticator.generate(secret) : undefined,
      });
    }

    return Response.json({ requiereTotp: true, configurarTotp: false });
  } catch (error) {
    return errorResponse(error);
  }
}
