import { prisma } from "@/lib/db";
import { obtenerSesion } from "@/lib/auth/session";
import { registrarAuditoria } from "@/lib/auditoria";
import { ApiError, errorResponse } from "@/lib/errors";

// TASK-017 — FR-015, BR-011, AC-011
export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const sesion = await obtenerSesion();
    if (!sesion || sesion.rol !== "administrador") {
      throw new ApiError(401, "UNAUTHORIZED", "No autorizado");
    }

    const { nuevoSaldo, motivo } = (await request.json()) ?? {};
    if (!motivo) throw new ApiError(400, "VALIDATION_ERROR", "El motivo es obligatorio");
    if (typeof nuevoSaldo !== "number" || nuevoSaldo < 0) {
      throw new ApiError(400, "VALIDATION_ERROR", "nuevoSaldo inválido");
    }

    const plan = await prisma.$transaction(async (tx) => {
      const planActual = await tx.plan.findUnique({ where: { id: params.id } });
      if (!planActual) throw new ApiError(404, "PLAN_NOT_FOUND", "Plan no encontrado");

      const actualizado = await tx.plan.update({
        where: { id: params.id },
        data: {
          saldoPendiente: nuevoSaldo,
          totalPagado: planActual.valorTotal - nuevoSaldo,
        },
      });

      await registrarAuditoria(
        {
          entidad: "Plan",
          entidadId: actualizado.id,
          accion: "AJUSTE_MANUAL_SALDO",
          actor: sesion.sub,
          valoresAnteriores: { saldoPendiente: planActual.saldoPendiente },
          valoresNuevos: { saldoPendiente: nuevoSaldo, motivo },
        },
        tx
      );

      return actualizado;
    });

    return Response.json(plan);
  } catch (error) {
    return errorResponse(error);
  }
}
