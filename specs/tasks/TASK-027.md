# TASK-027 — Menú de cuenta desplegable en el storefront

## References
- TS-001 (Architecture Context)

## Objective
Reemplazar los enlaces sueltos del header ("Mis planes" / "Ingresar" / "Admin") por un menú desplegable único, más ordenado.

## Technical Changes
### Files
- `src/components/AccountMenu.tsx` (nuevo, `"use client"`)
- `src/components/StoreHeader.tsx`

## Behavior
Botón "Cuenta" con flecha; al abrir, muestra: Mis planes, Ingresar como cliente, Crear cuenta, Ingresar como administrador. Se cierra al hacer clic fuera (`document.addEventListener("click", ...)`).

## Acceptance Criteria
- [x] Un solo punto de entrada "Cuenta" en el header reemplaza los enlaces sueltos.
- [x] El menú se cierra al hacer clic fuera de él.

## Definition of Done
- [x] Implementation complete.
- [x] Verificado visualmente en navegador.
- [x] No regression.
