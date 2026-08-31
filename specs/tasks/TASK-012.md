# TASK-012 — Panel admin: pagos pendientes

## References
- FR-010, TS-001 (GET /api/admin/abonos)

## Objective
Listar para el administrador los abonos en estado `PENDIENTE` o `EN_REVISION`.

## Scope
### In Scope
- `GET /api/admin/abonos?estado=...`.
- Página `/admin/pagos`.

## Technical Changes
### Files
- `src/app/api/admin/abonos/route.ts`
- `src/app/(admin)/admin/pagos/page.tsx`
- `src/middleware.ts` (protección de rutas admin — ver TASK-022)

## Behavior
1. Verificar rol `administrador` (401/403 si no).
2. Listar abonos con cliente, producto, valor, método, fecha, referencia, comprobante, estado.

## Acceptance Criteria
- [ ] Solo un administrador autenticado accede al listado.
- [ ] El listado incluye los campos mínimos definidos en FR-010.

## Tests
- [ ] Integration: acceso admin vs. cliente (403).

## Validation
```bash
npm run lint && npm run typecheck && npm test
```

## Definition of Done
- [ ] Implementation complete.
- [ ] Tests passing.
- [ ] No regression.
