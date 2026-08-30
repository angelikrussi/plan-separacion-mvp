# TASK-011 — Registrar abono con comprobante

## References
- FR-009, BR-002, BR-003, BR-009, AC-004, AC-005, EF-001, TS-001 (POST /api/planes/{id}/abonos)

## Objective
Permitir a un cliente registrar un abono adjuntando comprobante, sin afectar el saldo hasta la aprobación.

## Scope
### In Scope
- Endpoint multipart, validación de sobrepago, storage adapter de comprobantes.
### Out of Scope
- Revisión/aprobación (TASK-013, TASK-014).

## Technical Changes
### Files
- `src/app/api/planes/[id]/abonos/route.ts`
- `src/lib/storage/comprobantes.ts`
- `src/app/(cliente)/planes/[id]/abonar/page.tsx`

## Behavior
```text
registrarAbono(clienteId, planId, valor, metodoPago, fecha, referencia, archivo):
    plan ← obtener plan; verificar ownership
    si plan.estado != ACTIVO: devolver INVALID_STATE

    si valor > plan.saldoPendiente:
        devolver OVERPAYMENT   # BR-009 / EF-001

    validar archivo: tipo en {jpg, png, pdf}, tamaño <= 5MB
    comprobanteUrl ← storage.guardar(archivo)

    crear Abono { planId, valor, metodoPago, fecha, referencia, comprobanteUrl, estado: PENDIENTE }
    # BR-003: no se toca plan.saldoPendiente aquí
    devolver abono
```

## Constraints
- BR-002: este endpoint nunca modifica `Plan.saldoPendiente` ni `Plan.totalPagado`.

## Acceptance Criteria
- [ ] AC-004 pasa: abono mayor al saldo pendiente es rechazado, no se crea registro.
- [ ] AC-005 pasa: tras registrar, el saldo del plan no cambia.
- [ ] Archivo con tipo/tamaño inválido es rechazado (400 `INVALID_FILE`).

## Tests
- [ ] Integration: abono válido, sobrepago, archivo inválido.

## Validation
```bash
npm run lint && npm run typecheck && npm test
```

## Definition of Done
- [ ] Implementation complete.
- [ ] Tests passing.
- [ ] No regression.
