"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function AccionesPago({ abonoId, esRevisor }: { abonoId: string; esRevisor: boolean }) {
  const router = useRouter();
  const [motivo, setMotivo] = useState("");
  const [mostrarRechazo, setMostrarRechazo] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  async function aprobar() {
    setCargando(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/abonos/${abonoId}/aprobar`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message ?? "No se pudo aprobar");
      router.push("/admin/pagos");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error inesperado");
    } finally {
      setCargando(false);
    }
  }

  async function rechazar() {
    if (!motivo) {
      setError("Selecciona un motivo");
      return;
    }
    setCargando(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/abonos/${abonoId}/rechazar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ motivo }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message ?? "No se pudo rechazar");
      router.push("/admin/pagos");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error inesperado");
    } finally {
      setCargando(false);
    }
  }

  if (!esRevisor) {
    return <p className="text-sm text-amber-600">Este pago está en revisión por otro administrador.</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      {!mostrarRechazo ? (
        <div className="flex gap-2">
          <button onClick={aprobar} disabled={cargando} className="flex-1 rounded-lg bg-success px-4 py-3 text-white font-medium disabled:opacity-50">
            Aprobar pago
          </button>
          <button onClick={() => setMostrarRechazo(true)} disabled={cargando} className="flex-1 rounded-lg bg-danger px-4 py-3 text-white font-medium disabled:opacity-50">
            Rechazar pago
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <select className="rounded border px-3 py-2" value={motivo} onChange={(e) => setMotivo(e.target.value)}>
            <option value="">Selecciona un motivo</option>
            <option>Comprobante inválido</option>
            <option>Transacción no encontrada</option>
            <option>Valor diferente</option>
            <option>Comprobante duplicado</option>
            <option>Datos inconsistentes</option>
            <option>Transacción cancelada</option>
            <option>Otro</option>
          </select>
          <div className="flex gap-2">
            <button onClick={() => setMostrarRechazo(false)} className="flex-1 rounded-lg border px-4 py-3">
              Cancelar
            </button>
            <button onClick={rechazar} disabled={cargando} className="flex-1 rounded-lg bg-danger px-4 py-3 text-white font-medium disabled:opacity-50">
              Confirmar rechazo
            </button>
          </div>
        </div>
      )}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
