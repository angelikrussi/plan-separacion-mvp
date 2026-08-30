import { prisma } from "@/lib/db";
import { obtenerSesion } from "@/lib/auth/session";
import { ApiError, errorResponse } from "@/lib/errors";

// TASK-012 — FR-010
export async function GET(request: Request) {
  try {
    const sesion = await obtenerSesion();
    if (!sesion || sesion.rol !== "administrador") {
      throw new ApiError(401, "UNAUTHORIZED", "No autorizado");
    }

    const estado = new URL(request.url).searchParams.get("estado");
    const estados = estado ? [estado] : ["PENDIENTE", "EN_REVISION"];

    const abonos = await prisma.abono.findMany({
      where: { estado: { in: estados } },
      include: { plan: { include: { cliente: true, producto: true } } },
      orderBy: { fecha: "asc" },
    });

    return Response.json(abonos);
  } catch (error) {
    return errorResponse(error);
  }
}
