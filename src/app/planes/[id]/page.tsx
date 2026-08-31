import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { obtenerSesion } from "@/lib/auth/session";
import { AppShell } from "@/components/AppShell";

export const dynamic = "force-dynamic";

const ESTADO_LABEL: Record<string, string> = {
  PENDIENTE: "Pendiente de revisión",
  EN_REVISION: "En revisión",
  APROBADO: "Aprobado",
  RECHAZADO: "Rechazado",
};

export default async function PlanDetallePage({ params }: { params: { id: string } }) {
  const sesion = await obtenerSesion();
  const plan = await prisma.plan.findUnique({
    where: { id: params.id },
    include: { producto: true, abonos: { orderBy: { fecha: "desc" } }, entrega: true },
  });
  if (!plan) notFound();
  if (plan.clienteId !== sesion!.sub) redirect("/dashboard");

  const progreso = plan.valorTotal > 0 ? Math.round((plan.totalPagado / plan.valorTotal) * 100) : 0;
  const proximoAbono = Math.min(plan.saldoPendiente, Math.ceil(plan.valorTotal / plan.numeroCuotas));

  return (
    <AppShell title={plan.producto.nombre} back="/dashboard">
      <main className="flex flex-col gap-4 p-4">
        <div className="rounded-lg border p-4 flex flex-col gap-2">
          <span className="text-xs rounded-full bg-gray-100 px-2 py-1 self-start">{plan.estado}</span>
          <div className="text-sm text-gray-600">Valor total: ${plan.valorTotal.toLocaleString("es-CO")}</div>
          <div className="text-sm text-gray-600">Pagado: ${plan.totalPagado.toLocaleString("es-CO")}</div>
          <div className="text-sm font-semibold">Saldo pendiente: ${plan.saldoPendiente.toLocaleString("es-CO")}</div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div className="bg-brand h-2 rounded-full" style={{ width: `${progreso}%` }} />
          </div>
          <span className="text-xs text-gray-400">{progreso}% completado</span>
          {plan.estado === "ACTIVO" && (
            <span className="text-xs text-gray-500">Próximo abono sugerido: ${proximoAbono.toLocaleString("es-CO")}</span>
          )}
        </div>

        {plan.estado === "ACTIVO" && (
          <Link href={`/planes/${plan.id}/abonar`} className="rounded-lg bg-cta hover:bg-cta-hover px-4 py-3 text-center text-white font-medium">
            Realizar un abono
          </Link>
        )}

        {plan.estado === "PENDIENTE_DE_ENTREGA" && !plan.entrega && (
          <Link href={`/planes/${plan.id}/entrega`} className="rounded-lg bg-cta hover:bg-cta-hover px-4 py-3 text-center text-white font-medium">
            🎉 Producto pagado — registrar entrega
          </Link>
        )}

        {plan.entrega && (
          <div className="rounded-lg border p-4 text-sm">
            <p className="font-semibold mb-1">Entrega</p>
            <p>Tipo: {plan.entrega.tipo}</p>
            <p>Estado: {plan.entrega.estadoEntrega}</p>
          </div>
        )}

        <Link href={`/planes/${plan.id}/historial`} className="text-center text-sm text-brand">
          Ver historial completo
        </Link>

        <div className="flex flex-col gap-2">
          <h2 className="font-semibold text-sm">Abonos recientes</h2>
          {plan.abonos.slice(0, 5).map((a) => (
            <div key={a.id} className="rounded border p-3 flex justify-between text-sm">
              <span>{new Date(a.fecha).toLocaleDateString("es-CO")}</span>
              <span>${a.valor.toLocaleString("es-CO")}</span>
              <span className="text-gray-500">{ESTADO_LABEL[a.estado] ?? a.estado}</span>
            </div>
          ))}
          {plan.abonos.length === 0 && <p className="text-sm text-gray-400">Sin abonos todavía.</p>}
        </div>
      </main>
    </AppShell>
  );
}
