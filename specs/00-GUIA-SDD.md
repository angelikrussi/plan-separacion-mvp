# SDD (Spec-Driven Development): especificaciones técnicas, funcionales, tareas e implementación

## 1. Qué es SDD

**SDD (Spec-Driven Development)** es un enfoque de desarrollo en el que
la **especificación es el artefacto central del proceso de ingeniería**.

En lugar de empezar directamente por código:

``` text
Idea → Código → Tests → Correcciones → Documentación
```

se busca trabajar de forma más controlada:

``` text
Problema / Objetivo
        ↓
Especificación funcional
        ↓
Especificación técnica
        ↓
Diseño / Contratos / Decisiones
        ↓
Plan de tareas
        ↓
Implementación
        ↓
Tests / Validación
        ↓
Evidencia de cumplimiento
        ↓
Actualización de la especificación
```

La idea fundamental es:

> **No implementar algo importante que no pueda trazarse hasta un
> requisito o una decisión explícita de la especificación.**

SDD no significa simplemente "escribir documentación antes de
programar". Una buena implementación debe poder responder:

-   ¿Qué problema resuelve?
-   ¿Qué comportamiento se espera?
-   ¿Qué restricciones existen?
-   ¿Qué componentes se modificarán?
-   ¿Qué contratos se exponen?
-   ¿Cómo se verifica que está correctamente implementado?
-   ¿Qué requisitos quedaron cubiertos por cada cambio?

------------------------------------------------------------------------

# 2. Por qué usar SDD

En sistemas medianos y grandes aparecen problemas como:

-   requisitos ambiguos;
-   conocimiento implícito en la cabeza de una persona;
-   APIs inconsistentes;
-   decisiones arquitectónicas no documentadas;
-   tareas demasiado grandes;
-   código que cumple "algo parecido" a lo solicitado;
-   tests que verifican implementación y no comportamiento;
-   cambios que rompen contratos existentes;
-   dificultad para revisar pull requests;
-   dificultad para delegar trabajo a otros desarrolladores o agentes de
    IA.

SDD intenta convertir el desarrollo en un sistema **trazable y
verificable**.

Una propiedad deseable es:

``` text
Requirement
    ↓
Functional Spec
    ↓
Technical Spec
    ↓
Task
    ↓
Code
    ↓
Test
    ↓
Evidence
```

Esto permite construir una matriz de trazabilidad:

  -------------------------------------------------------------------------------------
  Requisito   Spec        Spec      Task       Código          Test
              funcional   técnica                              
  ----------- ----------- --------- ---------- --------------- ------------------------
  FR-001      FS-001      TS-001    TASK-001   `UserService`   `user.service.spec.ts`

  FR-002      FS-002      TS-002    TASK-002   `POST /users`   `users.e2e.spec.ts`
  -------------------------------------------------------------------------------------

------------------------------------------------------------------------

# 3. SDD no es una metodología única

El término SDD puede utilizarse con distintos significados y variantes.

En este documento se utiliza **Spec-Driven Development** como una
disciplina de ingeniería donde:

1.  los requisitos se convierten en especificaciones;
2.  las especificaciones definen comportamiento y restricciones;
3.  las decisiones técnicas se documentan;
4.  el trabajo se descompone en tareas pequeñas;
5.  la implementación se realiza contra esas especificaciones;
6.  los tests y revisiones validan que la implementación cumple la
    especificación.

Puede combinarse perfectamente con:

-   Agile;
-   Scrum;
-   Kanban;
-   trunk-based development;
-   GitFlow;
-   TDD;
-   BDD;
-   DDD;
-   Clean Architecture;
-   Hexagonal Architecture;
-   CI/CD;
-   Infrastructure as Code.

------------------------------------------------------------------------

# 4. Frontera estricta entre Spec, Task e Implementation

Para este modelo de SDD se establece una regla explícita:

> **Las especificaciones describen el sistema; la implementación
> construye el sistema.**

La documentación debe permitir diseñar y entender la solución sin
convertir las specs en código ejecutable.

## 4.1 Functional Spec --- WHAT

La Functional Spec define el comportamiento esperado desde la
perspectiva del negocio o del consumidor.

### Permitido

-   Contexto.
-   Problema.
-   Objetivos.
-   Alcance.
-   Actores.
-   Precondiciones.
-   Requisitos funcionales.
-   Reglas de negocio.
-   Casos de uso.
-   Flujos principales.
-   Flujos alternativos.
-   Flujos de error.
-   Acceptance Criteria.
-   Non-goals.
-   Preguntas abiertas.

### No permitido

-   Clases.
-   Funciones.
-   Firmas de métodos.
-   Código.
-   Pseudocódigo técnico.
-   SQL.
-   Frameworks.
-   Librerías.
-   Nombres de archivos de implementación.
-   Detalles internos de infraestructura.

Ejemplo correcto:

``` text
El usuario autenticado puede solicitar la cancelación
de una suscripción activa.
```

Ejemplo incorrecto:

``` text
SubscriptionService.cancel(subscriptionId)
```

El segundo ejemplo ya introduce una decisión de implementación.

------------------------------------------------------------------------

## 4.2 Technical Spec --- HOW

La Technical Spec define **cómo debe resolverse técnicamente el
comportamiento**, pero sin implementar la solución.

### Permitido

-   Arquitectura.
-   Componentes.
-   Responsabilidades.
-   Dependencias.
-   Diagramas.
-   Diagramas de secuencia.
-   Diagramas de flujo.
-   Diagramas de estados.
-   Diagramas de componentes.
-   Modelos de datos.
-   Contratos API.
-   Eventos.
-   Algoritmos.
-   Reglas de concurrencia.
-   Límites transaccionales.
-   Estrategias de idempotencia.
-   Estrategias de cache.
-   Seguridad.
-   Observabilidad.
-   Performance.
-   Compatibilidad.
-   Migraciones descritas conceptualmente.
-   Pseudocódigo.
-   Decisiones arquitectónicas.
-   Trade-offs.
-   ADRs relacionados.

### No permitido

-   Código ejecutable.
-   Funciones reales.
-   Clases reales.
-   Implementaciones completas.
-   Código de framework.
-   SQL ejecutable como implementación final.
-   Configuración real lista para copiar/pegar.
-   Tests implementados.

La frontera puede expresarse así:

``` text
Technical Spec

    "El sistema debe hacer X mediante
     los siguientes pasos..."

                         ↓

              PSEUDOCÓDIGO / DIAGRAMA

                         ↓

Implementation

    "Aquí se escribe el código real."
```

### Pseudocódigo permitido

``` text
cancelSubscription(subscriptionId, userId):

    obtener subscription

    si no existe:
        devolver NOT_FOUND

    verificar ownership

    si estado != ACTIVE:
        devolver INVALID_STATE

    cambiar estado a CANCELLED

    persistir cambio

    registrar evento SubscriptionCancelled

    devolver resultado
```

Esto describe el algoritmo.

### Código NO permitido

``` typescript
async function cancelSubscription(
  subscriptionId: string,
  userId: string
) {
  const subscription = await repository.findById(subscriptionId);
  // ...
}
```

Eso pertenece exclusivamente a Implementation.

------------------------------------------------------------------------

## 4.3 Task --- WORK

La Task define el trabajo concreto que debe ejecutarse respetando las
specs.

### Permitido

-   Objetivo.
-   Referencias a `FR`, `BR`, `AC`, `TS` y `ADR`.
-   Alcance.
-   Componentes afectados.
-   Archivos o áreas a modificar.
-   Secuencia de trabajo.
-   Restricciones.
-   Acceptance Criteria.
-   Tests que deben existir.
-   Comandos de validación.
-   Pseudocódigo pequeño cuando elimine una ambigüedad.

### No permitido

-   Implementación completa.
-   Código real.
-   Funciones completas.
-   Clases completas.
-   Soluciones que contradigan la Technical Spec.

Ejemplo:

