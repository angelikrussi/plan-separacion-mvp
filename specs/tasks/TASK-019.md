# TASK-019 — Servicio de auditoría

## References
- FR-017, BR-012, TS-001 (AuditoriaService)

## Objective
Centralizar el registro append-only de acciones sensibles, usado por TASK-009, 014, 015, 016, 017.

## Technical Changes
### Files
- `src/lib/auditoria.ts`
- `src/app/(admin)/admin/auditoria/page.tsx` (solo lectura)
- `src/app/api/admin/auditoria/route.ts` (GET, solo lectura)

## Behavior
```text
registrarAuditoria(entidad, entidadId, accion, actor, valoresAnteriores, valoresNuevos):
    INSERT INTO Auditoria (entidad, entidadId, accion, actor, fechaHora=now, valoresAnteriores, valoresNuevos)
```
No exponer ningún endpoint de update/delete sobre `Auditoria` (BR-012).

## Acceptance Criteria
- [ ] No existe endpoint de edición/borrado de auditoría.
- [ ] Un admin puede consultar la auditoría filtrando por entidad.

## Tests
- [ ] Unit: inserción de registro de auditoría.
- [ ] Integration: consulta filtrada por entidad.

## Validation
```bash
npm run lint && npm run typecheck && npm test
```

## Definition of Done
- [ ] Implementation complete.
- [ ] Tests passing.
- [ ] No regression.
