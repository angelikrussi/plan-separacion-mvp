# TS-001 — Principal: arquitectura técnica del MVP

## References
- FS-001
- ADR-001, ADR-002, ADR-003, ADR-004

## Architecture Context

Monolito Next.js 14 (App Router). Un solo repo/proceso sirve páginas públicas, privadas de cliente, privadas de admin, y API routes.

```text
Browser (mobile-first)
      │ HTTPS
      ▼
Next.js App Router
 ├─ (public)  /            /catalogo  /producto/[id]  /simulador
 ├─ (cliente) /dashboard   /planes/[id]  /perfil
 ├─ (admin)   /admin/pagos  /admin/planes  /admin/auditoria
 └─ /api/**  (Route Handlers — lógica de negocio)
      │
      ▼
Application layer (use cases)
      │
      ▼
Prisma ORM
      │
      ▼
Base de datos relacional (SQLite en dev, PostgreSQL en prod — ADR-004)
      │
      └─ Storage de comprobantes (adapter: filesystem)
```

## Proposed Design

Capas por responsabilidad dentro de `src/`:

```text
Controller (Route Handler)
   │  valida request, autentica, mapea errores a HTTP
   ▼
Use Case (application)
   │  orquesta reglas de negocio
   ▼
Repository (Prisma)
   │  persistencia
   ▼
Database
```

## Components

### AuthModule
Responsabilidad: registro, login con 2FA, sesión (NextAuth Credentials + TOTP), hash de contraseñas.
Dependencias: ClienteRepository, TotpService.
Constraints: nunca persiste contraseña en texto plano; nunca expone cuál credencial falló.

### CatalogoModule
Responsabilidad: listar productos, detalle, disponibilidad.
Dependencias: ProductoRepository.

### SimuladorModule
Responsabilidad: calcular cuota aproximada a partir de precio y número de cuotas.
Dependencias: ninguna (cálculo puro).

### PlanModule
Responsabilidad: crear plan, reservar stock si aplica, consultar estado, cancelar.
Dependencias: PlanRepository, ProductoRepository, AuditoriaService.

### AbonoModule
Responsabilidad: registrar abono + comprobante, validar sobrepago, transición de estados.
Dependencias: AbonoRepository, PlanRepository, StorageAdapter.

### AdminPagosModule
Responsabilidad: listar pendientes, poner en revisión (bloqueo optimista), aprobar, rechazar, ajuste manual de saldo.
Dependencias: AbonoRepository, PlanRepository, AuditoriaService.

### EntregaModule
Responsabilidad: registrar datos de entrega, marcar como entregado.
Dependencias: EntregaRepository, PlanRepository.

### AuditoriaService
Responsabilidad: insertar registros append-only para toda acción sensible.
Constraints: sin update/delete expuestos.

## Data Model

### Cliente
Fields: `id, nombreCompleto, documentoIdentidad, celular, correo, passwordHash, totpSecret, totpHabilitado, fechaRegistro`
Constraints: `correo` único, `passwordHash` no nulo.
Indexes: único en `correo`.

### Producto
Fields: `id, nombre, descripcion, precio, categoria, fotos[], stockLimitado (bool), cantidadDisponible (nullable), opcionesPlan (json), condiciones`
Relations: 1—N con `Plan`.

### Plan
Fields: `id, clienteId, productoId, valorTotal, numeroCuotas, estado, totalPagado, saldoPendiente, fechaCreacion, motivoCancelacion (nullable)`
Estado: `ACTIVO | COMPLETAMENTE_PAGADO | PENDIENTE_DE_ENTREGA | ENTREGADO | CANCELADO`
Relations: N—1 con `Cliente` y `Producto`; 1—N con `Abono`; 1—1 con `Entrega`.
Indexes: `clienteId`, `estado`.

### Abono
Fields: `id, planId, valor, metodoPago, fecha, referencia (nullable), comprobanteUrl, estado, motivoRechazo (nullable), administradorId (nullable), fechaResolucion (nullable), revisadoPor (nullable), revisadoEn (nullable)`
Estado: `PENDIENTE | EN_REVISION | APROBADO | RECHAZADO`
Relations: N—1 con `Plan`; N—1 opcional con `Administrador`.
Indexes: `planId`, `estado`.

