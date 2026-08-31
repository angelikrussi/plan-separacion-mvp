# TASK-017 — Ajuste manual de saldo

## References
- FR-015, BR-011, AC-011, TS-001

## Objective
Permitir a un administrador ajustar manualmente el saldo de un plan con motivo obligatorio y auditoría.

## Technical Changes
### Files
- `src/app/api/planes/[id]/ajuste-saldo/route.ts`

## Behavior
```text
ajustarSaldo(adminId, planId, nuevoSaldo, motivo):
    si motivo vacío: devolver VALIDATION_ERROR
    plan ← obtener plan
    saldoAnterior ← plan.saldoPendiente
    plan.saldoPendiente ← nuevoSaldo
    plan.totalPagado ← plan.valorTotal - nuevoSaldo

    registrar Auditoria (
        accion=AJUSTE_MANUAL_SALDO,
        actor=adminId,
        valoresAnteriores={saldo: saldoAnterior},
        valoresNuevos={saldo: nuevoSaldo, motivo}
    )
    devolver plan
```

## Acceptance Criteria
- [ ] AC-011 pasa: auditoría registra valor anterior, nuevo, admin, motivo y fecha/hora.
- [ ] Solo un administrador puede invocar este endpoint.

## Tests
- [ ] Integration: ajuste válido, ajuste sin motivo (rechazado).

## Validation
```bash
npm run lint && npm run typecheck && npm test
```

## Definition of Done
- [ ] Implementation complete.
- [ ] Tests passing.
- [ ] No regression.
