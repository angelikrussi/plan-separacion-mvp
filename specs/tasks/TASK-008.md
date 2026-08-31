# TASK-008 — Simulador de plan

## References
- FR-006, TS-001 (GET /api/productos/{id}/simular)

## Objective
Calcular el valor aproximado por cuota dado un producto y número de cuotas.

## Scope
### In Scope
- `GET /api/productos/{id}/simular?cuotas=N`.
- Componente de simulador en la página de detalle de producto.

## Technical Changes
### Files
- `src/lib/simulador.ts`
- `src/app/api/productos/[id]/simular/route.ts`

## Behavior
```text
simular(precio, cuotas):
    valorBase ← piso(precio / cuotas)
    residuo ← precio - (valorBase * cuotas)
    cuotas_1_a_n-1 ← valorBase
    cuota_final ← valorBase + residuo
    devolver { valorPorCuota: valorBase, valorTotal: precio, cuotaFinal: cuota_final }
```
(Redondeo definido en TS-001/vacío funcional: ajustar diferencia en la última cuota.)

## Acceptance Criteria
- [ ] Para un precio no divisible exacto entre cuotas, la suma de todas las cuotas simuladas es igual al precio total.
- [ ] `cuotas` fuera de las opciones configuradas del producto retorna 400.

## Tests
- [ ] Unit: cálculo con y sin residuo.

## Validation
```bash
npm run lint && npm run typecheck && npm test
```

## Definition of Done
- [ ] Implementation complete.
- [ ] Tests passing.
- [ ] No regression.
