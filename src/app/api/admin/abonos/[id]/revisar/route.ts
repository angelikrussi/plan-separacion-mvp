import { obtenerSesion } from "@/lib/auth/session";
import { revisarAbono } from "@/lib/pagos/revisar";
import { ApiError, errorResponse } from "@/lib/errors";

// TASK-013 — FR-011, EF-003, AC-006, ADR-003 (bloqueo optimista)
export async function POST(_request: Request, { params }: { params: { id: string } }) {
  try {
    const sesion = await obtenerSesion();
    if (!sesion || sesion.rol !== "administrador") {
      throw new ApiError(401, "UNAUTHORIZED", "No autorizado");
    }
    const abono = await revisarAbono(params.id, sesion.sub);
    return Response.json(abono);
  } catch (error) {
    return errorResponse(error);
  }
}
