# TASK-024 — Rediseño storefront: marca LuckyHouse y layout responsive

## References
- TS-001 (Branding, Architecture Context)

## Objective
Reemplazar el layout inicial (todo forzado a `max-w-md`, look de "app en una caja") por un storefront de ancho completo con la marca LuckyHouse y paleta verde definida por el usuario.

## Technical Changes
### Files
- `tailwind.config.ts` (tokens de color: brand, cta, accent, success, warning, danger, info, ink, line, app)
- `src/app/layout.tsx`, `src/app/globals.css`
- `src/components/StoreHeader.tsx`, `src/components/AppShell.tsx` (nuevo, para pantallas tipo app)
- `src/app/page.tsx`, `src/app/catalogo/page.tsx`, `src/app/producto/[id]/page.tsx`

## Behavior
1. `AppShell` (angosto, centrado) para auth/dashboard cliente/admin — sustituye el `NavBar` original.
2. `StoreHeader` (ancho completo) para storefront público, con nav de categorías.
3. Grid responsive en catálogo/home: `grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5`.

## Acceptance Criteria
- [x] El storefront usa el ancho de la pantalla en desktop, no queda forzado a ancho de celular.
- [x] Los botones de acción primaria usan `cta` (verde intenso), no `brand` (reservado para header/marca).

## Definition of Done
- [x] Implementation complete.
- [x] Verificado visualmente en navegador.
- [x] No regression.
