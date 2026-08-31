import type { Prisma } from "@prisma/client";
import { registrarAuditoria } from "@/lib/auditoria";

// TASK-020 — se invoca dentro de la transacción de aprobar pago (TASK-014).
export async function liberarProductoSiCorresponde(
  tx: Prisma.TransactionClient,
  planId: string,
  actor: string
) {
  const plan = await tx.plan.findUniqueOrThrow({ where: { id: planId } });
  if (plan.saldoPendiente > 0) return plan;

  const actualizado = await tx.plan.update({
    where: { id: planId },
    data: { estado: "PENDIENTE_DE_ENTREGA" },
  });

  await registrarAuditoria(
    {
      entidad: "Plan",
      entidadId: planId,
      accion: "LIBERAR_PRODUCTO",
      actor,
      valoresAnteriores: { estado: plan.estado },
      valoresNuevos: { estado: actualizado.estado },
    },
    tx
  );

  return actualizado;
}
