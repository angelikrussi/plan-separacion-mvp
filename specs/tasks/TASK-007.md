# TASK-007 — Detalle de producto

## References
- FR-005, TS-001

## Objective
Mostrar el detalle completo de un producto, incluyendo opciones de plan.

## Scope
### In Scope
- `GET /api/productos/{id}`.
- Página `/producto/[id]`.

## Technical Changes
### Files
- `src/app/(public)/producto/[id]/page.tsx`
- `src/app/api/productos/[id]/route.ts`

## Behavior
1. Obtener producto por id.
2. Si no existe: `404 PRODUCT_NOT_FOUND`.
3. Retornar fotografía(s), nombre, descripción, precio, disponibilidad, categoría, `opcionesPlan`, condiciones.

## Acceptance Criteria
- [ ] Detalle muestra todos los campos requeridos por FR-005.
- [ ] Producto inexistente retorna 404.

## Tests
- [ ] Integration: detalle existente / inexistente.

## Validation
```bash
npm run lint && npm run typecheck && npm test
```

## Definition of Done
- [ ] Implementation complete.
- [ ] Tests passing.
- [ ] No regression.
