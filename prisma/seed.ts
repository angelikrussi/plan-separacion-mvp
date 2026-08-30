import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  await prisma.producto.createMany({
    data: [
      {
        nombre: "Ventilador de pie 3 velocidades",
        descripcion: "Ventilador de pie oscilante, 3 velocidades, ideal para el hogar.",
        precio: 300000,
        categoria: "Ventiladores",
        fotos: JSON.stringify([]),
        stockLimitado: true,
        cantidadDisponible: 5,
        opcionesPlan: JSON.stringify([3, 6, 10]),
        condiciones: "Reserva exclusiva mientras el plan esté activo.",
      },
      {
        nombre: "Ventilador de techo",
        descripcion: "Ventilador de techo silencioso, control remoto incluido.",
        precio: 420000,
        categoria: "Ventiladores",
        fotos: JSON.stringify([]),
        stockLimitado: false,
        cantidadDisponible: null,
        opcionesPlan: JSON.stringify([6, 10]),
        condiciones: "Stock ilimitado.",
      },
      {
        nombre: "Celular Galaxy A15",
        descripcion: "Smartphone gama media, 128GB, doble SIM.",
        precio: 850000,
        categoria: "Celulares",
        fotos: JSON.stringify([]),
        stockLimitado: true,
        cantidadDisponible: 3,
        opcionesPlan: JSON.stringify([6, 10, 12]),
        condiciones: "Reserva exclusiva mientras el plan esté activo.",
      },
      {
        nombre: "iPhone 13 128GB",
        descripcion: "iPhone 13, 128GB, todos los colores disponibles.",
        precio: 2100000,
        categoria: "Celulares",
        fotos: JSON.stringify([]),
        stockLimitado: true,
        cantidadDisponible: 2,
        opcionesPlan: JSON.stringify([10, 12, 18]),
        condiciones: "Reserva exclusiva mientras el plan esté activo.",
      },
      {
        nombre: "Portátil básico 14''",
        descripcion: "Portátil para trabajo y estudio, 8GB RAM, 256GB SSD.",
        precio: 1200000,
        categoria: "Computadores",
        fotos: JSON.stringify([]),
        stockLimitado: false,
        cantidadDisponible: null,
        opcionesPlan: JSON.stringify([6, 12, 18]),
        condiciones: "Stock ilimitado — disponible para todos los clientes durante el plan.",
      },
      {
        nombre: "PC de escritorio gamer",
        descripcion: "PC de escritorio para gaming, tarjeta gráfica dedicada.",
        precio: 3200000,
        categoria: "Computadores",
        fotos: JSON.stringify([]),
        stockLimitado: true,
        cantidadDisponible: 2,
        opcionesPlan: JSON.stringify([12, 18, 24]),
        condiciones: "Reserva exclusiva mientras el plan esté activo.",
      },
      {
        nombre: "Televisor 50'' 4K",
        descripcion: "Smart TV 50 pulgadas, resolución 4K, HDR.",
        precio: 1500000,
        categoria: "Televisores",
        fotos: JSON.stringify([]),
        stockLimitado: true,
        cantidadDisponible: 4,
        opcionesPlan: JSON.stringify([6, 12]),
        condiciones: "Reserva exclusiva mientras el plan esté activo.",
      },
      {
        nombre: "Televisor 32'' HD",
        descripcion: "Televisor 32 pulgadas HD, ideal para habitaciones.",
        precio: 650000,
        categoria: "Televisores",
        fotos: JSON.stringify([]),
        stockLimitado: false,
        cantidadDisponible: null,
        opcionesPlan: JSON.stringify([3, 6]),
        condiciones: "Stock ilimitado.",
      },
      {
        nombre: "Nevera 300L",
        descripcion: "Nevera No Frost 300 litros, bajo consumo.",
        precio: 1800000,
        categoria: "Electrodomésticos",
        fotos: JSON.stringify([]),
        stockLimitado: true,
        cantidadDisponible: 2,
        opcionesPlan: JSON.stringify([10, 12, 18]),
        condiciones: "Reserva exclusiva mientras el plan esté activo.",
      },
      {
        nombre: "Lavadora 18kg",
        descripcion: "Lavadora automática 18kg, múltiples programas.",
        precio: 1400000,
        categoria: "Electrodomésticos",
        fotos: JSON.stringify([]),
        stockLimitado: false,
        cantidadDisponible: null,
        opcionesPlan: JSON.stringify([6, 12]),
        condiciones: "Stock ilimitado.",
      },
      {
        nombre: "Juego de sala 3 puestos",
        descripcion: "Sofá de 3 puestos, tapizado en lino, patas de madera.",
        precio: 1600000,
        categoria: "Muebles",
        fotos: JSON.stringify([]),
        stockLimitado: true,
        cantidadDisponible: 3,
        opcionesPlan: JSON.stringify([6, 12, 18]),
        condiciones: "Reserva exclusiva mientras el plan esté activo.",
      },
      {
        nombre: "Comedor 4 puestos",
        descripcion: "Mesa de comedor con 4 sillas, madera maciza.",
        precio: 1100000,
        categoria: "Muebles",
        fotos: JSON.stringify([]),
        stockLimitado: false,
        cantidadDisponible: null,
        opcionesPlan: JSON.stringify([6, 12]),
        condiciones: "Stock ilimitado.",
      },
    ],
  });

  const passwordHash = await bcrypt.hash("Admin1234", 10);
  await prisma.administrador.upsert({
    where: { usuario: "admin" },
    update: {},
    create: { usuario: "admin", passwordHash, rol: "administrador" },
  });

  console.log("Seed completo: 12 productos, 1 administrador (admin / Admin1234).");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