``` text
TASK-004

Objetivo:
Implementar la cancelación de una suscripción.

Referencias:
FR-002
FR-003
TS-002
AC-001
AC-002

Pasos:
1. Obtener la suscripción.
2. Validar ownership.
3. Validar estado.
4. Ejecutar transición ACTIVE → CANCELLED.
5. Persistir mediante el mecanismo definido en TS-002.
6. Registrar el evento definido en TS-002.

Restricciones:
- No cambiar el contrato HTTP.
- No modificar autenticación.
- Mantener idempotencia.
```

------------------------------------------------------------------------

## 4.4 Implementation --- CODE

Implementation es el único nivel donde se permite código ejecutable.

Aquí viven:

-   Funciones.
-   Clases.
-   Interfaces del lenguaje.
-   SQL ejecutable.
-   Migrations.
-   Configuración.
-   Código de infraestructura.
-   Tests.
-   Integraciones.
-   Controllers.
-   Repositories.
-   Services.
-   Workers.
-   Jobs.
-   Código de deployment.

La relación es:

``` text
FUNCTIONAL SPEC
      │
      │ WHAT
      ▼
TECHNICAL SPEC
      │
      │ HOW
      ▼
TASK
      │
      │ WORK
      ▼
IMPLEMENTATION
      │
      │ CODE
      ▼
TESTS / VALIDATION
```

------------------------------------------------------------------------

# 5. Matriz de contenido por artefacto

  Artefacto                 Functional Spec         Technical Spec            Task      Implementation
  ------------------------ ----------------- ---------------------------- ------------ ----------------
  Requisitos funcionales          ✅                  Referencia           Referencia  
  Reglas de negocio               ✅          Referencia/detalle técnico   Referencia  
  Acceptance Criteria             ✅                Puede mapearse             ✅            Test
  Casos de uso                    ✅               Detalle técnico         Referencia  
  Arquitectura                                            ✅               Referencia  
  Diagramas                                               ✅                Opcional   
  Diagramas de secuencia                                  ✅                Opcional   
  Diagramas de estados                                    ✅                Opcional   
  Diagramas de flujo                                      ✅                Opcional   
  Algoritmos                                              ✅                Resumen    
  Pseudocódigo                    ❌                      ✅               ✅ mínimo   
  API Contract                                            ✅               Referencia   Implementación
  Modelo de datos                                         ✅               Referencia  
  SQL conceptual                                          ⚠️                           
  SQL ejecutable                  ❌                      ❌                   ❌             ✅
  Clases reales                   ❌                      ❌                   ❌             ✅
  Funciones reales                ❌                      ❌                   ❌             ✅
  Código ejecutable               ❌                      ❌                   ❌             ✅
  Tests descritos                                   ✅ estrategia              ✅      
  Tests implementados             ❌                      ❌                   ❌             ✅
  ADR                                                     ✅               Referencia  
  Configuración real              ❌                      ❌                   ❌             ✅

------------------------------------------------------------------------

# 6. Regla de los diagramas

Los diagramas pertenecen principalmente a la **Technical Spec**, porque
sirven para explicar la solución técnica sin escribirla.

## 6.1 Diagrama de arquitectura

``` text
┌──────────────┐
│     API      │
└──────┬───────┘
       ↓
┌──────────────┐
│  Application │
└──────┬───────┘
       ↓
┌──────────────┐
│    Domain    │
└──────┬───────┘
       ↓
┌──────────────┐
│ Infrastructure│
└──────────────┘
```

Debe explicar:

-   responsabilidades;
-   dependencias;
-   límites;
-   dirección de dependencias.

No debe contener código.

------------------------------------------------------------------------

## 6.2 Diagrama de secuencia

Ejemplo:

``` text
User
 │
 │ POST /cancel
 ▼
Controller
 │
 │ cancel()
 ▼
Use Case
 │
 │ getSubscription()
 ▼
Repository
 │
 │ subscription
 ▼
Use Case
 │
 │ validate state
 │
 │ transition
 ▼
Repository
 │
 │ persist
 ▼
Event/Outbox
```

Esto explica la interacción entre componentes.

------------------------------------------------------------------------

## 6.3 Diagrama de estados

``` text
             ┌─────────┐
             │ ACTIVE  │
             └────┬────┘
                  │ cancel
                  ▼
             ┌───────────┐
             │ CANCELLED │
             └───────────┘
```

También se pueden definir transiciones inválidas:

``` text
CANCELLED → ACTIVE
    ❌ no permitido
```

------------------------------------------------------------------------

## 6.4 Diagrama de flujo

``` text
Start
  │
  ▼
Load subscription
  │
  ▼
Exists?
 ┌┴───────┐
No       Yes
│         │
▼         ▼
404     Owner?
          │
       ┌──┴──┐
      No    Yes
       │      │
       ▼      ▼
     403    ACTIVE?
               │
            ┌──┴──┐
           No    Yes
            │      │
            ▼      ▼
          Error  Cancel
```

Esto es perfectamente válido dentro de la Technical Spec.

------------------------------------------------------------------------

# 7. Pseudocódigo como frontera entre diseño e implementación

El pseudocódigo tiene una función específica:

> **Describir el algoritmo sin comprometer la implementación concreta.**

Por eso debe evitar:

-   sintaxis específica de un lenguaje;
-   imports;
-   decorators;
-   annotations;
-   framework APIs;
-   ORM APIs;
-   detalles de memoria;
-   tipos concretos innecesarios;
-   librerías.

## Demasiado cercano al código

``` typescript
const user = await userRepository.findById(userId);

if (!user) {
  throw new UserNotFoundError();
}
```

Esto ya parece implementación.

## Mejor pseudocódigo

``` text
user ← obtener usuario por ID

si usuario no existe:
    producir USER_NOT_FOUND
```

La segunda versión permite que la implementación utilice:

-   PostgreSQL;
-   MongoDB;
-   REST;
-   gRPC;
-   un repository;
-   un servicio externo;

sin que la Technical Spec quede acoplada innecesariamente.

------------------------------------------------------------------------

# 8. Nivel de abstracción recomendado

La especificación debe bajar progresivamente de abstracción:

``` text
BUSINESS
   │
   │ Qué necesita el negocio
   ▼
FUNCTIONAL
   │
   │ Qué debe hacer el sistema
   ▼
TECHNICAL
   │
   │ Cómo debe resolverse
   ▼
TASK
   │
   │ Qué trabajo ejecutar
   ▼
IMPLEMENTATION
   │
   │ Cómo se escribe realmente
   ▼
CODE
```

No hay que saltar directamente de:

``` text
"Necesitamos cancelación"
```

a:

``` text
class CancelSubscriptionService { ... }
```

La cadena debe conservar el razonamiento.

------------------------------------------------------------------------

# 9. Regla de "no código" para Specs

Para mantener una separación estricta, puede adoptarse esta política:

``` text
*.functional.md
    → NO CODE

*.technical.md
    → DIAGRAMS + PSEUDOCODE
    → NO EXECUTABLE CODE

TASK-*.md
    → INSTRUCTIONS + OPTIONAL MINIMAL PSEUDOCODE
    → NO EXECUTABLE CODE

src/**
    → REAL IMPLEMENTATION

tests/**
    → REAL TEST IMPLEMENTATION
```

Esto hace que el repositorio sea fácil de entender incluso para alguien
que no conoce previamente el proyecto.

------------------------------------------------------------------------

# 10. Estructura de repositorio recomendada

``` text
project/
│
├── specs/
│   │
│   ├── functional/
│   │   ├── FS-001-user-registration.md
│   │   ├── FS-002-cancel-subscription.md
│   │   └── FS-003-change-email.md
│   │
│   ├── technical/
│   │   ├── TS-001-user-registration.md
│   │   ├── TS-002-cancel-subscription.md
│   │   └── TS-003-change-email.md
│   │
│   ├── tasks/
│   │   ├── TASK-001.md
│   │   ├── TASK-002.md
│   │   └── TASK-003.md
│   │
│   └── adr/
│       ├── ADR-001.md
│       └── ADR-002.md
│
├── src/
│   └── ... real implementation ...
│
├── tests/
│   └── ... real tests ...
│
└── docs/
```

------------------------------------------------------------------------

# 11. Flujo de trabajo estricto

El workflow recomendado queda:

