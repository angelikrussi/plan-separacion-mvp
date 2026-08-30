# Principal — Plataforma de plan separe
### Documento técnico de producto

Visión, épicas, historias de usuario, reglas de negocio y modelo de datos para el MVP, validados como Product Owner a partir del documento base.

**Versión 1.1 · 30 de agosto de 2026 · Estado: MVP · 9 épicas · 18 historias de usuario**

---

## 1. Visión de producto

| Campo | Descripción |
|---|---|
| **Producto** | Principal |
| **Tipo** | Plataforma web mobile-first de plan separe y ahorro. |
| **Usuario principal** | Cliente que quiere adquirir productos mediante pagos progresivos. |
| **Problema** | El cliente necesita una forma sencilla de separar un producto, abonar, conocer su saldo y hacer seguimiento hasta recibirlo. |
| **Solución** | Una plataforma que centraliza catálogo, planes, pagos, comprobantes, validación, saldos, liberación y entrega. |

---

## 2. Validación del PO — qué cambió respecto al documento base

El documento base dejaba varias reglas de negocio sin resolver y contenía una duplicación entre épicas. Esta versión las resuelve así:

### 2.1 Decisiones tomadas con el PO (30 ago 2026)

- **Autenticación (HU-002):** el login de clientes exige correo + contraseña + segundo factor (2FA). Antes estaba marcado como decisión pendiente.
- **Disponibilidad del producto durante el plan (HU-007):** depende de si el producto fue configurado con stock limitado. Si tiene stock limitado, se reserva en exclusiva para el cliente; si es ilimitado, sigue visible en el catálogo. Antes estaba marcado como decisión pendiente.
- **Cancelación de un plan:** en el MVP solo el administrador puede cancelar un plan, de forma manual y caso por caso. El cliente no tiene autocancelación. No existía ninguna regla al respecto.
- **Sobrepago en un abono:** el sistema bloquea el registro si el valor del abono supera el saldo pendiente, y pide corregirlo. No existía ninguna regla al respecto.

### 2.2 Corrección de consistencia: épicas duplicadas

El documento base definía dos veces la misma funcionalidad: **E07 — Administración de pagos** (HU-010 a HU-013) y **E10 — Dashboard del administrador** (HU-018 y HU-019) describen el mismo flujo de revisión, aprobación y rechazo de pagos, con las mismas reglas RB-01 a RB-06. En este documento se consolidaron en una sola épica (E07), conservando los IDs originales HU-010 a HU-013 y agregando el detalle de pantallas y reglas que traía E10. No se crean HU-018 ni HU-019 como historias independientes, para no duplicar el backlog.

### 2.3 Vacíos adicionales identificados

