# TASK-023 — Verificación end-to-end en local

## References
- FS-001 (Main Flow), todas las AC de TASK-001 a TASK-022

## Objective
Verificar manualmente en `npm run dev` el flujo completo del MVP con datos seed.

## Behavior
1. Registro de cliente demo → login con 2FA.
2. Explorar catálogo → detalle → simulador.
3. Crear plan sobre producto con stock limitado (verificar reserva).
4. Registrar abono con comprobante de prueba (verificar bloqueo de sobrepago).
5. Login como admin demo → revisar comprobante → aprobar.
6. Verificar saldo actualizado en dashboard del cliente.
7. Repetir abonos hasta saldo $0 → verificar liberación automática.
8. Registrar entrega → marcar entregado como admin.
9. Verificar auditoría registra las acciones anteriores.

## Acceptance Criteria
- [ ] El flujo completo corre sin errores en `npm run dev`.
- [ ] Cada paso refleja el estado esperado según FS-001.

## Validation
```bash
npm run dev
```

## Definition of Done
- [ ] Flujo completo verificado manualmente.
- [ ] Sin errores en consola del servidor ni del navegador.
