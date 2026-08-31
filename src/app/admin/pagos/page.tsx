import Link from "next/link";
import { prisma } from "@/lib/db";
import { AdminShell } from "@/components/admin/AdminShell";

export const dynamic = "force-dynamic";

export default async function AdminPagosPage() {
  const abonos = await prisma.abono.findMany({
    where: { estado: { in: ["PENDIENTE", "EN_REVISION"] } },
    include: { plan: { include: { cliente: true, producto: true } } },
    orderBy: { fecha: "asc" },
  });

  return (
    <AdminShell title="Pagos por verificar">
      <div className="flex flex-col gap-3 max-w-2xl">
        {abonos.map((a) => (
          <Link key={a.id} href={`/admin/pagos/${a.id}`} className="rounded-lg border bg-white p-4 flex flex-col gap-1">
            <div className="flex justify-between">
              <span className="font-medium">{a.plan.cliente.nombreCompleto}</span>
              <span className="text-xs rounded-full bg-gray-100 px-2 py-1">{a.estado}</span>
            </div>
            <span className="text-sm text-gray-600">{a.plan.producto.nombre}</span>
            <div className="flex justify-between text-sm">
              <span>${a.valor.toLocaleString("es-CO")}</span>
              <span className="text-gray-500">{a.metodoPago}</span>
            </div>
          </Link>
        ))}
        {abonos.length === 0 && <p className="text-gray-500 text-sm">No hay pagos pendientes por revisar.</p>}
      </div>
    </AdminShell>
  );
}
