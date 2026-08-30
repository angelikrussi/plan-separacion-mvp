import { prisma } from "@/lib/db";
import type { Prisma } from "@prisma/client";

type Cliente = typeof prisma | Prisma.TransactionClient;

// TASK-019 / BR-012: registro append-only, sin update/delete expuestos.
// Acepta un cliente de transacción opcional para que el registro de
// auditoría participe en el mismo COMMIT/ROLLBACK que la operación que lo origina.
export async function registrarAuditoria(
  params: {
    entidad: string;
    entidadId: string;
    accion: string;
    actor: string;
    valoresAnteriores?: Record<string, unknown>;
    valoresNuevos?: Record<string, unknown>;
  },
  client: Cliente = prisma
) {
  await client.auditoria.create({
    data: {
      entidad: params.entidad,
      entidadId: params.entidadId,
      accion: params.accion,
      actor: params.actor,
      valoresAnteriores: JSON.stringify(params.valoresAnteriores ?? {}),
      valoresNuevos: JSON.stringify(params.valoresNuevos ?? {}),
    },
  });
}
