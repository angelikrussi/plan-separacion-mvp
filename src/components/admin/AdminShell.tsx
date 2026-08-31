import Link from "next/link";
import { LogoutButton } from "@/components/LogoutButton";

const NAV = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/pagos", label: "Pagos" },
  { href: "/admin/entregas", label: "Entregas" },
  { href: "/admin/auditoria", label: "Auditoría" },
];

// Layout ancho ("gerencial") para el panel de administración — a diferencia
// de AppShell (angosto, usado en auth/flujos de cliente), este trae nav
// persistente para no depender de enlaces "Volver" para moverse entre secciones.
export function AdminShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-app">
      <header className="bg-ink text-white">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
          <Link href="/admin" className="text-lg font-bold">LuckyHouse admin</Link>
          <LogoutButton redirectTo="/admin/login" className="text-sm text-white/70 hover:text-white" />
        </div>
        <nav className="mx-auto max-w-7xl px-4 flex gap-1 text-sm overflow-x-auto">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="px-3 py-2 whitespace-nowrap hover:bg-white/10">
              {item.label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6">
        <h1 className="text-xl font-semibold mb-4">{title}</h1>
        {children}
      </main>
    </div>
  );
}