``` text
1. Define Problem
       ↓
2. Create Functional Spec
       ↓
3. Review Functional Spec
       ↓
4. Define Acceptance Criteria
       ↓
5. Create Technical Spec
       ↓
6. Add diagrams
       ↓
7. Add algorithms/pseudocode
       ↓
8. Resolve technical decisions
       ↓
9. Create ADRs if needed
       ↓
10. Break into Tasks
       ↓
11. Implement real code
       ↓
12. Implement tests
       ↓
13. Validate against Acceptance Criteria
       ↓
14. Update Specs if design changed
       ↓
15. Review / Merge
```

------------------------------------------------------------------------

# 12. Regla para cambios durante implementación

Una situación habitual:

``` text
Technical Spec
      ↓
Implementation
      ↓
"Esto no funciona como se había diseñado."
```

No se debe simplemente cambiar el código y continuar.

Debe ocurrir:

``` text
Implementation discovers technical issue
                ↓
        Review Technical Spec
                ↓
       Decision / Alternative
                ↓
       Update Technical Spec
                ↓
          Update Tasks
                ↓
          Update ADR if needed
                ↓
          Continue coding
```

Esto mantiene:

``` text
Spec ≈ Actual System Design
```

Si la implementación se desvía permanentemente de la spec:

``` text
Spec ≠ Implementation
```

la documentación pierde valor.

------------------------------------------------------------------------

# 13. SDD y agentes de IA

Esta separación es especialmente importante cuando la implementación la
realiza un agente de IA.

Un agente no debería recibir solamente:

``` text
"Implementa cancel subscription."
```

Debe recibir:

``` text
Functional Spec
      +
Technical Spec
      +
Task
      +
Constraints
      +
Acceptance Criteria
```

El agente puede entonces utilizar:

``` text
Technical Spec
    ↓
diagramas
    ↓
pseudocódigo
    ↓
task
    ↓
code
```

Pero la spec no necesita contener el código final.

Una instrucción útil para un agente sería:

``` text
Implement TASK-004 according to TS-002.

Rules:

1. Do not modify the Functional Spec.
2. Do not change the Technical Design without documenting the change.
3. Do not introduce a new architectural pattern without an ADR.
4. Preserve existing public contracts.
5. Implement all acceptance criteria.
6. Add automated tests.
7. Do not copy pseudocode literally if the existing architecture
   requires a different concrete implementation.
```

------------------------------------------------------------------------

# 14. Cómo revisar que una Spec no contiene código

Puede aplicarse una revisión simple:

``` text
Functional Spec
────────────────────────────
¿Describe comportamiento?
¿Evita clases?
¿Evita funciones?
¿Evita framework?
¿Evita código?
¿Tiene acceptance criteria?

Technical Spec
────────────────────────────
¿Describe diseño?
¿Tiene diagramas?
¿Tiene pseudocódigo?
¿Evita código ejecutable?
¿Explica decisiones?
¿Define errores?
¿Define concurrencia?
¿Define persistencia?

Task
────────────────────────────
¿Es ejecutable como trabajo?
¿Tiene referencias?
¿Tiene restricciones?
¿Tiene acceptance criteria?
¿Evita implementación completa?

Implementation
────────────────────────────
¿Contiene el código real?
¿Cumple la spec?
¿Tiene tests?
¿Tiene evidencia?
```

------------------------------------------------------------------------

# 15. Principio final

La separación más importante es:

``` text
┌──────────────────────────────────────┐
│ FUNCTIONAL SPEC                      │
│                                      │
│ WHAT                                 │
│ Qué comportamiento necesita negocio  │
│                                      │
│ NO CODE                              │
└──────────────────┬───────────────────┘
                   ↓
┌──────────────────────────────────────┐
│ TECHNICAL SPEC                       │
│                                      │
│ HOW                                  │
│ Cómo se resolverá                    │
│                                      │
│ DIAGRAMS + PSEUDOCODE                │
│ NO EXECUTABLE CODE                   │
└──────────────────┬───────────────────┘
                   ↓
┌──────────────────────────────────────┐
│ TASK                                 │
│                                      │
│ WORK                                 │
│ Qué trabajo concreto ejecutar        │
│                                      │
│ OPTIONAL MINIMAL PSEUDOCODE          │
│ NO IMPLEMENTATION CODE               │
└──────────────────┬───────────────────┘
                   ↓
┌──────────────────────────────────────┐
│ IMPLEMENTATION                       │
│                                      │
│ CODE                                 │
│ Código ejecutable real               │
│                                      │
│ FUNCTIONS / CLASSES / SQL / TESTS    │
└──────────────────────────────────────┘
```

La regla puede resumirse en una sola frase:

> **Functional Spec define el WHAT, Technical Spec define el HOW
> mediante diseño, diagramas y pseudocódigo, Task define el WORK y
> Implementation contiene exclusivamente el CODE real.**

# 4. Las capas de especificación

Una forma práctica de organizar SDD es separar cuatro niveles.

``` text
┌──────────────────────────────────────────────┐
│  1. Functional Specification                 │
│  Qué debe hacer el sistema                   │
└──────────────────────┬───────────────────────┘
                       ↓
┌──────────────────────────────────────────────┐
│  2. Technical Specification                  │
│  Cómo se construirá                          │
└──────────────────────┬───────────────────────┘
                       ↓
┌──────────────────────────────────────────────┐
│  3. Tasks                                    │
│  Qué cambios concretos deben ejecutarse      │
└──────────────────────┬───────────────────────┘
                       ↓
┌──────────────────────────────────────────────┐
│  4. Implementation                           │
│  Código, configuración, migraciones, tests   │
└──────────────────────────────────────────────┘
```

Cada nivel responde una pregunta distinta.

  Nivel             Pregunta
  ----------------- -----------------------------------------
  Functional Spec   ¿Qué debe hacer el sistema?
  Technical Spec    ¿Cómo se construirá?
  Task              ¿Qué trabajo concreto hay que ejecutar?
  Implementation    ¿Qué código/configuración se modificó?

------------------------------------------------------------------------

# 5. Functional Specification

## 5.1 Objetivo

La **especificación funcional** describe el comportamiento esperado
desde el punto de vista del negocio, usuario o consumidor del sistema.

Debe ser independiente, en la medida de lo posible, de detalles como:

-   framework;
-   lenguaje;
-   base de datos;
-   clases;
-   nombres de archivos;
-   librerías;
-   infraestructura concreta.

Ejemplo incorrecto:

> Crear un `UserService` en NestJS que invoque
> `UserRepository.findOne()`.

Eso es una decisión técnica.

Ejemplo funcional:

> El sistema debe permitir consultar un usuario mediante su
> identificador único.

Eso describe comportamiento.

------------------------------------------------------------------------

# 6. Qué debe contener una Functional Spec

Una estructura sólida puede ser:

``` text
Functional Specification
├── Context
├── Problem
├── Goal
├── Scope
├── Actors
├── Preconditions
├── Functional Requirements
├── Business Rules
├── Main Flows
├── Alternative Flows
├── Error Flows
├── Acceptance Criteria
├── Non-Goals
└── Open Questions
```

## 6.1 Context

Explica dónde existe la funcionalidad.

``` md
## Context

La plataforma permite administrar cuentas de clientes.
Actualmente un cliente puede registrarse, pero no puede cambiar
su dirección de correo electrónico desde la aplicación.
```

## 6.2 Problem

Define el problema real.

``` md
## Problem

Los clientes que necesitan cambiar su email deben contactar soporte.
Esto genera intervención manual y aumenta el tiempo de resolución.
```

## 6.3 Goal

Define el resultado esperado.

``` md
## Goal

Permitir que un cliente autenticado cambie su email mediante un flujo
seguro de verificación.
```

------------------------------------------------------------------------

# 7. Functional Requirements

Los requisitos funcionales deben tener identificadores estables.

Ejemplo:

``` md
### FR-001 — Solicitar cambio de email

El sistema debe permitir a un usuario autenticado iniciar un cambio
de dirección de email.

### FR-002 — Verificar nueva dirección

El sistema debe enviar un código de verificación a la nueva dirección.

### FR-003 — Confirmar cambio

El email solamente debe modificarse cuando el usuario proporcione
un código válido y no expirado.
```

