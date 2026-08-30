# FS-001 — Principal: plataforma de plan separe (MVP)

## Context

Principal es una plataforma web mobile-first de plan separe: un cliente aparta un producto y lo paga mediante abonos progresivos hasta completar el valor total, momento en el que el producto se libera y se gestiona su entrega. Este documento formaliza, con IDs estables, el comportamiento ya validado con el PO en `Principal_Documento_Tecnico.md` (raíz del repo, documento de contexto).

## Problem

Hoy no existe una plataforma que centralice catálogo, simulación de cuotas, creación de planes, registro de abonos con comprobante, verificación administrativa de pagos, actualización de saldo, auditoría y gestión de entrega. Sin esto, el proceso sería manual, no trazable y vulnerable a comprobantes fraudulentos.

## Goal

Permitir que un cliente descubra un producto, simule un plan, lo cree, abone hasta completarlo con verificación humana de cada pago, y reciba el producto — todo con trazabilidad completa de cada movimiento de saldo.

## Scope

### In Scope
- Registro y login de clientes (con 2FA).
- Catálogo, detalle de producto, simulador de cuotas.
- Creación de plan y reserva de stock cuando aplica.
- Registro de abonos con comprobante adjunto.
- Revisión, aprobación y rechazo de pagos por un administrador.
- Cancelación manual de plan por administrador.
- Ajuste manual de saldo por administrador, con auditoría.
- Historial de movimientos del cliente y auditoría interna.
- Liberación automática del producto al llegar a saldo $0.
- Registro de datos de entrega (recogida o envío).

### Out of Scope (MVP)
- 2FA para administradores.
- Roles administrativos granulares (solo existe un rol `administrador`).
- Integración con pasarela de pagos automática.
- Integración con WhatsApp.
- Metas de ahorro (sin producto asociado).
- Política de mora / vencimiento de plan.
- Confirmación de recepción por parte del cliente (solo el admin marca `ENTREGADO`).

## Actors

- **Cliente**: persona que crea cuenta, arma un plan y abona.
- **Administrador**: persona que revisa comprobantes, aprueba/rechaza pagos, cancela planes, ajusta saldos y gestiona entregas. Rol único en el MVP.
- **Sistema**: ejecuta transiciones automáticas (liberación al llegar a saldo $0).

## Preconditions

- El catálogo tiene al menos un producto publicado con una opción de plan configurada.
- El cliente tiene una cuenta verificable (correo único).

---

## Functional Requirements

### E01 — Gestión de clientes

#### FR-001 — Registro de cliente
El sistema debe permitir crear una cuenta con nombre completo, documento de identidad, celular, correo, contraseña e información adicional de validación de identidad.

#### FR-002 — Inicio de sesión con 2FA
El sistema debe permitir iniciar sesión con correo + contraseña, exigiendo un segundo factor de autenticación antes de otorgar acceso.

#### FR-003 — Consulta de perfil
El sistema debe permitir a un cliente autenticado consultar y actualizar su información de perfil.

### E02 — Catálogo y productos

#### FR-004 — Consulta de catálogo
El sistema debe permitir listar los productos disponibles con fotografía, nombre, precio, categoría y disponibilidad.

#### FR-005 — Detalle de producto
El sistema debe permitir consultar el detalle completo de un producto, incluyendo opciones de plan y condiciones.

### E03 — Simulación

#### FR-006 — Simulación de plan
El sistema debe calcular el valor aproximado por cuota dado un producto y un número de cuotas seleccionado.

### E04 — Creación del plan

#### FR-007 — Creación de plan
El sistema debe permitir a un cliente autenticado crear un plan para un producto, quedando en estado `ACTIVO`.

### E05 — Dashboard del cliente

#### FR-008 — Consulta de estado del plan
El sistema debe mostrar al cliente el valor total, total pagado, saldo pendiente, progreso, abonos realizados e historial de un plan propio.

### E06 — Abonos

#### FR-009 — Registro de abono
El sistema debe permitir a un cliente registrar un abono con comprobante adjunto, quedando en estado `PENDIENTE` sin afectar el saldo.

### E07 — Administración de pagos

#### FR-010 — Consulta de pagos pendientes
El sistema debe permitir a un administrador listar los abonos en estado `PENDIENTE` o `EN_REVISION`.