### Administrador
Fields: `id, usuario, passwordHash, rol`
Constraints: `usuario` único.

### Entrega
Fields: `id, planId, tipo (recogida|envio), nombreReceptor (nullable), telefono (nullable), ciudad (nullable), direccion (nullable), barrio (nullable), puntoReferencia (nullable), fechaPreferida (nullable), estadoEntrega`
Relations: 1—1 con `Plan`.
Indexes: único en `planId`.

### Auditoria
Fields: `id, entidad, entidadId, accion, actor, fechaHora, valoresAnteriores (json), valoresNuevos (json)`
Indexes: `entidadId`.
Constraints: append-only.

## API Contract

### Auth
```text
POST /api/auth/registro
  Request: { nombreCompleto, documentoIdentidad, celular, correo, password }
  Response: 201 { clienteId }
  Errors: 400 VALIDATION_ERROR, 409 EMAIL_ALREADY_IN_USE

POST /api/auth/login
  Request: { correo, password }
  Response: 200 { requiereTotp: true, loginToken } | 200 { session }
  Errors: 401 INVALID_CREDENTIALS

POST /api/auth/login/totp
  Request: { loginToken, codigo }
  Response: 200 { session }
  Errors: 401 INVALID_TOTP
```

### Catálogo
```text
GET /api/productos              → 200 Producto[]
GET /api/productos/{id}         → 200 Producto | 404 PRODUCT_NOT_FOUND
GET /api/productos/{id}/simular?cuotas=N → 200 { valorPorCuota, valorTotal }
```

### Planes
```text
POST /api/planes
  Auth: cliente
  Request: { productoId, numeroCuotas }
  Response: 201 Plan
  Errors: 401, 404 PRODUCT_NOT_FOUND, 409 PRODUCT_NOT_AVAILABLE

GET /api/planes/{id}            Auth: cliente (owner) → 200 Plan con abonos
POST /api/planes/{id}/cancelar  Auth: admin → 200 Plan | 409 INVALID_STATE
POST /api/planes/{id}/ajuste-saldo  Auth: admin
  Request: { nuevoSaldo, motivo }
  Response: 200 Plan
  Errors: 400 VALIDATION_ERROR (motivo requerido)
```

### Abonos
```text
POST /api/planes/{id}/abonos
  Auth: cliente (owner)
  Request: multipart { valor, metodoPago, fecha, referencia?, comprobante(file) }
  Response: 201 Abono
  Errors: 409 OVERPAYMENT, 400 INVALID_FILE

GET /api/admin/abonos?estado=PENDIENTE|EN_REVISION   Auth: admin → 200 Abono[]
POST /api/admin/abonos/{id}/revisar   Auth: admin → 200 Abono (EN_REVISION)  | 409 ALREADY_IN_REVIEW
POST /api/admin/abonos/{id}/aprobar   Auth: admin → 200 Abono | 409 INVALID_STATE | 403 NOT_REVIEWER
POST /api/admin/abonos/{id}/rechazar  Auth: admin
  Request: { motivo }
  Response: 200 Abono | 409 INVALID_STATE
```

### Entregas
```text
POST /api/planes/{id}/entrega
  Auth: cliente (owner)
  Request: { tipo, nombreReceptor?, telefono?, ciudad?, direccion?, barrio?, puntoReferencia?, fechaPreferida? }
  Response: 201 Entrega

POST /api/admin/entregas/{id}/entregar  Auth: admin → 200 Entrega (ENTREGADO)
```

Formato de error estándar:
```json
{ "error": { "code": "OVERPAYMENT", "message": "..." } }
```

## Domain Model

Entities: `Cliente, Producto, Plan, Abono, Administrador, Entrega, Auditoria`.
States: ver sección "State Transitions".

## State Transitions

```text
Abono:
PENDIENTE → EN_REVISION → APROBADO
                        └→ RECHAZADO
(sin retroceso — BR-006)

Plan:
ACTIVO → COMPLETAMENTE_PAGADO → PENDIENTE_DE_ENTREGA → ENTREGADO
   └→ CANCELADO (solo desde ACTIVO, admin)

Entrega:
PENDIENTE_DE_PREPARACION → PREPARADO → DESPACHADO → ENTREGADO
```

