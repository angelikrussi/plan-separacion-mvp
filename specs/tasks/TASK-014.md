# TASK-014 — Aprobar pago

## References
- FR-012, BR-005, BR-006, AC-007, AC-010, TS-001 (Transactions), ADR-003

## Objective
Aprobar un abono en revisión, actualizando saldo/progreso del plan y disparando liberación si corresponde.

## Scope
### In Scope
- `POST /api/admin/abonos/{id}/aprobar` como transacción atómica.

## Technical Changes
### Files
- `src/app/api/admin/abonos/[id]/aprobar/route.ts`
- `src/lib/planes/liberar.ts` (TASK-020, se invoca desde aquí)

## Behavior
```text
aprobar(adminId, abonoId):
    BEGIN TX
    abono ← obtener abono FOR UPDATE
    si abono.estado != EN_REVISION: devolver INVALID_STATE
    si abono.revisadoPor != adminId: devolver NOT_REVIEWER

    abono.estado ← APROBADO
    abono.administradorId ← adminId
    abono.fechaResolucion ← now

    plan ← obtener plan de abono.planId
    plan.totalPagado += abono.valor
    plan.saldoPendiente -= abono.valor

    si plan.saldoPendiente == 0:
        invocar liberarProducto(plan)   # TASK-020

    registrar Auditoria (accion=APROBAR_PAGO, valoresAnteriores={saldo}, valoresNuevos={saldo})
    COMMIT
    devolver abono, plan
```

## Constraints
- Todo el bloque debe ser una única transacción de base de datos (rollback si algo falla).
- No se puede aprobar un abono que no está `EN_REVISION` (BR-006).

## Acceptance Criteria
- [ ] AC-007 pasa: saldo se actualiza correctamente y se registra admin/fecha.
- [ ] AC-010 pasa: al llegar a saldo $0 el plan pasa a `COMPLETAMENTE_PAGADO` → `PENDIENTE_DE_ENTREGA`.
- [ ] Aprobar un abono no revisado por el admin actual retorna 403 `NOT_REVIEWER`.

## Tests
- [ ] Integration: aprobación normal, aprobación que libera el producto, aprobación por admin no-revisor.

## Validation
```bash
npm run lint && npm run typecheck && npm test
```

## Definition of Done
- [ ] Implementation complete.
- [ ] Tests passing.
- [ ] No regression.
