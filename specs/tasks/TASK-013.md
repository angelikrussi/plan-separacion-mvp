# TASK-013 — Revisar comprobante (bloqueo optimista)

## References
- FR-011, EF-003, AC-006, TS-001, ADR-003

## Objective
Transicionar un abono de `PENDIENTE` a `EN_REVISION` cuando un admin abre su detalle, con bloqueo optimista.

## Scope
### In Scope
- `POST /api/admin/abonos/{id}/revisar`.
- Página de detalle de comprobante.

## Technical Changes
### Files
- `src/app/api/admin/abonos/[id]/revisar/route.ts`
- `src/app/(admin)/admin/pagos/[id]/page.tsx`

## Behavior
```text
revisar(adminId, abonoId):
    UPDATE Abono SET estado = EN_REVISION, revisadoPor = adminId, revisadoEn = now
    WHERE id = abonoId AND estado = PENDIENTE

    si 0 filas afectadas:
        abono ← obtener abono actual
        si abono.estado == EN_REVISION:
            devolver ALREADY_IN_REVIEW { revisadoPor: abono.revisadoPor }
        si no:
            devolver INVALID_STATE

    devolver abono actualizado
```

## Constraints
- La transición debe ser una única sentencia condicional (evita race condition entre el check y el update — ADR-003).

## Acceptance Criteria
- [ ] AC-006 pasa: segundo admin ve "en revisión por X" y no puede tomarlo.
- [ ] Abono ya `APROBADO`/`RECHAZADO` retorna `INVALID_STATE`.

## Tests
- [ ] Integration: dos requests concurrentes sobre el mismo abono (simulado secuencialmente en test).

## Validation
```bash
npm run lint && npm run typecheck && npm test
```

## Definition of Done
- [ ] Implementation complete.
- [ ] Tests passing.
- [ ] No regression.