El identificador `FR-001` es importante porque posteriormente puede
aparecer en:

-   especificaciones técnicas;
-   tasks;
-   commits;
-   tests;
-   pull requests;
-   documentación;
-   evidencias.

------------------------------------------------------------------------

# 8. Acceptance Criteria

Los criterios de aceptación convierten una descripción ambigua en algo
verificable.

Ejemplo:

``` md
### AC-001

Given:
  un usuario autenticado

When:
  solicita cambiar su email por `new@example.com`

Then:
  el sistema debe crear un proceso de verificación
  y enviar un código a `new@example.com`.
```

Otro:

``` md
### AC-002

Given:
  un código válido y no expirado

When:
  el usuario confirma el cambio

Then:
  el email de la cuenta debe actualizarse.
```

Y un caso negativo:

``` md
### AC-003

Given:
  un código expirado

When:
  el usuario intenta confirmar el cambio

Then:
  el sistema debe rechazar la operación
  y mantener el email anterior.
```

Los acceptance criteria deben poder traducirse posteriormente a tests.

------------------------------------------------------------------------

# 9. Business Rules

Las reglas de negocio deben separarse de los flujos.

Ejemplo:

``` md
### BR-001

El código de verificación expira después de 15 minutos.

### BR-002

Un código solamente puede utilizarse una vez.

### BR-003

El email nuevo no puede pertenecer a otra cuenta activa.

### BR-004

Después de 5 intentos inválidos, el proceso debe bloquearse.
```

Esto evita esconder reglas importantes dentro de párrafos narrativos.

------------------------------------------------------------------------

# 10. Functional Scope

Definir explícitamente qué está dentro y fuera del alcance.

``` md
## In Scope

- Solicitud de cambio de email.
- Generación del código.
- Envío del código.
- Validación.
- Actualización de la cuenta.

## Out of Scope

- Cambio de teléfono.
- Cambio de contraseña.
- Gestión de preferencias de marketing.
- Migración de emails históricos.
```

Los `Non-Goals` son especialmente importantes porque evitan que una task
crezca indefinidamente.

------------------------------------------------------------------------

# 11. Technical Specification

La **Technical Specification** transforma el comportamiento requerido en
un diseño implementable.

Aquí sí aparecen:

-   arquitectura;
-   componentes;
-   módulos;
-   clases;
-   interfaces;
-   APIs;
-   eventos;
-   base de datos;
-   índices;
-   transacciones;
-   concurrencia;
-   caché;
-   seguridad;
-   observabilidad;
-   errores;
-   dependencias;
-   configuración;
-   migraciones;
-   estrategia de testing.

La pregunta pasa de:

> ¿Qué debe hacer?

a:

> ¿Cómo vamos a construirlo para que haga eso?

------------------------------------------------------------------------

# 12. Estructura de una Technical Spec

Una estructura recomendable:

``` text
Technical Specification
├── Architecture Context
├── Proposed Design
├── Component Diagram
├── Data Model
├── API Contracts
├── Domain Model
├── Application Services
├── Persistence
├── External Integrations
├── Error Handling
├── Security
├── Concurrency
├── Transactions
├── Idempotency
├── Observability
├── Performance
├── Configuration
├── Migration Strategy
├── Testing Strategy
├── Rollout Strategy
├── Backward Compatibility
├── Risks
├── Alternatives Considered
└── Open Questions
```

------------------------------------------------------------------------

# 13. Architecture Context

Ejemplo:

``` md
## Architecture Context

La aplicación utiliza una arquitectura modular:

HTTP API
  ↓
Application Layer
  ↓
Domain Layer
  ↓
Infrastructure Layer
  ↓
PostgreSQL
```

El objetivo no es dibujar por dibujar.

La arquitectura debe explicar las responsabilidades y dependencias.

Por ejemplo:

``` text
Controller
   │
   ▼
ChangeEmailUseCase
   │
   ├──── UserRepository
   │
   ├──── VerificationCodeService
   │
   └──── EmailSender
```

------------------------------------------------------------------------

# 14. Component Design

Ejemplo:

``` md
## Components

### ChangeEmailController

Responsabilidad:
- validar request HTTP;
- autenticar contexto;
- delegar al caso de uso;
- convertir errores de dominio a HTTP.

No debe:
- acceder directamente a PostgreSQL;
- implementar reglas de negocio.

### ChangeEmailUseCase

Responsabilidad:
- coordinar el cambio de email;
- comprobar reglas de negocio;
- generar proceso de verificación;
- persistir el estado.

### UserRepository

Responsabilidad:
- abstraer persistencia de usuarios.

### VerificationCodeService

Responsabilidad:
- generar códigos;
- validar expiración;
- invalidar códigos usados.
```

Esta separación crea límites arquitectónicos explícitos.

------------------------------------------------------------------------

# 15. API Contract

Una Technical Spec debería definir el contrato antes de implementar.

Ejemplo:

``` http
POST /v1/users/me/email-change
Authorization: Bearer <token>
Content-Type: application/json
```

Request:

``` json
{
  "newEmail": "new@example.com"
}
```

Response:

``` http
202 Accepted
```

``` json
{
  "requestId": "01J...",
  "status": "PENDING_VERIFICATION"
}
```

Errores:

``` http
400 Bad Request
409 Conflict
429 Too Many Requests
```

Una especificación madura también define el formato de error:

``` json
{
  "error": {
    "code": "EMAIL_ALREADY_IN_USE",
    "message": "The email address is already in use.",
    "requestId": "01J..."
  }
}
```

------------------------------------------------------------------------

# 16. Data Model

La Technical Spec debe explicar cómo se representa el estado.

Por ejemplo:

``` sql
CREATE TABLE email_change_requests (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    new_email VARCHAR(320) NOT NULL,
    code_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    attempts INTEGER NOT NULL DEFAULT 0,
    consumed_at TIMESTAMPTZ NULL,
    created_at TIMESTAMPTZ NOT NULL,
    CONSTRAINT fk_email_change_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
);
```

También deben especificarse:

-   PK;
-   FK;
-   índices;
-   uniqueness;
-   nullable/non-nullable;
-   cardinalidad;
-   retención;
-   migraciones;
-   estrategia de cleanup.

Ejemplo:

``` sql
CREATE INDEX idx_email_change_requests_user_id
    ON email_change_requests(user_id);

CREATE INDEX idx_email_change_requests_expires_at
    ON email_change_requests(expires_at);
```

------------------------------------------------------------------------

# 17. Domain Model

Si el dominio lo requiere, la Technical Spec debe distinguir entidades,
value objects y servicios.

Ejemplo conceptual:

``` text
User
 └── Email

EmailChangeRequest
 ├── userId
 ├── newEmail
 ├── verificationCode
 ├── expiresAt
 └── status
```

Estados:

``` text
PENDING
   │
   ├── verify ──→ VERIFIED
   │
   ├── expire ──→ EXPIRED
   │
   └── cancel ──→ CANCELLED
```

Esto permite especificar transiciones válidas.

------------------------------------------------------------------------

# 18. State Machines

Cuando una funcionalidad tiene estados, conviene especificar una máquina
de estados.

Ejemplo:

``` text
                ┌───────────┐
                │  PENDING  │
                └─────┬─────┘
                      │
          ┌───────────┼───────────┐
          │           │           │
          ▼           ▼           ▼
     VERIFIED      EXPIRED     CANCELLED
```

Reglas:

``` md
PENDING → VERIFIED
  Solo si el código es válido y no expiró.

PENDING → EXPIRED
  Cuando `expiresAt < now`.

VERIFIED → cualquier estado
  No permitido.

EXPIRED → VERIFIED
  No permitido.
```

Esto elimina ambigüedades.

------------------------------------------------------------------------

# 19. Concurrencia

Una Technical Spec seria debe preguntar:

> ¿Qué ocurre si dos requests llegan al mismo tiempo?

Ejemplo:

``` text
Request A ──┐
            ├── ChangeEmailUseCase
Request B ──┘
```

