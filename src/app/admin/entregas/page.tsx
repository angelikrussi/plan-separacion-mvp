import { prisma } from "@/lib/db";
import { AdminShell } from "@/components/admin/AdminShell";
import { MarcarEntregadoButton } from "./MarcarEntregadoButton";

export const dynamic = "force-dynamic";

export default async function AdminEntregasPage() {
  const entregas = await prisma.entrega.findMany({
    where: { estadoEntrega: { not: "ENTREGADO" } },
    include: { plan: { include: { cliente: true, producto: true } } },
  });

  return (
    <AdminShell title="Entregas pendientes">
      <div className="flex flex-col gap-3 max-w-2xl">
        {entregas.map((e) => (
          <div key={e.id} className="rounded-lg border bg-white p-4 flex flex-col gap-1 text-sm">
            <span className="font-medium">{e.plan.cliente.nombreCompleto}</span>
            <span className="text-gray-600">{e.plan.producto.nombre}</span>
            <span className="text-xs text-gray-400">
              {e.tipo === "recogida" ? "Recogida en punto autorizado" : `Envío a ${e.ciudad} — ${e.direccion}`}
            </span>
            <MarcarEntregadoButton entregaId={e.id} />
          </div>
        ))}
        {entregas.length === 0 && <p className="text-gray-500 text-sm">No hay entregas pendientes.</p>}
      </div>
    </AdminShell>
  );
}
