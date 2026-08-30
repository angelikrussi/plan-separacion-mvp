# TASK-006 — Catálogo de productos

## References
- FR-004, TS-001 (GET /api/productos)

## Objective
Listar productos disponibles con sus datos mínimos.

## Scope
### In Scope
- `GET /api/productos`.
- Página `/catalogo`.
### Out of Scope
- Detalle de producto (TASK-007).

## Technical Changes
### Files
- `src/app/(public)/catalogo/page.tsx`
- `src/app/api/productos/route.ts`

## Behavior
1. Listar productos, mostrando fotografía, nombre, precio, categoría y disponibilidad (calculada: si `stockLimitado` y `cantidadDisponible <= 0`, marcar no disponible).

## Constraints
- Ninguna.

## Acceptance Criteria
- [ ] El catálogo muestra todos los productos publicados con los 5 campos mínimos.
- [ ] Un producto sin stock disponible se marca como no disponible.

## Tests
- [ ] Integration: listado con productos disponibles y no disponibles.

## Validation
```bash
npm run lint
npm run typecheck
npm test
```

## Definition of Done
- [ ] Implementation complete.
- [ ] Tests passing.
- [ ] No regression.
