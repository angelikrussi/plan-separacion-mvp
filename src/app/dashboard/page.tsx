import Link from "next/link";
import { prisma } from "@/lib/db";
import { obtenerSesion } from "@/lib/auth/session";
import { AppShell } from "@/components/AppShell";
import { LogoutButton } from "@/components/LogoutButton";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const sesion = await obtenerSesion();
  const planes = await prisma.plan.findMany({
    where: { clienteId: sesion!.sub },
    include: { producto: true },
    orderBy: { fechaCreacion: "desc" },
  });

  return (
    <AppShell title="Mis planes">
      <main className="flex flex-col gap-4 p-4">
        <div className="flex gap-2">
          <Link href="/catalogo" className="flex-1 rounded-lg bg-cta hover:bg-cta-hover px-4 py-2 text-center text-white text-sm">
            Explorar catálogo
          </Link>
          <Link href="/perfil" className="flex-1 rounded-lg border px-4 py-2 text-center text-sm">
            Mi perfil
          </Link>
        </div>

        {planes.length === 0 && (
          <p className="text-gray-500 text-sm">Todavía no tienes planes. Explora el catálogo para crear uno.</p>
        )}

        {planes.map((plan) => {
          const progreso = plan.valorTotal > 0 ? Math.round((plan.totalPagado / plan.valorTotal) * 100) : 0;
          return (
            <Link key={plan.id} href={`/planes/${plan.id}`} className="rounded-lg border p-4 flex flex-col gap-2">
              <div className="flex justify-between">
                <span className="font-semibold">{plan.producto.nombre}</span>
                <span className="text-xs rounded-full bg-gray-100 px-2 py-1">{plan.estado}</span>
              </div>
              <div className="text-sm text-gray-600">
                Pagado ${plan.totalPagado.toLocaleString("es-CO")} de ${plan.valorTotal.toLocaleString("es-CO")}
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-brand h-2 rounded-full" style={{ width: `${progreso}%` }} />
              </div>
              <span className="text-xs text-gray-400">{progreso}% completado</span>
            </Link>
          );
        })}

        <LogoutButton />
      </main>
    </AppShell>
  );
}
