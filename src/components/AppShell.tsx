import Link from "next/link";

// Contenedor para las pantallas tipo "app" (auth, dashboard del cliente,
// panel admin) — más angostas y centradas, a diferencia del storefront
// público que usa StoreHeader + ancho completo.
export function AppShell({
  title,
  back,
  children,
}: {
  title: string;
  back?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-0 sm:py-8">
      <div className="w-full max-w-md bg-white sm:rounded-xl sm:shadow-sm min-h-screen sm:min-h-0">
        <header className="flex items-center gap-3 border-b px-4 py-3">
          {back && (
            <Link href={back} className="text-brand text-sm shrink-0">
              ← Volver
            </Link>
          )}
          <h1 className="text-lg font-semibold">{title}</h1>
        </header>
        {children}
      </div>
    </div>
  );
}
