"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import QRCode from "qrcode";
import { AppShell } from "@/components/AppShell";

export default function LoginPage() {
  const router = useRouter();
  const [paso, setPaso] = useState<"credenciales" | "totp">("credenciales");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [codigo, setCodigo] = useState("");
  const [totpUri, setTotpUri] = useState<string | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  async function enviarCredenciales(e: React.FormEvent) {
    e.preventDefault();
    setCargando(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message ?? "No se pudo iniciar sesión");
      if (data.configurarTotp) {
        setTotpUri(data.totpUri);
        setQrDataUrl(await QRCode.toDataURL(data.totpUri));
      }
      setPaso("totp");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error inesperado");
    } finally {
      setCargando(false);
    }
  }

  async function enviarTotp(e: React.FormEvent) {
    e.preventDefault();
    setCargando(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/login/totp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ codigo }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message ?? "Código incorrecto");
      router.push("/dashboard");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error inesperado");
    } finally {
      setCargando(false);
    }
  }

  return (
    <AppShell title="Iniciar sesión" back="/">
      {paso === "credenciales" && (
        <form onSubmit={enviarCredenciales} className="flex flex-col gap-3 p-4">
          <input
            className="rounded border px-3 py-2"
            type="email"
            placeholder="Correo"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
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
            className="rounded-lg bg-cta hover:bg-cta-hover px-4 py-3 text-white font-medium disabled:opacity-50"
          >
            {cargando ? "Verificando..." : "Continuar"}
          </button>
          <p className="text-center text-sm text-gray-500">
            ¿No tienes cuenta? <Link href="/registro" className="text-brand">Crea una</Link>
          </p>
        </form>
      )}

      {paso === "totp" && (
        <form onSubmit={enviarTotp} className="flex flex-col gap-3 p-4">
          {totpUri && (
            <div className="rounded border p-3 text-sm text-gray-600 flex flex-col items-center gap-2">
              <p className="font-medium text-gray-900 self-start">Configura tu 2FA</p>
              <p className="self-start">Escanea este código con tu app autenticadora (Google Authenticator, Authy, etc.):</p>
              {qrDataUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={qrDataUrl} alt="Código QR para configurar 2FA" className="h-40 w-40" />
              )}
              <details className="self-start w-full">
                <summary className="cursor-pointer text-xs text-brand">¿No puedes escanear? Ver clave manual</summary>
                <code className="text-xs break-all">{totpUri}</code>
              </details>
            </div>
          )}
          <input
            className="rounded border px-3 py-2"
            placeholder="Código de 6 dígitos"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            required
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            disabled={cargando}
            className="rounded-lg bg-cta hover:bg-cta-hover px-4 py-3 text-white font-medium disabled:opacity-50"
          >
            {cargando ? "Verificando..." : "Ingresar"}
          </button>
        </form>
      )}
    </AppShell>
  );
}
