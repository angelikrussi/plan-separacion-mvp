# TASK-015 — Rechazar pago

## References
- FR-013, BR-004, BR-006, AC-008, TS-001

## Objective
Rechazar un abono en revisión con motivo, sin afectar el saldo.

## Scope
### In Scope
- `POST /api/admin/abonos/{id}/rechazar`.

## Technical Changes
### Files
- `src/app/api/admin/abonos/[id]/rechazar/route.ts`

## Behavior
```text
rechazar(adminId, abonoId, motivo):
    abono ← obtener abono
    si abono.estado != EN_REVISION: devolver INVALID_STATE
    si abono.revisadoPor != adminId: devolver NOT_REVIEWER
    si motivo vacío: devolver VALIDATION_ERROR

    abono.estado ← RECHAZADO
    abono.motivoRechazo ← motivo
    abono.administradorId ← adminId
    abono.fechaResolucion ← now
    # BR-004: plan.saldoPendiente no cambia

    registrar Auditoria (accion=RECHAZAR_PAGO)
    devolver abono
```

## Acceptance Criteria
- [ ] AC-008 pasa: motivo visible para el cliente, saldo sin cambios.
- [ ] Motivo vacío es rechazado.

## Tests
- [ ] Integration: rechazo válido, rechazo sin motivo.

## Validation
```bash
npm run lint && npm run typecheck && npm test
```

## Definition of Done
- [ ] Implementation complete.
- [ ] Tests passing.
- [ ] No regression.
