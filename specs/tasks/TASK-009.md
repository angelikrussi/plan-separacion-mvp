# TASK-009 — Crear plan y reservar stock

## References
- FR-007, BR-007, AC-003, TS-001 (POST /api/planes)

## Objective
Permitir a un cliente autenticado crear un plan para un producto, reservando stock si aplica.

## Scope
### In Scope
- `POST /api/planes`.
- Página de confirmación de plan.

## Technical Changes
### Files
- `src/app/api/planes/route.ts`
- `src/app/(cliente)/planes/nuevo/page.tsx`

## Behavior
```text
crearPlan(clienteId, productoId, numeroCuotas):
    producto ← obtener producto
    si no existe: devolver PRODUCT_NOT_FOUND

    si producto.stockLimitado:
        si producto.cantidadDisponible <= 0:
            devolver PRODUCT_NOT_AVAILABLE
        producto.cantidadDisponible -= 1   # reserva exclusiva (BR-007)

    valorTotal ← producto.precio
    saldoPendiente ← valorTotal

    crear Plan { estado: ACTIVO, valorTotal, saldoPendiente, totalPagado: 0, numeroCuotas }
    registrar Auditoria (accion=CREAR_PLAN)
    devolver plan
```

## Constraints
- La reserva de stock y la creación del plan deben ser atómicas (misma transacción).

## Acceptance Criteria
- [ ] AC-003 pasa: producto con stock limitado queda reservado y no disponible para otros.
- [ ] Producto con stock ilimitado sigue visible en catálogo tras crear el plan.
- [ ] Producto sin stock disponible retorna 409 `PRODUCT_NOT_AVAILABLE`.

## Tests
- [ ] Integration: creación con stock limitado, ilimitado, y sin disponibilidad.

## Validation
```bash
npm run lint && npm run typecheck && npm test
```

## Definition of Done
- [ ] Implementation complete.
- [ ] Tests passing.
- [ ] No regression.
