"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

export function AccountMenu() {
  const [abierto, setAbierto] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickFuera(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setAbierto(false);
    }
    document.addEventListener("click", onClickFuera);
    return () => document.removeEventListener("click", onClickFuera);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setAbierto((v) => !v)}
        className="flex items-center gap-1 text-sm hover:underline"
        aria-haspopup="menu"
        aria-expanded={abierto}
      >
        Cuenta
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className={abierto ? "rotate-180" : ""}>
          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {abierto && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-48 rounded-lg bg-white text-ink shadow-lg border overflow-hidden z-50"
        >
          <Link href="/dashboard" className="block px-4 py-2 text-sm hover:bg-brand-light" onClick={() => setAbierto(false)}>
            Mis planes
          </Link>
          <Link href="/login" className="block px-4 py-2 text-sm hover:bg-brand-light" onClick={() => setAbierto(false)}>
            Ingresar como cliente
          </Link>
          <Link href="/registro" className="block px-4 py-2 text-sm hover:bg-brand-light" onClick={() => setAbierto(false)}>
            Crear cuenta
          </Link>
          <div className="border-t" />
          <Link href="/admin/login" className="block px-4 py-2 text-sm text-ink-secondary hover:bg-brand-light" onClick={() => setAbierto(false)}>
            Ingresar como administrador
          </Link>
        </div>
      )}
    </div>
  );
}
