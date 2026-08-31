# TASK-033 — Exportación a Excel del reporte de planes

## References
- FR-023, TS-001 (API Contract — Reportes)

## Objective
Permitir al administrador descargar el detalle de todos los planes en un archivo `.xlsx`.

## Technical Changes
### Files
- `src/app/api/admin/reportes/planes/route.ts`

## Behavior
```text
GET /api/admin/reportes/planes:
    verificar sesión admin

    filas ← filasReportePlanes()   # TASK-031, incluye cálculo de "alerta"

    construir hoja Excel con columnas:
      Item, ID Plan, Fecha creación, Cliente, Correo, Producto,
      Valor total, Total pagado, Saldo pendiente, Estado del plan,
      Fecha último abono, Días sin abonar, Alerta

    devolver buffer .xlsx con Content-Disposition: attachment
```

## Constraints
- "Alerta" es un heurístico (30+ días sin abono en plan ACTIVO), no una política de mora validada — debe quedar visible como tal (ver nota en FR-023 y en el propio código).
- Requiere sesión de administrador (mismo patrón que el resto de `/api/admin/**`).

## Acceptance Criteria
- [x] AC-013 pasa: el archivo descargado tiene una fila por plan con las columnas especificadas.
- [x] Un cliente (no admin) recibe 401 al intentar acceder al endpoint.

## Definition of Done
- [x] Implementation complete.
- [x] Verificado: descarga real confirmada (200, `Content-Type` de xlsx).
- [x] No regression.