Se detectaron 10 vacíos que no son decisiones de PO urgentes pero sí deben resolverse antes de construir. Quedan documentados con una recomendación en la [sección 9](#9-decisiones-pendientes-y-supuestos).

---

## 3. Flujo del MVP

Recorrido completo que el primer lanzamiento debe soportar de punta a punta:

1. Cliente se registra e inicia sesión
2. Consulta el catálogo y el detalle de un producto
3. Simula el plan (número de cuotas → valor aproximado)
4. Crea el plan
5. Realiza un abono y sube el comprobante
6. El abono queda pendiente — no se descuenta del saldo todavía
7. El administrador revisa el comprobante
8. Aprueba o rechaza el pago
9. Si aprueba: se actualiza el saldo y el progreso del plan
10. El cliente sigue abonando hasta que el saldo llega a $0
11. El producto se libera y pasa a gestión de entrega

---

## 4. Épicas e historias de usuario

### E01 — Gestión de clientes

*Permitir que una persona cree una cuenta y acceda de forma segura a su espacio dentro de Principal.*

#### HU-001 — Registro `P0`

**Como** cliente, **quiero** crear una cuenta, **para** poder adquirir productos y administrar mis planes.

Datos iniciales: nombre completo, documento de identidad, celular, correo, contraseña e información adicional para validar identidad.

Criterios de aceptación:
- El cliente puede diligenciar todos los datos obligatorios.
- El sistema valida que el correo no esté registrado previamente.
- El sistema valida los datos requeridos.
- La contraseña se almacena de forma segura (hash, nunca en texto plano).
- Al registrarse correctamente, la cuenta queda creada.
- El sistema informa al usuario si existe algún error.

#### HU-002 — Iniciar sesión `P0` · *Decidido con el PO*

**Como** cliente, **quiero** iniciar sesión, **para** acceder a mis planes, pagos y productos.

Criterios de aceptación:
- El cliente inicia sesión con correo y contraseña.
- **[Nuevo]** El sistema exige un segundo factor de autenticación (2FA) además de la contraseña.
- Si las credenciales o el 2FA son incorrectos, el sistema informa el error sin revelar cuál dato falló.
- Tras autenticarse correctamente, el cliente accede a su dashboard.

> **Nota:** el mecanismo exacto del 2FA (SMS, app autenticadora o correo) y el flujo de recuperación de contraseña quedan como definición técnica pendiente — ver [sección 9](#9-decisiones-pendientes-y-supuestos).

#### HU-003 — Consultar mi información `P0`

**Como** cliente, **quiero** consultar mi perfil, **para** revisar y mantener actualizada mi información.

---

### E02 — Catálogo y productos

*Permitir que el cliente encuentre un producto, conozca su precio y condiciones, y decida si quiere iniciar un plan.*

#### HU-004 — Consultar catálogo `P0`

**Como** cliente, **quiero** visualizar los productos disponibles, **para** encontrar el que quiero adquirir.

Criterios de aceptación:
- El cliente puede acceder al catálogo.
- El sistema muestra los productos disponibles.
- Cada producto muestra como mínimo: fotografía, nombre, precio, categoría y disponibilidad.
- El cliente puede seleccionar un producto para ver su detalle.

#### HU-005 — Consultar detalle de producto `P0`

**Como** cliente, **quiero** consultar el detalle de un producto, **para** conocer sus características y condiciones antes de crear un plan.

Debe mostrar: fotografía, nombre, descripción, precio, disponibilidad, categoría, opciones de plan, número de cuotas, valor aproximado por cuota y condiciones.

---

### E03 — Simulación del plan

*Parte diferencial de Principal: dejar que el cliente proyecte cuánto pagaría antes de comprometerse.*

#### HU-006 — Simular plan de pago `P0`

**Como** cliente, **quiero** seleccionar el número de cuotas, **para** conocer cuánto tendría que pagar aproximadamente.

Criterios de aceptación:
- El sistema recibe el producto seleccionado.
- El cliente puede seleccionar una opción de cuotas disponible.
- El sistema calcula el valor aproximado de la cuota.
- Se muestra claramente el valor total.
- Se muestran cargos, comisiones u otros valores cuando el modelo comercial los contemple.

---

### E04 — Creación del plan

*El cliente ya decidió el producto y el plan; el sistema formaliza el compromiso.*

#### HU-007 — Crear plan `P0` · *Decidido con el PO*

**Como** cliente, **quiero** crear un plan para un producto, **para** comenzar a realizar abonos.

Flujo: seleccionar producto → seleccionar plan → revisar condiciones → confirmar → plan creado.

Criterios de aceptación:
- El cliente puede revisar las condiciones del plan antes de confirmar.
- Al confirmar, el plan queda registrado en estado `ACTIVO`.
- **[Nuevo]** Si el producto tiene stock limitado, se reserva en exclusiva para ese cliente y deja de estar disponible para otros mientras el plan esté activo.
- **[Nuevo]** Si el producto tiene stock ilimitado, permanece visible en el catálogo para otros clientes.

> **Nota:** queda pendiente definir si un cliente puede tener más de un plan activo simultáneamente — ver [sección 9](#9-decisiones-pendientes-y-supuestos).

---

### E05 — Dashboard del cliente

*Una vez creado el plan, el cliente necesita saber cuánto ha pagado y cuánto le falta.*

#### HU-008 — Consultar estado del plan `P0`

**Como** cliente, **quiero** consultar mi plan, **para** conocer mi progreso y saldo.

Criterios de aceptación:
- Valor total del producto.
- Total pagado y saldo pendiente.
- Porcentaje de progreso.
- Abonos realizados y próximo pago sugerido.
- Historial y estado actual del plan.

---

### E06 — Abonos y comprobantes

*Una de las épicas críticas del producto: aquí el cliente reporta que pagó.*

#### HU-009 — Registrar un abono `P0` · *Decidido con el PO*

**Como** cliente, **quiero** registrar un abono, **para** informar que realicé un pago.

Criterios de aceptación:
- El cliente adjunta el comprobante junto con los datos del abono (valor, método de pago, fecha, referencia).
- **[Nuevo]** El sistema valida que el valor del abono no supere el saldo pendiente del plan; si lo supera, bloquea el registro y pide corregir el valor.
- El abono queda en estado `PENDIENTE` — el sistema **no** lo descuenta del saldo de inmediato.

---

### E07 — Administración de pagos
*Consolida E07 + E10 del documento base*

*El administrador de pagos verifica los comprobantes reportados por los clientes y decide si el saldo se actualiza.*

**Acceso y regla general:** el administrador ingresa con usuario + contraseña. Solo un usuario con permisos de administrador de pagos puede aprobar, rechazar o cancelar. Un cliente nunca puede aprobar su propio pago ni modificar directamente su saldo (RB-02).

#### HU-010 — Consultar pagos pendientes `P0`

**Como** administrador de pagos, **quiero** consultar los pagos pendientes, **para** saber cuáles debo revisar.

Cada registro muestra: cliente, producto, valor del abono, método, fecha, referencia, comprobante y estado, con una acción "Revisar".

#### HU-011 — Revisar comprobante `P0`

**Como** administrador de pagos, **quiero** visualizar el comprobante, **para** verificar que la transacción corresponde al pago reportado.

Al abrir el detalle, el pago pasa de `PENDIENTE` a `EN_REVISION` (ver [sección 6](#6-máquinas-de-estado)).

#### HU-012 — Aprobar pago `P0`

**Como** administrador de pagos, **quiero** aprobar un pago después de verificarlo, **para** actualizar el saldo del cliente de manera controlada y segura.

Criterios de aceptación:
- Solo un administrador autorizado y autenticado puede aprobar.
- El pago cambia a estado `APROBADO`.
- El sistema actualiza el saldo, el progreso del plan y el historial.
- Se registra qué administrador aprobó, junto con fecha y hora.
- El sistema verifica si el saldo llegó a $0 (dispara E09).
- El cliente recibe la actualización de su pago.

#### HU-013 — Rechazar pago `P0`

**Como** administrador de pagos, **quiero** rechazar un pago indicando el motivo, **para** dejar evidencia de por qué no fue aprobado.

Motivos: comprobante inválido, transacción no encontrada, valor diferente, comprobante duplicado, datos inconsistentes, transacción cancelada, otro.

Criterios de aceptación:
- El pago cambia a estado `RECHAZADO` con el motivo registrado.
- El saldo del plan no cambia.
- El cliente puede ver el motivo del rechazo.

#### HU-020 — Cancelar un plan `P0` · *Nueva — decidida con el PO*

**Como** administrador, **quiero** cancelar manualmente el plan de un cliente, **para** gestionar casos excepcionales (por ejemplo, a solicitud del cliente).

Criterios de aceptación:
- Solo el administrador puede cancelar; el cliente no tiene esta opción en el MVP.
- El administrador registra un motivo de cancelación.
- El plan cambia a estado `CANCELADO` y deja de aceptar abonos.
- Si el producto estaba reservado en exclusiva (stock limitado), se libera automáticamente.

> **Nota:** el MVP no define una política de reembolso: la cancelación cambia el estado del plan, pero cualquier devolución de dinero se gestiona operativamente fuera del sistema — ver [sección 9](#9-decisiones-pendientes-y-supuestos).

---

### E08 — Historial y auditoría

*Trazabilidad de todo lo que le pasa a un plan y a un pago.*

#### HU-014 — Consultar historial `P0`

**Como** cliente, **quiero** consultar mis movimientos, **para** saber qué pagos han sido registrados y cuál es su estado.

#### HU-015 — Registrar auditoría `P0`

**Como** negocio, **quiero** registrar las acciones importantes, **para** tener trazabilidad de las operaciones.

La auditoría debe permitir conocer quién hizo la acción, cuándo y qué valores cambiaron.

---

### E09 — Liberación y entrega

*El plan se completa y el producto pasa de estar reservado a estar en manos del cliente.*

#### HU-016 — Liberar producto `P0`

**Como** sistema, **quiero** detectar cuándo el saldo llega a $0, **para** cambiar el plan a completamente pagado y comenzar la entrega.

#### HU-017 — Gestionar entrega `P0`

**Como** cliente, **quiero** elegir cómo recibo mi producto, **para** completar el proceso de compra.

El cliente elige recogida o envío. Para envío: nombre del receptor, teléfono, ciudad, dirección, barrio, punto de referencia y fecha preferida cuando aplique.

> **Nota:** no se define quién marca la entrega como completada ni si el cliente confirma la recepción — ver [sección 9](#9-decisiones-pendientes-y-supuestos).

---

## 5. Reglas de negocio

Reglas del documento base (RB-01 a RB-06) más las que se derivan de las decisiones tomadas hoy (RB-07 a RB-10).

| Regla | Descripción |
|---|---|
| `RB-01` | Solo el administrador autenticado y autorizado puede aprobar o rechazar pagos. |
| `RB-02` | El cliente solamente puede reportar un pago y adjuntar su comprobante. No puede aprobarlo ni modificar su saldo. |
| `RB-03` | Un pago pendiente no afecta el saldo. |
| `RB-04` | Un pago rechazado no afecta el saldo. |
| `RB-05` | Un pago aprobado sí afecta el saldo. |
| `RB-06` | Un pago solo puede resolverse una vez: pasa de `PENDIENTE` a `EN_REVISION` y de ahí a `APROBADO` o `RECHAZADO`, sin poder volver atrás. |
| `RB-07` 🆕 | Un producto solo se reserva en exclusiva para un cliente si fue configurado con stock limitado. Si tiene stock ilimitado, sigue disponible para otros clientes mientras el plan está activo. |
| `RB-08` 🆕 | Solo un administrador puede cancelar un plan activo, de forma manual. Al cancelar, el producto reservado (si aplica) se libera. |
| `RB-09` 🆕 | El sistema no permite registrar un abono cuyo valor sea mayor al saldo pendiente del plan. |
| `RB-10` 🆕 | El acceso de clientes requiere correo, contraseña y un segundo factor de autenticación (2FA). |

---

## 6. Máquinas de estado

El documento base mezclaba el estado del pago individual con el del plan completo. Se separan explícitamente.

### Estado de un abono / pago

```
PENDIENTE → EN_REVISION → APROBADO
                        └→ RECHAZADO
```

RB-06: una vez resuelto (aprobado o rechazado), el pago no cambia de estado.

### Estado de un plan

```
ACTIVO → COMPLETAMENTE_PAGADO → PENDIENTE_DE_ENTREGA → ENTREGADO
   └→ (solo admin, HU-020) → CANCELADO
```

Formalizado en esta validación: el documento base no distinguía el estado del plan del estado de cada abono.

---

## 7. Modelo de datos

No existía en el documento base; se deriva de los campos mencionados en cada historia.

**CLIENTE**
`id · nombre_completo · documento_identidad · celular · correo · password_hash · config_2fa · fecha_registro`

**PRODUCTO**
`id · nombre · descripcion · fotografias · precio · categoria · disponibilidad · stock_limitado (nuevo) · cantidad_disponible (nuevo) · opciones_de_plan · condiciones`

**PLAN**
`id · cliente_id · producto_id · valor_total · numero_cuotas · estado (ACTIVO / COMPLETAMENTE_PAGADO / PENDIENTE_DE_ENTREGA / ENTREGADO / CANCELADO) · total_pagado · saldo_pendiente · fecha_creacion · motivo_cancelacion (nuevo)`

**ABONO**
`id · plan_id · valor · metodo_de_pago · fecha · referencia · comprobante_url · estado (PENDIENTE / EN_REVISION / APROBADO / RECHAZADO) · motivo_rechazo · administrador_id · fecha_resolucion`

**ADMINISTRADOR**
`id · usuario · password_hash · rol (admin_pagos)`

**ENTREGA**
`id · plan_id · tipo (recogida / envio) · nombre_receptor · telefono · ciudad · direccion · barrio · punto_referencia · fecha_preferida · estado_entrega`

**AUDITORIA**
`id · entidad · entidad_id · accion · actor · fecha_hora · valores_anteriores · valores_nuevos`

---

## 8. Backlog consolidado

| ID | Épica | Historia | Prioridad | Estado |
|---|---|---|---|---|
| `HU-001` | E01 | Registrarse | P0 | Definida |
| `HU-002` | E01 | Iniciar sesión | P0 | Resuelta hoy (2FA) |
| `HU-003` | E01 | Consultar perfil | P0 | Definida |
| `HU-004` | E02 | Consultar catálogo | P0 | Definida |
| `HU-005` | E02 | Consultar detalle de producto | P0 | Definida |
| `HU-006` | E03 | Simular plan de pago | P0 | Definida |
| `HU-007` | E04 | Crear plan | P0 | Resuelta hoy (stock) |
| `HU-008` | E05 | Consultar estado del plan | P0 | Definida |
| `HU-009` | E06 | Registrar un abono | P0 | Resuelta hoy (sobrepago) |
| `HU-010` | E07 | Consultar pagos pendientes | P0 | Definida |
| `HU-011` | E07 | Revisar comprobante | P0 | Definida |
| `HU-012` | E07 | Aprobar pago | P0 | Definida |
| `HU-013` | E07 | Rechazar pago | P0 | Definida |
| `HU-014` | E08 | Consultar historial | P0 | Definida |
| `HU-015` | E08 | Registrar auditoría | P0 | Definida |
| `HU-016` | E09 | Liberar producto | P0 | Definida |
| `HU-017` | E09 | Gestionar entrega | P0 | Parcial |
| `HU-020` | E07 | Cancelar un plan | P0 | Nueva hoy |

---

## 9. Decisiones pendientes y supuestos

Vacíos detectados en la validación que no son bloqueantes para este documento, pero sí deben resolverse antes de construir. Cada uno trae una recomendación de referencia.

**Plazo del plan y mora.**
Vacío: no se define un tiempo máximo para completar un plan ni penalización por atraso. Recomendación: para el MVP, no establecer vencimiento (el plan permanece `ACTIVO` indefinidamente); evaluar en una siguiente fase un recordatorio de pago y una política de mora.

**Redondeo de cuotas.**
Vacío: el ejemplo del documento divide valores exactos; en la práctica habrá decimales. Recomendación: redondear cada cuota al peso más cercano y ajustar la diferencia en la última cuota.

**Confirmación de entrega (HU-017).**
Vacío: no se define quién marca el estado `ENTREGADO` ni si el cliente confirma recepción. Recomendación: que el administrador marque la entrega como completada; evaluar confirmación del cliente en una siguiente fase.

**Gestión de catálogo y clientes desde el panel admin.**
Vacío: el dashboard del administrador (E07) referencia accesos a "Clientes" y "Productos", pero solo se detalla el módulo de pagos. Recomendación: definir HUs de administración de catálogo (CRUD de productos) y consulta de clientes en una siguiente iteración, o declararlas explícitamente fuera de alcance del MVP.

**Disparador exacto de EN_REVISION y concurrencia.**
Vacío: no se especifica si el paso a "en revisión" ocurre al abrir el detalle o al pulsar un botón, ni qué pasa si dos administradores abren el mismo pago a la vez. Recomendación: que el estado cambie a `EN_REVISION` al abrir el detalle, con bloqueo optimista: un segundo administrador ve "en revisión por [nombre]" y no puede aprobar ni rechazar.

**Canal de notificación al cliente.**
Vacío: HU-012 menciona "notificar al cliente" sin definir el canal. Recomendación: correo electrónico como canal mínimo para el MVP.

**Formato y tamaño del comprobante.**
Vacío: no se definen validaciones del archivo adjunto. Recomendación: aceptar JPG, PNG y PDF, con un tamaño máximo razonable (por ejemplo, 5 MB).

**Planes múltiples por cliente.**
Vacío: no se define si un cliente puede tener más de un plan activo a la vez. Recomendación (supuesto usado en este documento): sí, uno por producto, sin límite explícito en el MVP.

**Inmutabilidad de la auditoría.**
Vacío: no se define si los registros de auditoría pueden editarse o eliminarse. Recomendación: que sean de solo lectura una vez creados (append-only).

**Autenticación del administrador.**
Vacío: con la decisión de exigir 2FA a los clientes, el administrador —que aprueba movimientos de dinero— hoy solo requiere usuario y contraseña. Recomendación: evaluar extender el 2FA también al login del administrador, dado que su rol tiene mayor impacto financiero por acción.

---

*Principal — Documento técnico de producto · Consolidado a partir de la conversación de descubrimiento con el PO · 30 de agosto de 2026.*
