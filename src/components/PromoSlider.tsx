"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Slide = {
  titulo: string;
  texto: string;
  cta: string;
  href: string;
  bg: string;
  ctaText: string;
};

const SLIDES: Slide[] = [
  {
    titulo: "Aparta hoy, paga a tu ritmo",
    texto: "Elige tu producto, arma un plan de cuotas y haz seguimiento a cada abono hasta recibirlo.",
    cta: "Ver catálogo",
    href: "/catalogo",
    bg: "bg-brand",
    ctaText: "text-brand-dark",
  },
  {
    titulo: "Celulares desde 6 cuotas",
    texto: "Separa el celular que quieres sin pagarlo de una sola vez.",
    cta: "Ver celulares",
    href: "/catalogo?categoria=Celulares",
    bg: "bg-gold",
    ctaText: "text-gold-dark",
  },
  {
    titulo: "Renueva tu sala o comedor",
    texto: "Muebles con plan separe a tu medida, hasta 18 cuotas.",
    cta: "Ver muebles",
    href: "/catalogo?categoria=Muebles",
    bg: "bg-ink",
    ctaText: "text-ink",
  },
];

export function PromoSlider() {
  const [activo, setActivo] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setActivo((i) => (i + 1) % SLIDES.length), 5000);
    return () => clearInterval(id);
  }, []);

  const slide = SLIDES[activo];

  return (
    <section className="relative rounded-xl overflow-hidden">
      <div className={`${slide.bg} text-white px-6 py-12 sm:py-16 flex flex-col gap-3 transition-colors`}>
        <h1 className="text-2xl sm:text-3xl font-bold max-w-xl">{slide.titulo}</h1>
        <p className="text-white/90 max-w-xl">{slide.texto}</p>
        <Link href={slide.href} className={`mt-2 self-start rounded-lg bg-white px-5 py-3 font-semibold ${slide.ctaText}`}>
          {slide.cta}
        </Link>
      </div>

      <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            aria-label={`Ir a la promoción ${i + 1}`}
            onClick={() => setActivo(i)}
            className={`h-2 rounded-full transition-all ${i === activo ? "w-6 bg-white" : "w-2 bg-white/50"}`}
          />
        ))}
      </div>
    </section>
  );
}
