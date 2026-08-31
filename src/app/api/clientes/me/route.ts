import { prisma } from "@/lib/db";
import { obtenerSesion } from "@/lib/auth/session";
import { ApiError, errorResponse } from "@/lib/errors";

// TASK-005 — FR-003
export async function GET() {
  try {
    const sesion = await obtenerSesion();
    if (!sesion || sesion.rol !== "cliente") throw new ApiError(401, "UNAUTHORIZED", "No autorizado");

    const cliente = await prisma.cliente.findUniqueOrThrow({ where: { id: sesion.sub } });
    return Response.json({
      id: cliente.id,
      nombreCompleto: cliente.nombreCompleto,
      documentoIdentidad: cliente.documentoIdentidad,
      celular: cliente.celular,
      correo: cliente.correo,
      fechaRegistro: cliente.fechaRegistro,
    });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PATCH(request: Request) {
  try {
    const sesion = await obtenerSesion();
    if (!sesion || sesion.rol !== "cliente") throw new ApiError(401, "UNAUTHORIZED", "No autorizado");

    const { nombreCompleto, celular } = (await request.json()) ?? {};
    const cliente = await prisma.cliente.update({
      where: { id: sesion.sub },
      data: {
        ...(nombreCompleto ? { nombreCompleto } : {}),
        ...(celular ? { celular } : {}),
      },
    });

    return Response.json({ id: cliente.id, nombreCompleto: cliente.nombreCompleto, celular: cliente.celular });
  } catch (error) {
    return errorResponse(error);
  }
}
