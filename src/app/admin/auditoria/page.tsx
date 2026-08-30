import { prisma } from "@/lib/db";
import { AppShell } from "@/components/AppShell";

export const dynamic = "force-dynamic";

export default async function AuditoriaPage() {
  const registros = await prisma.auditoria.findMany({ orderBy: { fechaHora: "desc" }, take: 100 });

  return (
    <AppShell title="Auditoría" back="/admin/pagos">
      <main className="flex flex-col gap-2 p-4 text-xs">
        {registros.map((r) => (
          <div key={r.id} className="rounded border p-3">
            <div className="flex justify-between font-medium">
              <span>{r.accion}</span>
              <span className="text-gray-400">{new Date(r.fechaHora).toLocaleString("es-CO")}</span>
            </div>
            <div className="text-gray-500">
              {r.entidad} #{r.entidadId.slice(0, 8)} — actor: {r.actor.slice(0, 8)}
            </div>
            <div className="mt-1 grid grid-cols-2 gap-2">
              <div>
                <p className="text-gray-400">Antes</p>
                <pre className="whitespace-pre-wrap break-all">{r.valoresAnteriores}</pre>
              </div>
              <div>
                <p className="text-gray-400">Después</p>
                <pre className="whitespace-pre-wrap break-all">{r.valoresNuevos}</pre>
              </div>
            </div>
          </div>
        ))}
        {registros.length === 0 && <p className="text-gray-400">Sin registros todavía.</p>}
      </main>
    </AppShell>
  );
}
