# TASK-016 — Cancelar plan (admin)

## References
- FR-014, BR-008, AC-009, TS-001

## Objective
Permitir a un administrador cancelar un plan activo, liberando la reserva de stock si existía.

## Technical Changes
### Files
- `src/app/api/planes/[id]/cancelar/route.ts`

## Behavior
```text
cancelar(adminId, planId, motivo):
    plan ← obtener plan
    si plan.estado != ACTIVO: devolver INVALID_STATE
    si motivo vacío: devolver VALIDATION_ERROR

    plan.estado ← CANCELADO
    plan.motivoCancelacion ← motivo

    producto ← obtener producto de plan
    si producto.stockLimitado:
        producto.cantidadDisponible += 1   # libera reserva (BR-008)

    registrar Auditoria (accion=CANCELAR_PLAN)
    devolver plan
```

## Acceptance Criteria
- [ ] AC-009 pasa: plan pasa a CANCELADO, deja de aceptar abonos, producto vuelve a disponible.
- [ ] Cliente no puede invocar este endpoint (solo admin).

## Tests
- [ ] Integration: cancelación con y sin stock limitado; intento de cliente (403).

## Validation
```bash
npm run lint && npm run typecheck && npm test
```

## Definition of Done
- [ ] Implementation complete.
- [ ] Tests passing.
- [ ] No regression.
