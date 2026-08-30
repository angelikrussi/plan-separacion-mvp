"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function AbonoForm({ planId, saldoPendiente }: { planId: string; saldoPendiente: number }) {
  const router = useRouter();
  const [valor, setValor] = useState("");
  const [metodoPago, setMetodoPago] = useState("Transferencia");
  const [fecha, setFecha] = useState(new Date().toISOString().slice(0, 10));
  const [referencia, setReferencia] = useState("");
  const [archivo, setArchivo] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);
  const [cargando, setCargando] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!archivo) {
      setError("Debes adjuntar el comprobante");
      return;
    }
    setCargando(true);
    try {
      const formData = new FormData();
      formData.set("valor", valor);
      formData.set("metodoPago", metodoPago);
      formData.set("fecha", fecha);
      formData.set("referencia", referencia);
      formData.set("comprobante", archivo);

      const res = await fetch(`/api/planes/${planId}/abonos`, { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message ?? "No se pudo registrar el abono");
      setOk(true);
      setTimeout(() => router.push(`/planes/${planId}`), 1200);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error inesperado");
    } finally {
      setCargando(false);
    }
  }

  if (ok) {
    return (
      <div className="rounded-lg border border-yellow-300 bg-yellow-50 p-4 text-sm">
        🟡 Pago pendiente de verificación. Hemos recibido tu comprobante. Tu saldo será actualizado cuando el
        administrador confirme la transacción.
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-3">
      <p className="text-sm text-gray-500">Saldo pendiente: ${saldoPendiente.toLocaleString("es-CO")}</p>
      <input
        className="rounded border px-3 py-2"
        type="number"
        placeholder="Valor del abono"
        value={valor}
        onChange={(e) => setValor(e.target.value)}
        max={saldoPendiente}
        required
      />
      <select className="rounded border px-3 py-2" value={metodoPago} onChange={(e) => setMetodoPago(e.target.value)}>
        <option>Transferencia</option>
        <option>Consignación</option>
        <option>Efectivo</option>
        <option>Otro</option>
      </select>
      <input className="rounded border px-3 py-2" type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} required />
      <input
        className="rounded border px-3 py-2"
        placeholder="Número de referencia (opcional)"
        value={referencia}
        onChange={(e) => setReferencia(e.target.value)}
      />
      <label className="rounded border border-dashed px-3 py-4 text-center text-sm text-gray-500">
        {archivo ? archivo.name : "Adjuntar comprobante (jpg, png o pdf, máx. 5MB)"}
        <input
          type="file"
          accept="image/jpeg,image/png,application/pdf"
          className="hidden"
          onChange={(e) => setArchivo(e.target.files?.[0] ?? null)}
        />
      </label>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button disabled={cargando} className="rounded-lg bg-cta hover:bg-cta-hover px-4 py-3 text-white font-medium disabled:opacity-50">
        {cargando ? "Enviando..." : "Registrar abono"}
      </button>
    </form>
  );
}
