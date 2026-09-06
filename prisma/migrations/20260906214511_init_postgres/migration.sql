-- CreateTable
CREATE TABLE "Cliente" (
    "id" TEXT NOT NULL,
    "nombreCompleto" TEXT NOT NULL,
    "documentoIdentidad" TEXT NOT NULL,
    "celular" TEXT NOT NULL,
    "correo" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "totpSecret" TEXT,
    "totpHabilitado" BOOLEAN NOT NULL DEFAULT false,
    "fechaRegistro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Cliente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Administrador" (
    "id" TEXT NOT NULL,
    "usuario" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "rol" TEXT NOT NULL DEFAULT 'administrador',

    CONSTRAINT "Administrador_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Producto" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "precio" INTEGER NOT NULL,
    "categoria" TEXT NOT NULL,
    "fotos" TEXT NOT NULL,
    "stockLimitado" BOOLEAN NOT NULL DEFAULT false,
    "cantidadDisponible" INTEGER,
    "opcionesPlan" TEXT NOT NULL,
    "condiciones" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "Producto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Plan" (
    "id" TEXT NOT NULL,
    "clienteId" TEXT NOT NULL,
    "productoId" TEXT NOT NULL,
    "valorTotal" INTEGER NOT NULL,
    "numeroCuotas" INTEGER NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'ACTIVO',
    "totalPagado" INTEGER NOT NULL DEFAULT 0,
    "saldoPendiente" INTEGER NOT NULL,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "motivoCancelacion" TEXT,

    CONSTRAINT "Plan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Abono" (
    "id" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "valor" INTEGER NOT NULL,
    "metodoPago" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "referencia" TEXT,
    "comprobanteUrl" TEXT NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'PENDIENTE',
    "motivoRechazo" TEXT,
    "administradorId" TEXT,
    "fechaResolucion" TIMESTAMP(3),
    "revisadoPor" TEXT,
    "revisadoEn" TIMESTAMP(3),

    CONSTRAINT "Abono_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Entrega" (
    "id" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "nombreReceptor" TEXT,
    "telefono" TEXT,
    "ciudad" TEXT,
    "direccion" TEXT,
    "barrio" TEXT,
    "puntoReferencia" TEXT,
    "fechaPreferida" TEXT,
    "estadoEntrega" TEXT NOT NULL DEFAULT 'PENDIENTE_DE_PREPARACION',

    CONSTRAINT "Entrega_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Auditoria" (
    "id" TEXT NOT NULL,
    "entidad" TEXT NOT NULL,
    "entidadId" TEXT NOT NULL,
    "accion" TEXT NOT NULL,
    "actor" TEXT NOT NULL,
    "fechaHora" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "valoresAnteriores" TEXT NOT NULL,
    "valoresNuevos" TEXT NOT NULL,

    CONSTRAINT "Auditoria_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_correo_key" ON "Cliente"("correo");

-- CreateIndex
CREATE UNIQUE INDEX "Administrador_usuario_key" ON "Administrador"("usuario");

-- CreateIndex
CREATE INDEX "Plan_clienteId_idx" ON "Plan"("clienteId");

-- CreateIndex
CREATE INDEX "Plan_estado_idx" ON "Plan"("estado");

-- CreateIndex
CREATE INDEX "Abono_planId_idx" ON "Abono"("planId");

-- CreateIndex
CREATE INDEX "Abono_estado_idx" ON "Abono"("estado");

-- CreateIndex
CREATE UNIQUE INDEX "Entrega_planId_key" ON "Entrega"("planId");

-- CreateIndex
CREATE INDEX "Auditoria_entidadId_idx" ON "Auditoria"("entidadId");

-- AddForeignKey
ALTER TABLE "Plan" ADD CONSTRAINT "Plan_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Plan" ADD CONSTRAINT "Plan_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Abono" ADD CONSTRAINT "Abono_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Abono" ADD CONSTRAINT "Abono_administradorId_fkey" FOREIGN KEY ("administradorId") REFERENCES "Administrador"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Entrega" ADD CONSTRAINT "Entrega_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