Si ambas operaciones intentan modificar el mismo usuario, pueden
producir:

-   race conditions;
-   double processing;
-   pérdida de actualización;
-   estados inconsistentes.

Posibles soluciones:

### Optimistic locking

``` sql
UPDATE users
SET email = $1,
    version = version + 1
WHERE id = $2
  AND version = $3;
```

### Pessimistic locking

``` sql
SELECT *
FROM users
WHERE id = $1
FOR UPDATE;
```

### Unique constraint

``` sql
CREATE UNIQUE INDEX users_email_unique
ON users(email);
```

La especificación debe explicar **por qué** se utiliza cada mecanismo.

------------------------------------------------------------------------

# 20. Transactions

Una Technical Spec debería indicar los límites transaccionales.

Por ejemplo:

``` text
BEGIN

1. Lock user
2. Validate email uniqueness
3. Consume verification request
4. Update user.email

COMMIT
```

Si alguna operación falla:

``` text
ROLLBACK
```

Pero si se envía un email mediante un proveedor externo, no se debe
asumir que una transacción SQL puede hacer rollback del email ya
enviado.

Ahí puede ser necesario:

``` text
DB Transaction
      ↓
Outbox Event
      ↓
Message Broker
      ↓
Email Worker
      ↓
Email Provider
```

------------------------------------------------------------------------

# 21. Outbox Pattern

Para operaciones que combinan base de datos y mensajería:

``` text
Application
    │
    ▼
┌───────────────────────┐
│ PostgreSQL transaction│
│                       │
│ users                 │
│ outbox_events         │
└───────────┬───────────┘
            │
            ▼
      Outbox Processor
            │
            ▼
      Message Broker
```

La Technical Spec debe definir:

-   estructura del evento;
-   `eventId`;
-   estado;
-   retries;
-   backoff;
-   dead-letter;
-   idempotencia;
-   orden de procesamiento.

------------------------------------------------------------------------

# 22. Idempotency

Si una operación puede repetirse, debe especificarse su comportamiento.

Ejemplo:

``` http
POST /v1/payments
Idempotency-Key: 01JABC...
```

La Technical Spec debe definir:

``` text
same key + same payload
    → return original result

same key + different payload
    → reject

new key
    → process operation
```

Esto es especialmente importante en:

-   pagos;
-   creación de recursos;
-   webhooks;
-   jobs;
-   APIs públicas;
-   sistemas distribuidos.

------------------------------------------------------------------------

# 23. Error Model

No basta con decir "si falla, devolver error".

Hay que definir clases de error.

``` text
ValidationError
DomainError
AuthenticationError
AuthorizationError
ConflictError
RateLimitError
InfrastructureError
ExternalServiceError
```

Y su mapping:

  Error                      HTTP
  ------------------------ ------
  Invalid input               400
  Unauthenticated             401
  Unauthorized                403
  Resource not found          404
  Business conflict           409
  Rate limit                  429
  Unexpected error            500
  Dependency unavailable      503

La implementación debe seguir este contrato.

------------------------------------------------------------------------

# 24. Security Specification

La seguridad también debe formar parte de la spec.

Por ejemplo:

``` md
## Security

- El endpoint requiere autenticación.
- Solo el propietario de la cuenta puede iniciar el cambio.
- El código no se almacena en texto plano.
- Los códigos tienen TTL de 15 minutos.
- Después de 5 intentos inválidos se bloquea el request.
- El email no debe aparecer en logs sensibles.
- Los tokens no deben aparecer en logs.
```

Para datos sensibles, conviene especificar:

``` text
Input
  ↓
Validation
  ↓
Normalization
  ↓
Hash / Encryption
  ↓
Persistence
```

------------------------------------------------------------------------

# 25. Observability

La implementación debe definir qué observar.

### Logs

``` json
{
  "event": "email_change_requested",
  "requestId": "...",
  "userId": "...",
  "result": "accepted"
}
```

Evitar:

``` json
{
  "email": "secret@example.com",
  "verificationCode": "123456"
}
```

### Metrics

Ejemplos:

``` text
email_change_requests_total
email_change_verification_success_total
email_change_verification_failure_total
email_change_request_duration_seconds
```

### Tracing

Propagar:

``` text
traceId
spanId
requestId
```

------------------------------------------------------------------------

# 26. Performance

Una Technical Spec debe establecer expectativas cuando son relevantes.

Ejemplo:

``` md
## Performance Requirements

- p95 < 200 ms para operaciones sin dependencia externa.
- p99 < 500 ms.
- No más de 3 queries SQL por request.
- Endpoint soportará 100 RPS sostenidos.
```

No hay que inventar números sin contexto.

Los objetivos deben provenir de:

-   requisitos de negocio;
-   capacidad actual;
-   benchmarks;
-   SLO/SLA;
-   análisis de carga.

------------------------------------------------------------------------

# 27. Compatibility

Hay que especificar si el cambio rompe contratos existentes.

Ejemplo:

``` text
API v1
  ↓
Existing clients

New implementation
  ↓
Backward compatible
```

O:

``` text
API v1
  ↓
deprecated

API v2
  ↓
new contract
```

Una Technical Spec madura responde:

-   ¿rompe API?
-   ¿rompe DB?
-   ¿rompe eventos?
-   ¿rompe clientes?
-   ¿requiere migración?
-   ¿puede desplegarse progresivamente?

------------------------------------------------------------------------

# 28. ADR: Architecture Decision Record

Una decisión importante no debería quedar escondida dentro de una
Technical Spec.

Puede registrarse como ADR.

Ejemplo:

``` md
# ADR-001 — Uso de Outbox Pattern

## Context

La operación modifica PostgreSQL y posteriormente debe publicar
un evento de dominio.

## Decision

Utilizar Outbox Pattern.

## Rationale

Una transacción distribuida entre PostgreSQL y el broker no está
disponible y publicar directamente después del COMMIT puede perder
eventos si el proceso falla.

## Consequences

Positive:
- mayor confiabilidad;
- eventos persistidos;
- retry posible.

Negative:
- mayor complejidad;
- procesamiento asíncrono;
- necesidad de cleanup.
```

------------------------------------------------------------------------

# 29. Technical Spec vs Functional Spec

Una diferencia importante:

``` text
Functional:
"El usuario puede cambiar su email después de verificar un código."

Technical:
"Se implementará mediante ChangeEmailUseCase, PostgreSQL,
una tabla email_change_requests y un endpoint POST /v1/..."
```

Otro ejemplo:

  Functional                                Technical
  ----------------------------------------- -----------------------------
  Usuario puede iniciar sesión              `POST /v1/auth/login`
  Contraseña incorrecta es rechazada        `401 AUTHENTICATION_FAILED`
  Cuenta se bloquea después de N intentos   Redis counter + TTL
  Sesión expira                             JWT exp de 15 min
  Usuario recibe email                      Event + Outbox + worker

------------------------------------------------------------------------

# 30. De Spec a Tasks

Una de las partes más importantes de SDD es **convertir especificaciones
en tareas ejecutables**.

Una task no debería ser:

> Implementar cambio de email.

Eso es demasiado grande.

Debe descomponerse.

Ejemplo:

``` text
TASK-001
Crear migración email_change_requests

TASK-002
Implementar EmailChangeRequest entity

TASK-003
Implementar VerificationCodeService

TASK-004
Implementar ChangeEmailUseCase

TASK-005
Implementar POST /v1/users/me/email-change

TASK-006
Implementar endpoint de verificación

TASK-007
Agregar tests unitarios

TASK-008
Agregar tests de integración

TASK-009
Agregar métricas y logs

TASK-010
Actualizar documentación API
```

------------------------------------------------------------------------

# 31. Anatomía de una Task

Una task técnica buena puede tener:

