"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AppShell } from "@/components/AppShell";

export default function RegistroPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    nombreCompleto: "",
    documentoIdentidad: "",
    celular: "",
    correo: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  function set(campo: string, valor: string) {
    setForm((f) => ({ ...f, [campo]: valor }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setCargando(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/registro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message ?? "No se pudo registrar");
      router.push("/login");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error inesperado");
    } finally {
      setCargando(false);
    }
  }

  return (
    <AppShell title="Crear cuenta" back="/">
      <form onSubmit={submit} className="flex flex-col gap-3 p-4">
        <input
          className="rounded border px-3 py-2"
          placeholder="Nombre completo"
          value={form.nombreCompleto}
          onChange={(e) => set("nombreCompleto", e.target.value)}
          required
        />
        <input
          className="rounded border px-3 py-2"
          placeholder="Documento de identidad"
          value={form.documentoIdentidad}
          onChange={(e) => set("documentoIdentidad", e.target.value)}
          required
        />
        <input
          className="rounded border px-3 py-2"
          placeholder="Celular"
          value={form.celular}
          onChange={(e) => set("celular", e.target.value)}
          required
        />
        <input
          className="rounded border px-3 py-2"
          type="email"
          placeholder="Correo"
          value={form.correo}
          onChange={(e) => set("correo", e.target.value)}
          required
        />
        <input
          className="rounded border px-3 py-2"
          type="password"
          placeholder="Contraseña (mín. 8 caracteres)"
          value={form.password}
          onChange={(e) => set("password", e.target.value)}
          required
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          disabled={cargando}
          className="rounded-lg bg-cta hover:bg-cta-hover px-4 py-3 text-white font-medium disabled:opacity-50"
        >
          {cargando ? "Creando cuenta..." : "Crear cuenta"}
        </button>
        <p className="text-center text-sm text-gray-500">
          ¿Ya tienes cuenta? <Link href="/login" className="text-brand">Inicia sesión</Link>
        </p>
      </form>
    </AppShell>
  );
}