## Transactions

Aprobar pago (FR-012) debe ser una única transacción DB:
```text
BEGIN
1. Verificar Abono.estado == EN_REVISION y Abono.revisadoPor == adminActual
2. Abono.estado = APROBADO, fechaResolucion = now, administradorId = adminActual
3. Plan.totalPagado += Abono.valor
4. Plan.saldoPendiente -= Abono.valor
5. Si Plan.saldoPendiente == 0: Plan.estado = COMPLETAMENTE_PAGADO → PENDIENTE_DE_ENTREGA
6. Insertar Auditoria (accion=APROBAR_PAGO)
COMMIT
```
Si cualquier paso falla: `ROLLBACK`.

## Concurrency

**Bloqueo optimista sobre revisión de abonos (EF-003):** al abrir el detalle, el abono transiciona a `EN_REVISION` solo si `estado == PENDIENTE`, seteando `revisadoPor = adminActual`. Un segundo admin que intente la misma operación recibe `409 ALREADY_IN_REVIEW` con el nombre de quien lo tiene. Aprobar/rechazar exige `revisadoPor == adminActual` (ADR-003).

## Idempotency

No aplica edición vía API pública repetible en el MVP (sin webhooks externos). El registro de abono no es idempotente por diseño: cada submit crea un nuevo `Abono`.

## External Integrations

- Storage de comprobantes: adapter con implementación filesystem local en dev.
- Notificaciones: adapter de log en MVP (interfaz lista para email transaccional).

## Error Handling

```text
ValidationError        → 400
AuthenticationError    → 401
AuthorizationError     → 403
NotFoundError           → 404
ConflictError (estado)  → 409
InfrastructureError    → 500
```

## Security

- Contraseñas: bcrypt (cliente y admin).
- 2FA cliente: TOTP (BR-010); admin sin 2FA en MVP (Non-Goal FS-001).
- RB-02 / BR-002: ningún endpoint de cliente puede mutar `Plan.saldoPendiente` ni `Abono.estado` hacia `APROBADO`/`RECHAZADO`.
- Middleware protege `/admin/**` y `/api/admin/**` verificando rol `administrador`.
- Comprobantes: validación server-side de tipo (`jpg`, `png`, `pdf`) y tamaño (≤ 5 MB).

## Observability

Logs: eventos clave (`plan_creado`, `abono_registrado`, `pago_aprobado`, `pago_rechazado`, `plan_cancelado`, `saldo_ajustado`) sin datos sensibles (sin contraseñas ni tokens).
Metrics: conteo de abonos por estado (fuera de alcance instrumentar en MVP, diseño preparado).

## Performance

Sin objetivos de carga formales en MVP (bajo volumen inicial). No se hacen N+1 queries en listados (usar `include` de Prisma).

## Configuration

Variables de entorno: `DATABASE_URL`, `NEXTAUTH_SECRET`, `TOTP_ISSUER`, `UPLOAD_DIR`.

## Migration

Prisma Migrate. Primera migración crea las 7 tablas descritas en Data Model.

## Backward Compatibility

No aplica (primera versión del sistema).

## Testing Strategy

Unit: cálculo de simulador, transición de estados de `Abono`/`Plan`, validación de sobrepago.
Integration: flujo completo registro → plan → abono → aprobación → liberación, contra la base de datos de test.

## Rollout

Un solo entorno (dev local) para el MVP de esta iteración; sin estrategia de despliegue progresivo todavía.

## Risks
- SQLite en dev vs PostgreSQL en prod puede ocultar diferencias de tipos/constraints (mitigado en ADR-004).
- Sin 2FA de admin: el rol con mayor impacto financiero queda con un solo factor (Non-Goal aceptado explícitamente en FS-001).

## Alternatives Considered

### Alternativa: backend separado (NestJS) + frontend separado (React)
Pros: separación de responsabilidades más clara a largo plazo.
Cons: más infraestructura para un MVP de una sola persona/equipo pequeño.
Reason rejected: monolito Next.js reduce fricción y tiempo de entrega sin bloquear una futura separación.

## Open Questions
- Proveedor de email transaccional definitivo (queda con adapter de log en MVP).