``` md
# TASK-004 — Implement ChangeEmailUseCase

## References

- FR-001
- FR-002
- FR-003
- TS-001

## Objective

Implementar el caso de uso que inicia un proceso de cambio de email.

## Inputs

```ts
type ChangeEmailInput = {
  userId: string;
  newEmail: string;
};
```

## Behavior

1.  Obtener usuario.
2.  Validar existencia.
3.  Normalizar email.
4.  Verificar disponibilidad.
5.  Crear request de cambio.
6.  Generar código.
7.  Persistir hash.
8.  Publicar evento.
9.  Retornar requestId.

## Error Cases

-   USER_NOT_FOUND
-   EMAIL_ALREADY_IN_USE
-   INVALID_EMAIL
-   RATE_LIMITED

## Acceptance Criteria

-   [ ] User inexistente produce USER_NOT_FOUND.
-   [ ] Email ocupado produce EMAIL_ALREADY_IN_USE.
-   [ ] Código nunca se persiste en plaintext.
-   [ ] Se genera requestId.
-   [ ] Se publica evento.

## Tests

-   happy path
-   user not found
-   duplicate email
-   rate limit
-   code expiration

```{=html}
<!-- -->
```
    ---

    # 32. Una task debe tener un Definition of Done

    Ejemplo:

    ```md
    ## Definition of Done

    - [ ] Código implementado.
    - [ ] Tests unitarios.
    - [ ] Tests de integración.
    - [ ] Lint pasa.
    - [ ] Type-check pasa.
    - [ ] No existen regresiones.
    - [ ] Logs/metrics implementados.
    - [ ] Documentación actualizada.
    - [ ] Migration revisada.
    - [ ] Security review realizada cuando aplica.

Esto convierte "terminado" en una condición objetiva.

------------------------------------------------------------------------

# 33. Task granularity

Una buena task debería ser suficientemente pequeña para:

-   entenderse rápidamente;
-   revisarse fácilmente;
-   implementarse sin demasiada ambigüedad;
-   tener criterios de aceptación claros;
-   poder fallar independientemente.

Una señal de mala granularidad:

``` text
TASK-001
Implementar todo el sistema de autenticación.
```

Mejor:

``` text
TASK-001 DB schema
TASK-002 Password hashing
TASK-003 User repository
TASK-004 Login use case
TASK-005 Login controller
TASK-006 Refresh token
TASK-007 Rate limiting
TASK-008 Integration tests
```

------------------------------------------------------------------------

# 34. Implementation

La implementación es la traducción final. Es el primer nivel donde se
permite código ejecutable real:

``` text
Spec
 ↓
Design
 ↓
Task
 ↓
Code
```

Un ejemplo:

``` text
TS-001
  ↓
TASK-004
  ↓
src/application/use-cases/change-email.ts
```

La implementación no debería introducir silenciosamente decisiones que
cambien el contrato.

Si durante la implementación aparece una nueva decisión arquitectónica:

``` text
Implementation discovers issue
          ↓
Review Technical Spec
          ↓
Update Spec / ADR
          ↓
Update Tasks
          ↓
Continue implementation
```

Esto evita que la documentación quede obsoleta desde el primer día.

------------------------------------------------------------------------

# 35. TDD y SDD

SDD y TDD son complementarios.

``` text
SDD
¿Qué debe hacer?

TDD
¿Cómo demostramos mediante tests que funciona?
```

Flujo:

``` text
Functional Requirement
        ↓
Acceptance Criteria
        ↓
Technical Design
        ↓
Test
        ↓
Implementation
        ↓
Refactor
```

Ejemplo:

``` ts
it('rejects an expired verification code', async () => {
  // Given
  const request = expiredEmailChangeRequest();

  // When
  const result = await verifyEmailChange(request.id, '123456');

  // Then
  expect(result).toEqual({
    error: 'CODE_EXPIRED'
  });
});
```

El test representa un comportamiento especificado.

------------------------------------------------------------------------

# 36. BDD y SDD

BDD puede utilizarse para expresar criterios funcionales:

``` gherkin
Feature: Change email

  Scenario: Valid verification code
    Given a user has requested an email change
    And the verification code has not expired
    When the user submits the valid code
    Then the email must be updated
```

Esto crea una cadena:

``` text
Business Requirement
        ↓
BDD Scenario
        ↓
Acceptance Test
        ↓
Implementation
```

------------------------------------------------------------------------

# 37. SDD y AI Coding Agents

SDD es especialmente útil cuando se trabaja con agentes de IA para
programación.

Un agente puede cometer errores cuando recibe:

``` text
"Implementa login."
```

La instrucción contiene demasiada ambigüedad.

En cambio:

``` text
Functional Spec
        +
Technical Spec
        +
Task
        +
Acceptance Criteria
        +
Constraints
```

reduce el espacio de decisiones.

Por ejemplo:

``` md
## Agent Task

Implement TASK-004.

### Must

- Follow TS-001.
- Do not change public API.
- Do not modify database schema.
- Add unit tests.
- Preserve existing error codes.

### Files allowed

- src/application/**
- src/domain/**
- test/unit/**

### Validation

npm run lint
npm run typecheck
npm test
```

Esto permite que un agente opere dentro de límites explícitos.

------------------------------------------------------------------------

# 38. Context Engineering para SDD

Cuando se trabaja con IA, la calidad de la especificación afecta
directamente la calidad de la implementación.

Un contexto útil puede estructurarse así:

``` text
/project
├── AGENTS.md
├── README.md
├── specs/
│   ├── functional/
│   │   └── FS-001-change-email.md
│   ├── technical/
│   │   └── TS-001-change-email.md
│   ├── tasks/
│   │   ├── TASK-001.md
│   │   ├── TASK-002.md
│   │   └── TASK-003.md
│   └── adr/
│       └── ADR-001.md
├── src/
├── tests/
└── docs/
```

La idea es que el agente pueda navegar:

``` text
TASK
 ↓
Technical Spec
 ↓
Functional Spec
 ↓
ADR
 ↓
Existing Code
```

------------------------------------------------------------------------

# 39. Traceability Matrix

Una de las mejores prácticas es mantener trazabilidad.

Ejemplo:

``` md
| Requirement | Technical Spec | Task | Test |
|---|---|---|---|
| FR-001 | TS-001 | TASK-001 | TEST-001 |
| FR-002 | TS-001 | TASK-002 | TEST-002 |
| FR-003 | TS-001 | TASK-003 | TEST-003 |
```

Esto permite detectar:

``` text
Requirement sin Task
        ↓
Gap

Task sin Requirement
        ↓
Potential scope creep

Requirement sin Test
        ↓
No verification

Test sin Requirement
        ↓
Potential unnecessary behavior
```

------------------------------------------------------------------------

# 40. Spec quality

Una buena especificación debe ser:

### Unambiguous

Evitar:

> El sistema debería responder rápidamente.

Mejor:

> El endpoint debe mantener p95 \< 200 ms bajo la carga definida en el
> SLO.

### Testable

Evitar:

> El sistema debe ser seguro.

Mejor:

> El código de verificación debe almacenarse mediante hash y nunca debe
> aparecer en logs.

### Complete

Debe cubrir:

-   happy path;
-   errores;
-   edge cases;
-   seguridad;
-   persistencia;
-   concurrencia;
-   observabilidad;
-   compatibilidad.

### Consistent

No debe haber contradicciones.

### Traceable

Cada requisito debe poder rastrearse hasta una implementación y prueba.

------------------------------------------------------------------------

# 41. Anti-patterns

## 41.1 Spec como documento decorativo

``` text
Spec
 ↓
Código
 ↓
Spec nunca actualizada
```

Esto produce documentación falsa.

------------------------------------------------------------------------

## 41.2 Technical spec demasiado abstracta

``` text
"Crear un servicio robusto y escalable."
```

No sirve para implementar.

Debe especificar decisiones concretas.

------------------------------------------------------------------------

## 41.3 Technical spec demasiado acoplada prematuramente

No hay que diseñar cada detalle antes de conocer el problema.

Mala práctica:

``` text
Elegir framework
Elegir 17 librerías
Diseñar 25 clases
```

antes de entender el comportamiento.

------------------------------------------------------------------------

## 41.4 Tasks gigantes

``` text
TASK-001 Implementar feature completa
```

Dificulta:

-   revisión;
-   paralelización;
-   debugging;
-   estimación;
-   uso de agentes.

------------------------------------------------------------------------

