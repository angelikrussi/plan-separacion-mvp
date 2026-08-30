import Link from "next/link";
import { prisma } from "@/lib/db";
import { AppShell } from "@/components/AppShell";
import { LogoutButton } from "@/components/LogoutButton";

export const dynamic = "force-dynamic";

export default async function AdminPagosPage() {
  const abonos = await prisma.abono.findMany({
    where: { estado: { in: ["PENDIENTE", "EN_REVISION"] } },
    include: { plan: { include: { cliente: true, producto: true } } },
    orderBy: { fecha: "asc" },
  });

  return (
    <AppShell title="Pagos por verificar">
      <main className="flex flex-col gap-3 p-4">
        <div className="flex justify-between text-sm">
          <Link href="/admin/entregas" className="text-brand">Entregas pendientes →</Link>
          <Link href="/admin/auditoria" className="text-brand">Ver auditoría →</Link>
        </div>

        {abonos.map((a) => (
          <Link key={a.id} href={`/admin/pagos/${a.id}`} className="rounded-lg border p-4 flex flex-col gap-1">
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

        <LogoutButton redirectTo="/admin/login" />
      </main>
    </AppShell>
  );
}
