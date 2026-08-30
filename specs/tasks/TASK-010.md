# TASK-010 — Dashboard del cliente (estado del plan)

## References
- FR-008, TS-001 (GET /api/planes/{id})

## Objective
Mostrar al cliente el estado completo de su(s) plan(es).

## Scope
### In Scope
- `GET /api/planes/{id}` (owner-only).
- `GET /api/planes` (listado de planes del cliente autenticado).
- Página `/dashboard` y `/planes/[id]`.

## Technical Changes
### Files
- `src/app/api/planes/[id]/route.ts`
- `src/app/api/planes/route.ts` (GET, listado propio)
- `src/app/(cliente)/dashboard/page.tsx`
- `src/app/(cliente)/planes/[id]/page.tsx`

## Behavior
1. Verificar que el plan pertenece al cliente autenticado (`403` si no).
2. Calcular progreso: `totalPagado / valorTotal * 100`.
3. Retornar valorTotal, totalPagado, saldoPendiente, progreso, abonos, estado.

## Acceptance Criteria
- [ ] El cliente ve su propio plan con todos los campos de FR-008.
- [ ] Un cliente no puede ver el plan de otro cliente (403).

## Tests
- [ ] Integration: consulta propia vs. de otro cliente.

## Validation
```bash
npm run lint && npm run typecheck && npm test
```

## Definition of Done
- [ ] Implementation complete.
- [ ] Tests passing.
- [ ] No regression.
