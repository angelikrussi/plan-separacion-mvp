# TASK-021 — Gestión de entrega

## References
- FR-019, FR-020, TS-001

## Objective
Permitir al cliente registrar datos de entrega y al administrador marcarla como completada.

## Technical Changes
### Files
- `src/app/api/planes/[id]/entrega/route.ts`
- `src/app/api/admin/entregas/[id]/entregar/route.ts`
- `src/app/(cliente)/planes/[id]/entrega/page.tsx`

## Behavior
```text
registrarEntrega(clienteId, planId, tipo, datos):
    plan ← obtener plan; verificar ownership
    si plan.estado != PENDIENTE_DE_ENTREGA: devolver INVALID_STATE
    crear Entrega { planId, tipo, ...datos, estadoEntrega: PENDIENTE_DE_PREPARACION }

marcarEntregado(adminId, entregaId):
    entrega ← obtener entrega
    entrega.estadoEntrega ← ENTREGADO
    plan.estado ← ENTREGADO
    registrar Auditoria (accion=MARCAR_ENTREGADO)
```

## Acceptance Criteria
- [ ] Solo un plan `PENDIENTE_DE_ENTREGA` puede registrar datos de entrega.
- [ ] Solo un administrador puede marcar `ENTREGADO`.

## Tests
- [ ] Integration: registro de entrega válido/en estado incorrecto; marcado por admin.

## Validation
```bash
npm run lint && npm run typecheck && npm test
```

## Definition of Done
- [ ] Implementation complete.
- [ ] Tests passing.
- [ ] No regression.
