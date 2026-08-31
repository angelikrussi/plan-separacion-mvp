# TASK-031 — Módulo de reportes: KPIs y rankings

## References
- FR-021, FR-022, TS-001 (ReportesModule)

## Objective
Implementar las agregaciones de datos que alimentan el dashboard gerencial.

## Technical Changes
### Files
- `src/lib/admin/reportes.ts`: `calcularKpis`, `planesPorEstado`, `topProductos`, `topCategorias`, `topClientes`, `abonosPorDia`, `filasReportePlanes`.

## Behavior
```text
calcularKpis():
    devolver conteos/sumas en paralelo:
      planesActivos, proximosAEntregar, entregados, cancelados,
      enProcesoEntrega, abonosAprobados, abonosRechazados,
      abonosPorRevisar, recaudoTotal (suma de Abono.valor APROBADO),
      carteraPendiente (suma de Plan.saldoPendiente ACTIVO)

topProductos(limite):
    agrupar Plan por productoId, contar, ordenar desc, tomar limite
    resolver nombre de producto

topCategorias(limite):
    traer Plan.producto.categoria de todos los planes
    agrupar en memoria (dataset pequeño en MVP), ordenar desc, tomar limite

topClientes(limite):
    agrupar Plan por clienteId, contar planes, ordenar por conteo desc, tomar limite
    resolver nombre de cliente

abonosPorDia(dias):
    listar Abono resueltos (APROBADO/RECHAZADO) en los últimos N días
    devolver serie diaria { fecha, aprobados, rechazados }
```

## Constraints
- Sin caché: cada llamada refleja el estado actual de la base de datos (AC-012).
- `topCategorias` agrega en memoria porque Prisma no permite `groupBy` sobre un campo de una relación directamente; aceptable para el volumen de datos del MVP.

## Acceptance Criteria
- [x] `calcularKpis` refleja cambios inmediatamente después de aprobar/rechazar un pago o crear/cancelar un plan.
- [x] Los tops respetan el límite solicitado y están ordenados de mayor a menor.

## Definition of Done
- [x] Implementation complete.
- [x] Verificado end-to-end con datos reales del flujo de prueba.
- [x] No regression.
