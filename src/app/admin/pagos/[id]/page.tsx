import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { obtenerSesion } from "@/lib/auth/session";
import { revisarAbono } from "@/lib/pagos/revisar";
import { AppShell } from "@/components/AppShell";
import { AccionesPago } from "./AccionesPago";

export const dynamic = "force-dynamic";

export default async function DetallePagoPage({ params }: { params: { id: string } }) {
  const sesion = await obtenerSesion();

  const abonoInicial = await prisma.abono.findUnique({ where: { id: params.id } });
  if (!abonoInicial) notFound();

  // FR-011: al abrir el detalle, el pago pasa de PENDIENTE a EN_REVISION (bloqueo optimista, ADR-003).
  let abono = abonoInicial;
  if (abonoInicial.estado === "PENDIENTE" || (abonoInicial.estado === "EN_REVISION" && abonoInicial.revisadoPor === sesion!.sub)) {
    try {
      abono = await revisarAbono(params.id, sesion!.sub);
    } catch {
      abono = await prisma.abono.findUniqueOrThrow({ where: { id: params.id } });
    }
  }

  const plan = await prisma.plan.findUniqueOrThrow({
    where: { id: abono.planId },
    include: { cliente: true, producto: true },
  });

  const esRevisor = abono.estado === "EN_REVISION" && abono.revisadoPor === sesion!.sub;
  const comprobanteEsPdf = abono.comprobanteUrl.toLowerCase().endsWith(".pdf");

  return (
    <AppShell title="Detalle del pago" back="/admin/pagos">
      <main className="flex flex-col gap-4 p-4">
        <div className="rounded-lg border p-4 text-sm flex flex-col gap-1">
          <p><span className="text-gray-400">Cliente:</span> {plan.cliente.nombreCompleto}</p>
          <p><span className="text-gray-400">Producto:</span> {plan.producto.nombre}</p>
          <p><span className="text-gray-400">Valor:</span> ${abono.valor.toLocaleString("es-CO")}</p>
          <p><span className="text-gray-400">Método:</span> {abono.metodoPago}</p>
          <p><span className="text-gray-400">Fecha:</span> {new Date(abono.fecha).toLocaleDateString("es-CO")}</p>
          {abono.referencia && <p><span className="text-gray-400">Referencia:</span> {abono.referencia}</p>}
          <p><span className="text-gray-400">Estado:</span> {abono.estado}</p>
        </div>

        <div className="rounded-lg border overflow-hidden">
          {comprobanteEsPdf ? (
            <a href={abono.comprobanteUrl} target="_blank" rel="noreferrer" className="block p-4 text-center text-brand text-sm">
              Ver comprobante (PDF)
            </a>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={abono.comprobanteUrl} alt="Comprobante" className="w-full" />
          )}
        </div>

        <AccionesPago abonoId={abono.id} esRevisor={esRevisor} />
      </main>
    </AppShell>
  );
}
