# TS-001 — Principal (LuckyHouse): arquitectura técnica del MVP

> **v1.1 (2026-08-31)** — documenta lo realmente implementado tras TASK-001..028: sesión propia con `jose` (no NextAuth, ver ADR-008), módulo de reportes/dashboard gerencial, imagen placeholder local (ADR-007), y las desviaciones temporales de desarrollo (ADR-005, ADR-006). v1.0 era el diseño previo a implementar.

## References
- FS-001
- ADR-001 a ADR-008

## Stack (implementado)

| Capa | Librería | Versión |
|---|---|---|
| Framework | next | 14.2.35 |
| Lenguaje | typescript | 5.5.4 |
| Estilos | tailwindcss | 3.4.10 |
| ORM | @prisma/client / prisma | 5.19.1 |
| Hash de contraseñas | bcryptjs | 2.4.3 |
| Sesión (JWT firmado) | jose | 5.9.6 |
| 2FA (TOTP) | otplib | 12.0.1 |
| QR de configuración 2FA | qrcode | 1.5.4 |
| Gráficas del dashboard | recharts | 2.12.7 |
| Exportación a Excel | xlsx (SheetJS) | 0.18.5 |

`xlsx@0.18.5` tiene advisories conocidos (prototype pollution / ReDoS) sin parche en npm — ver Risks. Uso limitado a un endpoint admin-only, no procesa archivos subidos por terceros.

## Architecture Context

Monolito Next.js 14 (App Router). Un solo repo/proceso sirve páginas públicas, privadas de cliente, privadas de admin, y API routes.

```text
Browser (mobile-first)
      │ HTTPS
      ▼
Next.js App Router
 ├─ storefront (StoreHeader, ancho completo)   /  /catalogo  /producto/[id]
 ├─ cliente (AppShell, angosto tipo app)       /login  /registro  /dashboard  /planes/[id]  /perfil
 ├─ admin (AdminShell, ancho, nav persistente) /admin  /admin/pagos  /admin/entregas  /admin/auditoria
 └─ /api/**  (Route Handlers — lógica de negocio, incluye /api/admin/reportes)
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
Responsabilidad: registro, login en dos pasos (password → TOTP), sesión propia vía cookie JWT firmada (`jose`, no NextAuth — ver ADR-008), hash de contraseñas.
Dependencias: ClienteRepository, TotpService.
Constraints: nunca persiste contraseña en texto plano; nunca expone cuál credencial falló; el bypass `SKIP_2FA` (ADR-005) es exclusivo de desarrollo.

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

### ReportesModule
Responsabilidad: agregar KPIs (planes por estado, pagos por estado, recaudo, cartera pendiente), calcular rankings (top 10 productos/categorías/clientes) y generar el archivo Excel de planes.
Dependencias: PlanRepository, AbonoRepository, ClienteRepository, ProductoRepository.
Constraints: solo lectura (no muta estado); el indicador "alerta" del export es un heurístico, no una regla de negocio validada (FR-023).

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

### Reportes (admin)
```text
GET /api/admin/reportes/planes
  Auth: admin
  Response: 200, archivo .xlsx (Content-Disposition: attachment)
  Errors: 401 UNAUTHORIZED
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
- Imágenes de producto: `PlaceholderImage` (SVG inline, sin red externa) mientras `Producto.fotos` está vacío — reemplaza un intento inicial con `picsum.photos` descartado por no ser confiable sin conexión estable (ADR-007).
- WhatsApp: botón flotante estático (`wa.me/<numero>?text=...`), sin backend ni automatización — ver Non-Goal en FS-001.

## Branding

Nombre comercial: **LuckyHouse**. Paleta definida con el usuario (2026-08-30): primary `#0F5843`, cta `#16865F`/`#0F6D4D` hover, accent `#A8D76E` (solo badges, nunca botones), success `#208A5A`, warning `#D99A22`, danger `#C94343`, info `#3478A8`. Tokens declarados en `tailwind.config.ts`.

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

Variables de entorno: `DATABASE_URL`, `SESSION_SECRET`, `TOTP_ISSUER`, `UPLOAD_DIR`, `SKIP_2FA` (opcional, solo dev — ver ADR-005).

## Desviaciones temporales de desarrollo

No forman parte del diseño objetivo; existen para agilizar pruebas manuales en esta iteración y deben revertirse antes de producción.

| Desviación | ADR | Revertir |
|---|---|---|
| `SKIP_2FA=true` salta el paso TOTP en login de cliente | ADR-005 | Quitar la variable del `.env` |
| Sesión dura 30 días en dev (vs. 2h en prod) | ADR-006 | Ya condicionado por `NODE_ENV`; no requiere acción manual al desplegar |
| Código TOTP autocompletado en pantalla de login (`codigoDev`) | ADR-005 | Ya condicionado por `NODE_ENV`; no requiere acción manual al desplegar |

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
- `next@14.2.x` tiene advisories sin parche dentro de la línea 14 (requieren saltar a Next 16, cambio mayor no aplicado en este MVP); riesgo aceptado para un entorno de solo desarrollo local.
- `xlsx@0.18.5` tiene advisories conocidos sin parche disponible en npm; exposición acotada a un endpoint admin-only.
- `SKIP_2FA` mal configurado en un entorno real anularía BR-010 — mitigado por estar atado a una variable de entorno explícita y no al valor por defecto.

## Alternatives Considered

### Alternativa: backend separado (NestJS) + frontend separado (React)
Pros: separación de responsabilidades más clara a largo plazo.
Cons: más infraestructura para un MVP de una sola persona/equipo pequeño.
Reason rejected: monolito Next.js reduce fricción y tiempo de entrega sin bloquear una futura separación.

## Open Questions
- Proveedor de email transaccional definitivo (queda con adapter de log en MVP).
