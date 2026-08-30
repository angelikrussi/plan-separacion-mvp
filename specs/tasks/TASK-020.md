# TASK-020 — Liberación automática del producto

## References
- FR-018, AC-010, TS-001 (State Transitions)

## Objective
Cambiar el estado del plan a `COMPLETAMENTE_PAGADO` y luego `PENDIENTE_DE_ENTREGA` cuando el saldo llega a $0. Se invoca desde TASK-014 (aprobar pago).

## Technical Changes
### Files
- `src/lib/planes/liberar.ts`

## Behavior
```text
liberarProducto(plan):
    si plan.saldoPendiente != 0: return  # no-op

    plan.estado ← COMPLETAMENTE_PAGADO
    plan.estado ← PENDIENTE_DE_ENTREGA
    registrar Auditoria (accion=LIBERAR_PRODUCTO)
```

## Acceptance Criteria
- [ ] Al aprobar un pago que deja saldo en $0, el plan queda `PENDIENTE_DE_ENTREGA`.
- [ ] Un plan con saldo > 0 nunca cambia de estado por esta función.

## Tests
- [ ] Unit: liberación con saldo 0 y con saldo > 0.

## Validation
```bash
npm run lint && npm run typecheck && npm test
```

## Definition of Done
- [ ] Implementation complete.
- [ ] Tests passing.
- [ ] No regression.