#### FR-011 — Revisión de comprobante
El sistema debe permitir a un administrador visualizar el comprobante de un abono, transicionando el abono a `EN_REVISION`.

#### FR-012 — Aprobación de pago
El sistema debe permitir a un administrador aprobar un abono en revisión, actualizando saldo, progreso e historial del plan.

#### FR-013 — Rechazo de pago
El sistema debe permitir a un administrador rechazar un abono en revisión, indicando un motivo, sin afectar el saldo.

#### FR-014 — Cancelación de plan
El sistema debe permitir a un administrador cancelar manualmente un plan `ACTIVO`, registrando un motivo y liberando la reserva de stock si existía.

#### FR-015 — Ajuste manual de saldo
El sistema debe permitir a un administrador ajustar manualmente el saldo de un plan, exigiendo un motivo y registrando el ajuste en auditoría.

### E08 — Historial y auditoría

#### FR-016 — Historial del cliente
El sistema debe permitir a un cliente consultar el historial de sus movimientos (abonos y su estado).

#### FR-017 — Registro de auditoría
El sistema debe registrar, para cada acción sensible, quién la realizó, cuándo, y los valores anteriores/nuevos.

### E09 — Liberación y entrega

#### FR-018 — Liberación automática
El sistema debe, al detectar que el saldo pendiente de un plan llega a $0, cambiar su estado a `COMPLETAMENTE_PAGADO` y luego a `PENDIENTE_DE_ENTREGA`.

#### FR-019 — Registro de entrega
El sistema debe permitir a un cliente con plan `PENDIENTE_DE_ENTREGA` elegir recogida o envío y registrar los datos correspondientes.

#### FR-020 — Marcar entrega completada
El sistema debe permitir a un administrador marcar una entrega como `ENTREGADO`.

---

## Business Rules

### BR-001
Solo un administrador autenticado y autorizado puede aprobar, rechazar o cancelar. *(FR-012, FR-013, FR-014)*

### BR-002
Un cliente solamente puede reportar un pago y adjuntar su comprobante; no puede aprobarlo ni modificar su saldo directamente. *(FR-009)*

### BR-003
Un abono en estado `PENDIENTE` no afecta el saldo del plan. *(FR-009)*

### BR-004
Un abono `RECHAZADO` no afecta el saldo del plan. *(FR-013)*

### BR-005
Un abono `APROBADO` sí afecta el saldo del plan. *(FR-012)*

### BR-006
Un abono solo se resuelve una vez: `PENDIENTE → EN_REVISION → APROBADO` o `RECHAZADO`, sin retroceder. *(FR-011, FR-012, FR-013)*

### BR-007
Un producto se reserva en exclusiva para un cliente solo si fue configurado con stock limitado. Con stock ilimitado, permanece visible para otros clientes. *(FR-007)*

### BR-008
Solo un administrador puede cancelar un plan `ACTIVO`, de forma manual. Al cancelar, la reserva de stock (si existía) se libera. *(FR-014)*

### BR-009
El sistema no permite registrar un abono cuyo valor sea mayor al saldo pendiente del plan. *(FR-009)*

### BR-010
El acceso de clientes requiere correo, contraseña y un segundo factor de autenticación. *(FR-002)*

### BR-011
Un ajuste manual de saldo exige motivo y queda registrado en auditoría con valor anterior y nuevo. *(FR-015, FR-017)*

### BR-012
Los registros de auditoría son de solo lectura una vez creados (append-only). *(FR-017)*

---

## Main Flow

1. Cliente se registra e inicia sesión (FR-001, FR-002).
2. Consulta catálogo y detalle de producto (FR-004, FR-005).
3. Simula plan (FR-006) y lo crea (FR-007).
4. Consulta estado del plan (FR-008).
5. Registra un abono con comprobante (FR-009) → queda `PENDIENTE`.
6. Administrador revisa el comprobante (FR-011) → `EN_REVISION`.
7. Administrador aprueba (FR-012) o rechaza (FR-013) el abono.
8. Si aprueba: saldo y progreso se actualizan; si llega a $0, se libera el producto (FR-018).
9. Cliente registra datos de entrega (FR-019).
10. Administrador marca la entrega como completada (FR-020).

## Alternative Flows

