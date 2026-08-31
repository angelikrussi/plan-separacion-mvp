import { prisma } from "@/lib/db";
import { obtenerSesion } from "@/lib/auth/session";
import { registrarAuditoria } from "@/lib/auditoria";
import { liberarProductoSiCorresponde } from "@/lib/planes/liberar";
import { ApiError, errorResponse } from "@/lib/errors";

// TASK-014 — FR-012, BR-005, BR-006, AC-007, AC-010
export async function POST(_request: Request, { params }: { params: { id: string } }) {
  try {
    const sesion = await obtenerSesion();
    if (!sesion || sesion.rol !== "administrador") {
      throw new ApiError(401, "UNAUTHORIZED", "No autorizado");
    }

    const resultado = await prisma.$transaction(async (tx) => {
      const abono = await tx.abono.findUnique({ where: { id: params.id } });
      if (!abono) throw new ApiError(404, "PAYMENT_NOT_FOUND", "Abono no encontrado");
      if (abono.estado !== "EN_REVISION") {
        throw new ApiError(409, "INVALID_STATE", "El abono no está en revisión");
      }
      if (abono.revisadoPor !== sesion.sub) {
        throw new ApiError(403, "NOT_REVIEWER", "Solo quien lo tiene en revisión puede aprobarlo");
      }

      const abonoActualizado = await tx.abono.update({
        where: { id: params.id },
        data: { estado: "APROBADO", administradorId: sesion.sub, fechaResolucion: new Date() },
      });

      const planAnterior = await tx.plan.findUniqueOrThrow({ where: { id: abono.planId } });
      const planActualizado = await tx.plan.update({
        where: { id: abono.planId },
        data: {
          totalPagado: { increment: abono.valor },
          saldoPendiente: { decrement: abono.valor },
        },
      });

      const planFinal = await liberarProductoSiCorresponde(tx, abono.planId, sesion.sub);

      await registrarAuditoria(
        {
          entidad: "Abono",
          entidadId: abono.id,
          accion: "APROBAR_PAGO",
          actor: sesion.sub,
          valoresAnteriores: { estado: "EN_REVISION", saldoPendiente: planAnterior.saldoPendiente },
          valoresNuevos: { estado: "APROBADO", saldoPendiente: planActualizado.saldoPendiente },
        },
        tx
      );

      return { abono: abonoActualizado, plan: planFinal ?? planActualizado };
    });

    return Response.json(resultado);
  } catch (error) {
    return errorResponse(error);
  }
}
