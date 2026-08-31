import { prisma } from "@/lib/db";
import { obtenerSesion } from "@/lib/auth/session";
import { ApiError, errorResponse } from "@/lib/errors";

// TASK-019 — FR-017, BR-012 (solo lectura)
export async function GET(request: Request) {
  try {
    const sesion = await obtenerSesion();
    if (!sesion || sesion.rol !== "administrador") {
      throw new ApiError(401, "UNAUTHORIZED", "No autorizado");
    }

    const entidadId = new URL(request.url).searchParams.get("entidadId");
    const registros = await prisma.auditoria.findMany({
      where: entidadId ? { entidadId } : undefined,
      orderBy: { fechaHora: "desc" },
      take: 200,
    });

    return Response.json(registros);
  } catch (error) {
    return errorResponse(error);
  }
}