### AF-001 — Rechazo de pago
En el paso 7, si el administrador rechaza el abono, el cliente ve el motivo (FR-013) y puede registrar un nuevo abono (vuelve al paso 5).

### AF-002 — Cancelación de plan
En cualquier momento con el plan `ACTIVO`, el administrador puede cancelarlo (FR-014); el plan pasa a `CANCELADO` y no acepta más abonos.

## Error Flows

### EF-001 — Sobrepago
Si el valor del abono a registrar supera el saldo pendiente, el sistema rechaza el registro y pide corregir el valor (BR-009).

### EF-002 — Aprobación fuera de estado
Si se intenta aprobar/rechazar un abono que no está en `EN_REVISION`, el sistema rechaza la operación (BR-006).

### EF-003 — Concurrencia en revisión
Si un segundo administrador intenta abrir/resolver un abono que ya está `EN_REVISION` por otro administrador, el sistema lo bloquea y muestra quién lo tiene en revisión.

---

## Acceptance Criteria

### AC-001 (FR-001)
Given un correo no registrado previamente,
When una persona completa el formulario de registro con todos los datos obligatorios,
Then la cuenta queda creada y la contraseña se almacena con hash (nunca texto plano).

### AC-002 (FR-002, BR-010)
Given un cliente registrado,
When inicia sesión con correo y contraseña correctos pero no completa el 2FA,
Then el sistema no otorga acceso al dashboard.

### AC-003 (FR-007, BR-007)
Given un producto con stock limitado,
When un cliente crea un plan para ese producto,
Then el producto queda reservado en exclusiva y deja de estar disponible para otros clientes mientras el plan esté `ACTIVO`.

### AC-004 (FR-009, BR-009)
Given un plan con saldo pendiente de $180.000,
When el cliente intenta registrar un abono de $200.000,
Then el sistema rechaza el registro y no crea el abono.

### AC-005 (FR-009, BR-003)
Given un abono recién registrado,
When se consulta el saldo del plan inmediatamente después,
Then el saldo no cambia (el abono queda `PENDIENTE`).

### AC-006 (FR-011, EF-003)
Given un abono `PENDIENTE`,
When un administrador abre el detalle del comprobante,
Then el abono pasa a `EN_REVISION` y un segundo administrador que lo abra ve que ya está en revisión por el primero y no puede aprobarlo ni rechazarlo.

### AC-007 (FR-012, BR-005)
Given un abono `EN_REVISION` de $30.000 sobre un plan con saldo $180.000,
When el administrador lo aprueba,
Then el abono pasa a `APROBADO`, el saldo del plan queda en $150.000, y se registra qué administrador aprobó junto con fecha/hora.

### AC-008 (FR-013, BR-004)
Given un abono `EN_REVISION`,
When el administrador lo rechaza con un motivo,
Then el abono pasa a `RECHAZADO` con el motivo visible para el cliente, y el saldo del plan no cambia.

### AC-009 (FR-014, BR-008)
Given un plan `ACTIVO` con producto de stock limitado reservado,
When el administrador lo cancela con un motivo,
Then el plan pasa a `CANCELADO`, deja de aceptar abonos, y el producto vuelve a estar disponible.

### AC-010 (FR-018)
Given un plan `ACTIVO` cuyo último abono aprobado deja el saldo pendiente en $0,
When se procesa la aprobación,
Then el plan pasa automáticamente a `COMPLETAMENTE_PAGADO` y luego a `PENDIENTE_DE_ENTREGA`.

### AC-011 (FR-015, BR-011)
Given un plan con saldo $150.000,
When un administrador ajusta manualmente el saldo a $120.000 indicando un motivo,
Then se registra en auditoría el valor anterior ($150.000), el nuevo ($120.000), el administrador, el motivo y la fecha/hora.

---

## Non-Goals

- No se implementa verificación automática de transacciones bancarias en el MVP.
- No se implementa confirmación de recepción por el cliente.
- No se implementa 2FA para administradores.
- No se implementan roles administrativos granulares.

## Open Questions

Ver `Principal_Documento_Tecnico.md` (raíz), sección 9 — 13 vacíos identificados. Los que requieren decisión técnica quedan resueltos en `TS-001` (ver sección "Decisiones derivadas de vacíos funcionales").
