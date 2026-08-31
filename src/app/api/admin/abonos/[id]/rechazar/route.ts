import { prisma } from "@/lib/db";
import { obtenerSesion } from "@/lib/auth/session";
import { registrarAuditoria } from "@/lib/auditoria";
import { ApiError, errorResponse } from "@/lib/errors";

// TASK-015 — FR-013, BR-004, BR-006, AC-008
export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const sesion = await obtenerSesion();
    if (!sesion || sesion.rol !== "administrador") {
      throw new ApiError(401, "UNAUTHORIZED", "No autorizado");
    }

    const { motivo } = (await request.json()) ?? {};
    if (!motivo) throw new ApiError(400, "VALIDATION_ERROR", "El motivo es obligatorio");

    const abono = await prisma.abono.findUnique({ where: { id: params.id } });
    if (!abono) throw new ApiError(404, "PAYMENT_NOT_FOUND", "Abono no encontrado");
    if (abono.estado !== "EN_REVISION") throw new ApiError(409, "INVALID_STATE", "El abono no está en revisión");
    if (abono.revisadoPor !== sesion.sub) {
      throw new ApiError(403, "NOT_REVIEWER", "Solo quien lo tiene en revisión puede rechazarlo");
    }

    const actualizado = await prisma.abono.update({
      where: { id: params.id },
      data: {
        estado: "RECHAZADO",
        motivoRechazo: motivo,
        administradorId: sesion.sub,
        fechaResolucion: new Date(),
      },
    });

    await registrarAuditoria({
      entidad: "Abono",
      entidadId: abono.id,
      accion: "RECHAZAR_PAGO",
      actor: sesion.sub,
      valoresAnteriores: { estado: "EN_REVISION" },
      valoresNuevos: { estado: "RECHAZADO", motivo },
    });

    return Response.json(actualizado);
  } catch (error) {
    return errorResponse(error);
  }
}