## 41.5 Acceptance criteria ambiguos

``` text
Debe funcionar correctamente.
```

No es verificable.

------------------------------------------------------------------------

## 41.6 Spec desactualizada

Si el código cambió por una decisión importante y la spec no:

``` text
Spec ≠ System
```

la trazabilidad queda rota.

------------------------------------------------------------------------

# 42. Flujo completo recomendado

Un proceso SDD robusto puede ser:

``` text
1. Problem Definition
       ↓
2. Functional Specification
       ↓
3. Review
       ↓
4. Technical Specification
       ↓
5. Architecture Review
       ↓
6. Task Breakdown
       ↓
7. Implementation
       ↓
8. Automated Tests
       ↓
9. Code Review
       ↓
10. Verification
       ↓
11. Evidence
       ↓
12. Spec Update
       ↓
13. Release
```

------------------------------------------------------------------------

# 43. Ejemplo completo

Supongamos:

> "Queremos que los usuarios puedan cancelar una suscripción."

## 43.1 Functional Spec

``` md
# FS-002 — Cancel Subscription

## Goal

Permitir que un usuario cancele su suscripción activa.

## FR-001

Un usuario autenticado puede solicitar la cancelación.

## FR-002

Una suscripción activa debe pasar a estado CANCELLED.

## FR-003

Una suscripción ya cancelada no debe generar una segunda cancelación.

## FR-004

El usuario debe recibir confirmación.

## Business Rules

- Solo el owner puede cancelar.
- Solo ACTIVE puede pasar a CANCELLED.
- La operación debe ser idempotente.
- La fecha de cancelación debe almacenarse.

## Acceptance Criteria

### AC-001

Given an ACTIVE subscription

When the owner cancels it

Then the subscription becomes CANCELLED.

### AC-002

Given a CANCELLED subscription

When the owner cancels it again

Then the operation is idempotent.

### AC-003

Given another user's subscription

When the user tries to cancel it

Then the system returns authorization failure.
```

------------------------------------------------------------------------

# 44. Technical Spec del ejemplo

``` md
# TS-002 — Cancel Subscription

## API

POST /v1/subscriptions/{subscriptionId}/cancel

## Authentication

Bearer token.

## Authorization

The authenticated user must equal subscription.ownerId.

## Domain

Subscription states:

ACTIVE
CANCELLED
PAUSED

Allowed transition:

ACTIVE → CANCELLED

CANCELLED → CANCELLED
  idempotent

PAUSED → CANCELLED
  rejected

## Persistence

Use optimistic locking through `version`.

UPDATE subscriptions
SET status = 'CANCELLED',
    cancelled_at = NOW(),
    version = version + 1
WHERE id = ?
  AND owner_id = ?
  AND status = 'ACTIVE'
  AND version = ?;

## Events

Publish:

SubscriptionCancelled

Payload:

{
  eventId,
  subscriptionId,
  ownerId,
  cancelledAt
}

## Reliability

Event publication must use the Outbox Pattern.

## Observability

Metrics:

subscription_cancellation_total
subscription_cancellation_failure_total

Log event:

subscription_cancelled

## Errors

SUBSCRIPTION_NOT_FOUND
FORBIDDEN
INVALID_STATE
```

------------------------------------------------------------------------

# 45. Tasks del ejemplo

``` text
TASK-001
Create subscription state migration

TASK-002
Implement cancellation domain transition

TASK-003
Implement repository cancellation with optimistic locking

TASK-004
Implement CancelSubscriptionUseCase

TASK-005
Implement HTTP controller

TASK-006
Implement SubscriptionCancelled outbox event

TASK-007
Add unit tests

TASK-008
Add integration tests

TASK-009
Add observability

TASK-010
Update API documentation
```

------------------------------------------------------------------------

# 46. Implementation del ejemplo

Una posible estructura:

``` text
src/
├── domain/
│   └── subscription/
│       ├── subscription.ts
│       └── subscription-errors.ts
│
├── application/
│   └── subscription/
│       └── cancel-subscription.ts
│
├── infrastructure/
│   ├── persistence/
│   │   └── subscription-repository.ts
│   └── events/
│       └── subscription-cancelled-outbox.ts
│
└── interfaces/
    └── http/
        └── cancel-subscription.controller.ts
```

La estructura exacta dependerá de la arquitectura existente.

------------------------------------------------------------------------

# 47. Review de una implementación SDD

Antes de aprobar un PR, se puede revisar:

``` text
[ ] ¿Existe Functional Spec?
[ ] ¿Existe Technical Spec?
[ ] ¿Cada requisito tiene ID?
[ ] ¿Cada requisito tiene acceptance criteria?
[ ] ¿Las tasks apuntan a requisitos?
[ ] ¿El código sigue la Technical Spec?
[ ] ¿Los tests cubren los acceptance criteria?
[ ] ¿Los errores están especificados?
[ ] ¿Se consideró concurrencia?
[ ] ¿Se consideró idempotencia?
[ ] ¿Se consideró seguridad?
[ ] ¿Se agregó observabilidad?
[ ] ¿Hay cambios de API?
[ ] ¿Hay cambios de DB?
[ ] ¿Existe migration?
[ ] ¿Se necesita ADR?
[ ] ¿La documentación sigue siendo correcta?
```

------------------------------------------------------------------------

# 48. Definition of Ready para una Spec

Antes de implementar:

``` md
## Definition of Ready

- [ ] Problem clearly defined.
- [ ] Goal defined.
- [ ] Scope defined.
- [ ] Non-goals defined.
- [ ] Actors identified.
- [ ] Functional requirements have IDs.
- [ ] Acceptance criteria are testable.
- [ ] Business rules are explicit.
- [ ] Technical design reviewed.
- [ ] API contracts defined.
- [ ] Data changes defined.
- [ ] Error model defined.
- [ ] Security considerations reviewed.
- [ ] Observability requirements defined.
- [ ] Risks documented.
- [ ] Open questions resolved.
```

------------------------------------------------------------------------

# 49. Definition of Done para una Feature

``` md
## Definition of Done

- [ ] All functional requirements implemented.
- [ ] All acceptance criteria verified.
- [ ] Unit tests passing.
- [ ] Integration tests passing.
- [ ] E2E tests added where appropriate.
- [ ] Static analysis passing.
- [ ] Type checking passing.
- [ ] Database migrations reviewed.
- [ ] API documentation updated.
- [ ] Metrics/logging/tracing implemented.
- [ ] Security review completed where necessary.
- [ ] Backward compatibility verified.
- [ ] Technical Spec updated.
- [ ] ADRs added/updated if required.
- [ ] Pull request reviewed.
```

------------------------------------------------------------------------

# 50. Plantilla de Functional Spec

``` md
# FS-XXX — <Feature Name>

## Context

<Context>

## Problem

<Problem>

## Goal

<Goal>

## Scope

### In Scope

- ...

### Out of Scope

- ...

## Actors

- ...

## Preconditions

- ...

## Functional Requirements

### FR-001 — <Requirement>

<Description>

### FR-002 — <Requirement>

<Description>

## Business Rules

### BR-001

<Rule>

## Main Flow

1. ...
2. ...
3. ...

## Alternative Flows

### AF-001

1. ...
2. ...

## Error Flows

### EF-001

<Error behavior>

## Acceptance Criteria

### AC-001

Given:
When:
Then:

## Non-Goals

- ...

## Open Questions

- ...
```

------------------------------------------------------------------------

# 51. Plantilla de Technical Spec

