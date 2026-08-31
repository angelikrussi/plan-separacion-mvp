# TASK-032 — Dashboard gerencial (UI)

## References
- FR-021, FR-022, TASK-031

## Objective
Construir la página `/admin` con KPIs, gráficas y rankings, y darle al panel admin un nav persistente.

## Technical Changes
### Files
- `src/app/admin/page.tsx`
- `src/components/admin/AdminShell.tsx` (layout ancho, nav: Dashboard/Pagos/Entregas/Auditoría)
- `src/components/admin/KpiCard.tsx`
- `src/components/admin/DashboardCharts.tsx` (`PlanesPorEstadoChart` — pie, `AbonosPorDiaChart` — líneas)
- `src/components/admin/TopList.tsx` (ranking simple nombre + valor, sin gráfica)
- `src/app/admin/login/page.tsx` (redirige a `/admin` en vez de `/admin/pagos`)
- `src/app/admin/pagos/page.tsx`, `src/app/admin/entregas/page.tsx`, `src/app/admin/auditoria/page.tsx` (migrados de `AppShell` a `AdminShell`)

## Behavior
1. `AdminShell` reemplaza los enlaces "Volver" del panel admin por un nav fijo — reduce la dependencia de historial de navegación.
2. KPIs en tarjetas (`KpiCard`), con color según si el valor es positivo/negativo (`tone`).
3. Top 10 de productos, categorías y clientes: **lista numerada, no gráfica** — decisión explícita del usuario tras ver una primera versión con barras ("no era necesario gráfica, solo... juan pérez # de productos").
4. Gráficas (pie de planes por estado, línea de aprobados/rechazados) sí se mantienen para esas dos vistas.

## Acceptance Criteria
- [x] `/admin` muestra los 8 KPIs de FR-021 y los 3 rankings de FR-022 (como lista, no gráfica).
- [x] La navegación entre Dashboard/Pagos/Entregas/Auditoría no depende de "Volver".

## Definition of Done
- [x] Implementation complete.
- [x] Verificado visualmente en navegador (login admin → dashboard).
- [x] No regression.
