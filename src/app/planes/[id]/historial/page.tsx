import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { obtenerSesion } from "@/lib/auth/session";
import { AppShell } from "@/components/AppShell";

export const dynamic = "force-dynamic";

const ESTADO_LABEL: Record<string, string> = {
  PENDIENTE: "Pendiente",
  EN_REVISION: "En revisión",
  APROBADO: "Aprobado",
  RECHAZADO: "Rechazado",
};

export default async function HistorialPage({ params }: { params: { id: string } }) {
  const sesion = await obtenerSesion();
  const plan = await prisma.plan.findUnique({
    where: { id: params.id },
    include: { abonos: { orderBy: { fecha: "desc" } } },
  });
  if (!plan) notFound();
  if (plan.clienteId !== sesion!.sub) redirect("/dashboard");

  return (
    <AppShell title="Historial" back={`/planes/${plan.id}`}>
      <main className="flex flex-col gap-2 p-4">
        {plan.abonos.map((a) => (
          <div key={a.id} className="rounded border p-3 flex flex-col gap-1 text-sm">
            <div className="flex justify-between">
              <span>{new Date(a.fecha).toLocaleDateString("es-CO")}</span>
              <span className="font-medium">${a.valor.toLocaleString("es-CO")}</span>
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>{a.metodoPago}</span>
              <span>{ESTADO_LABEL[a.estado] ?? a.estado}</span>
            </div>
            {a.estado === "RECHAZADO" && a.motivoRechazo && (
              <p className="text-xs text-red-600">Motivo: {a.motivoRechazo}</p>
            )}
          </div>
        ))}
        {plan.abonos.length === 0 && <p className="text-sm text-gray-400">Sin movimientos todavía.</p>}
      </main>
    </AppShell>
  );
}
