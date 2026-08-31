"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/AppShell";

export default function AdminLoginPage() {
  const router = useRouter();
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setCargando(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message ?? "No se pudo iniciar sesión");
      router.push("/admin");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error inesperado");
    } finally {
      setCargando(false);
    }
  }

  return (
    <AppShell title="Administrador" back="/">
      <form onSubmit={submit} className="flex flex-col gap-3 p-4">
        <input
          className="rounded border px-3 py-2"
          placeholder="Usuario"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
          required
        />
        <input
          className="rounded border px-3 py-2"
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          disabled={cargando}
          className="rounded-lg bg-gray-900 px-4 py-3 text-white font-medium disabled:opacity-50"
        >
          {cargando ? "Verificando..." : "Ingresar"}
        </button>
      </form>
    </AppShell>
  );
}