``` md
# TS-XXX — <Feature Name>

## References

- FS-XXX
- ADR-XXX

## Architecture Context

<Current architecture>

## Proposed Design

<Design>

## Components

### Component A

Responsibility:
Dependencies:
Constraints:

## Data Model

### Table / Entity

Fields:
Constraints:
Indexes:
Relations:

## API Contract

### Endpoint

Method:
Path:
Auth:
Request:
Response:
Errors:

## Domain Model

Entities:
Value Objects:
Services:
States:

## State Transitions

```text
STATE_A → STATE_B
```

## Transactions

`<Transaction boundaries>`{=html}

## Concurrency

`<Strategy>`{=html}

## Idempotency

`<Strategy>`{=html}

## External Integrations

`<Dependencies>`{=html}

## Events

`<Event contracts>`{=html}

## Error Handling

`<Error mapping>`{=html}

## Security

`<AuthN/AuthZ/data protection>`{=html}

## Observability

Logs: Metrics: Tracing: Alerts:

## Performance

Targets: Expected load:

## Configuration

`<Environment/configuration>`{=html}

## Migration

`<DB migration strategy>`{=html}

## Backward Compatibility

`<Compatibility>`{=html}

## Testing Strategy

Unit: Integration: E2E: Contract:

## Rollout

`<Deployment strategy>`{=html}

## Risks

-   ...

## Alternatives Considered

### Alternative A

Pros: Cons: Reason rejected:

## Open Questions

-   ...

```{=html}
<!-- -->
```
    ---

    # 52. Plantilla de Task

    ```md
    # TASK-XXX — <Task Name>

    ## References

    - FR-XXX
    - TS-XXX
    - ADR-XXX

    ## Objective

    <Concrete objective>

    ## Scope

    ### In Scope

    - ...

    ### Out of Scope

    - ...

    ## Technical Changes

    ### Files

    - `src/...`
    - `tests/...`

    ### Interfaces

    ```ts
    // expected interface

## Behavior

1.  ...
2.  ...
3.  ...

## Constraints

-   Do not change ...
-   Preserve ...
-   Must use ...

## Acceptance Criteria

-   [ ] ...
-   [ ] ...
-   [ ] ...

## Tests

-   [ ] Unit
-   [ ] Integration
-   [ ] E2E
-   [ ] Contract

## Validation

``` bash
npm run lint
npm run typecheck
npm test
```

## Definition of Done

-   [ ] Implementation complete.
-   [ ] Tests passing.
-   [ ] Documentation updated.
-   [ ] No regression.

```{=html}
<!-- -->
```
    ---

    # 53. Reglas prácticas para aplicar SDD

    ## Regla 1 — Primero comportamiento

    Antes de hablar de clases, define qué debe ocurrir.

    ```text
    Behavior → Design → Code

## Regla 2 --- Identificadores estables

Usa:

``` text
FR-001
BR-001
AC-001
TS-001
ADR-001
TASK-001
```

## Regla 3 --- Todo requisito importante debe ser verificable

``` text
Requirement
    ↓
Acceptance Criteria
    ↓
Test
```

## Regla 4 --- Las decisiones importantes deben quedar registradas

``` text
Why X instead of Y?
```

La respuesta debería existir en una spec o ADR.

## Regla 5 --- No ocultar decisiones en el código

Si una decisión cambia:

-   arquitectura;
-   contrato;
-   persistencia;
-   seguridad;
-   consistencia;
-   rendimiento;

debe revisarse la Technical Spec.

## Regla 6 --- Mantener las specs cerca del código

La especificación debe vivir dentro del mismo ciclo de versionado:

``` text
Git
 ├── code
 ├── tests
 └── specs
```

Idealmente, una modificación de comportamiento cambia código y spec en
el mismo PR.

------------------------------------------------------------------------

# 54. SDD como sistema de control de cambios

El verdadero valor aparece cuando hay evolución.

Supongamos:

``` text
v1:
"Cancelar inmediatamente"
```

Luego negocio decide:

``` text
v2:
"Cancelar al final del período"
```

Con SDD:

``` text
Requirement changed
       ↓
Functional Spec changed
       ↓
Technical Spec changed
       ↓
Tasks changed
       ↓
Tests changed
       ↓
Implementation changed
```

Sin SDD, normalmente ocurre:

``` text
Product request
       ↓
Developer changes code
       ↓
Some tests fail
       ↓
More code changes
       ↓
Nobody knows what the real behavior is
```

------------------------------------------------------------------------

# 55. SDD y Git

Una estrategia útil es incluir IDs de especificación en commits y PRs.

Ejemplo:

``` text
feat(subscription): implement TASK-004

Refs:
- FR-002
- TS-002
- TASK-004
```

PR:

``` text
# Implement subscription cancellation

Requirements:
- FR-001
- FR-002
- FR-003

Technical Spec:
- TS-002

Tasks:
- TASK-002
- TASK-003
- TASK-004
- TASK-007
```

Esto facilita auditoría y debugging.

------------------------------------------------------------------------

# 56. SDD y CI/CD

La CI puede validar parte de la disciplina.

Ejemplo conceptual:

``` text
Pull Request
    ↓
Lint
    ↓
Typecheck
    ↓
Unit Tests
    ↓
Integration Tests
    ↓
Contract Tests
    ↓
Architecture Checks
    ↓
Build
    ↓
Deploy
```

En organizaciones maduras se pueden agregar validaciones como:

``` text
PR modifies API
    ↓
API spec must also change

PR modifies DB model
    ↓
Migration must exist

PR references FR
    ↓
Acceptance test must exist
```

No todo tiene que automatizarse desde el principio.

------------------------------------------------------------------------

# 57. Nivel de detalle correcto

No existe una cantidad universal de documentación.

La regla útil es:

> **Documentar las decisiones que alguien razonablemente podría
> implementar de forma diferente.**

Si una decisión tiene una sola implementación obvia, no necesita 20
páginas.

Si existen cinco alternativas razonables, la spec debe explicar:

``` text
Chosen approach
Why
Constraints
Trade-offs
```

------------------------------------------------------------------------

# 58. Cómo saber si una Spec está lista

Una prueba práctica:

Entrega solamente:

``` text
Functional Spec
+
Technical Spec
+
Task
```

a otro ingeniero.

Si puede responder sin preguntarte:

-   qué debe construir;
-   qué no debe construir;
-   qué API implementar;
-   qué datos persistir;
-   qué errores devolver;
-   cómo manejar estados;
-   qué tests escribir;
-   qué restricciones respetar;

entonces probablemente la spec tiene suficiente calidad.

Si necesita preguntarte continuamente:

> "¿Y aquí qué hacemos?"

hay ambigüedad que debería resolverse antes de implementar.

------------------------------------------------------------------------

# 59. Modelo mental final

Puedes pensar SDD de esta manera:

``` text
                   BUSINESS
                      │
                      ▼
                ┌───────────┐
                │ Functional│
                │    Spec   │
                └─────┬─────┘
                      │
                      ▼
                ┌───────────┐
                │ Technical │
                │    Spec   │
                └─────┬─────┘
                      │
                      ▼
                ┌───────────┐
                │   Tasks   │
                └─────┬─────┘
                      │
                      ▼
                ┌───────────┐
                │    Code   │
                └─────┬─────┘
                      │
                      ▼
                ┌───────────┐
                │   Tests   │
                └─────┬─────┘
                      │
                      ▼
                ┌───────────┐
                │ Evidence  │
                └───────────┘
```

La pregunta fundamental en cada transición es:

``` text
¿Por qué existe este cambio?
```

Y la respuesta debe poder rastrearse:

``` text
Code
 ↑
Task
 ↑
Technical Spec
 ↑
Functional Requirement
 ↑
Business Goal
```

------------------------------------------------------------------------

# 60. Resumen ejecutivo

SDD puede resumirse en cuatro contratos:

### 1. Functional Spec

Define:

``` text
WHAT
```

Qué comportamiento necesita el sistema.

### 2. Technical Spec

Define:

``` text
HOW
```

Cómo se construirá técnicamente.

### 3. Task

Define:

``` text
WORK
```

Qué cambio concreto debe realizarse.

### 4. Implementation

Produce:

``` text
SYSTEM
```

El código y artefactos que satisfacen los contratos anteriores.

La cadena completa es:

``` text
Goal
 ↓
Requirement
 ↓
Acceptance Criteria
 ↓
Functional Spec
 ↓
Technical Spec
 ↓
Task
 ↓
Implementation
 ↓
Tests
 ↓
Evidence
```

La métrica más importante no es cuánta documentación existe, sino **qué
tan pequeña es la distancia entre lo que se especificó, lo que se
implementó y lo que se puede demostrar mediante tests**.
