# TASK-018 — Historial del cliente

## References
- FR-016, TS-001

## Objective
Mostrar al cliente el historial de sus movimientos (abonos y estado).

## Technical Changes
### Files
- `src/app/api/planes/[id]/historial/route.ts`
- `src/app/(cliente)/planes/[id]/historial/page.tsx`

## Behavior
1. Listar abonos del plan (todos los estados) ordenados por fecha descendente.
2. Verificar ownership del plan.

## Acceptance Criteria
- [ ] El historial muestra fecha, concepto (abono), valor y estado.
- [ ] Cliente no puede ver historial de otro cliente (403).

## Tests
- [ ] Integration: historial propio vs. ajeno.

## Validation
```bash
npm run lint && npm run typecheck && npm test
```

## Definition of Done
- [ ] Implementation complete.
- [ ] Tests passing.
- [ ] No regression.
