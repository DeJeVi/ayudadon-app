"use client";

import React, { useState, useEffect, useRef } from 'react';
import { getMarcas, getProductosDestacados, getHeroSlides } from '@/lib/api';
import type { Marca, Producto, HeroSlide } from '@/types/api';

export default function HomePage() {
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [marcasData, productosData, slidesData] = await Promise.all([
          getMarcas(),
          getProductosDestacados(),
          getHeroSlides(),
        ]);
        setMarcas(marcasData);
        setProductos(productosData);
        setHeroSlides(slidesData);
      } catch (err) {
        console.error('Error cargando datos del home:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const [heroIndex, setHeroIndex] = useState(0);
  const [prodIndex, setProdIndex] = useState(0);

  const totalHeroSlides = heroSlides.length || 1;
  const productSlides = chunkArray(productos, 3);
  const totalProdSlides = productSlides.length || 1;

  const revealRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    if (loading || heroSlides.length === 0) return;
    const heroTimer = setInterval(() => setHeroIndex((p) => (p + 1) % totalHeroSlides), 10000);
    const prodTimer = setInterval(() => setProdIndex((p) => (p + 1) % totalProdSlides), 8000);
    return () => { clearInterval(heroTimer); clearInterval(prodTimer); };
  }, [loading, heroSlides.length, totalHeroSlides, totalProdSlides]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.remove('opacity-0', 'translate-y-10', 'scale-95');
            entry.target.classList.add('opacity-100', 'translate-y-0', 'scale-100');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    revealRefs.current.forEach((el) => { if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, [marcas, productos]);

  const addToRefs = (el: HTMLElement | null) => {
    if (el && !revealRefs.current.includes(el)) revealRefs.current.push(el);
  };

  if (loading) return <HomeSkeleton />;

  return (
    <div className="bg-gray-50 font-sans text-gray-800 overflow-x-hidden selection:bg-[#d4a373] selection:text-white">

      {/* ═══════════════════════════════
          HERO SLIDER
      ═══════════════════════════════ */}
      <section
        className="bg-gradient-to-br from-[#8fd3ec] via-[#7ac7e1] to-[#5fb3d4] relative overflow-hidden group flex items-center"
        style={{ height: 'clamp(320px, 50vw, 400px)' }}
      >
        <div className="absolute -top-20 -left-20 w-56 h-56 bg-white/10 rounded-full blur-2xl pointer-events-none" aria-hidden="true" />
        <div className="absolute -bottom-20 right-1/4 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />

        {/* TRACK */}
        <div
          className="flex transition-transform duration-700 ease-out w-full h-full relative z-[5]"
          style={{ transform: `translateX(-${heroIndex * 100}%)` }}
        >
          {heroSlides.map((slide) => (
            <div key={slide.id} className="min-w-full h-full flex-shrink-0 relative">
              <div className="max-w-7xl mx-auto px-5 md:px-8 h-full flex flex-col md:flex-row md:items-center">

                {/* MASCOTA — mobile: bloque propio centrado arriba (40% alto)
                             md+: absolute anclada al fondo derecho */}
                <div className="
                  order-first md:order-none
                  w-full h-[42%]
                  flex justify-center items-end
                  md:absolute md:right-0 md:bottom-0
                  md:h-full md:w-auto md:pr-12 lg:pr-20
                  pointer-events-none z-[40]
                ">
                  <img
                    src={slide.imageUrl}
                    alt="Mascota Ayudadón"
                    className="
                      h-full w-auto
                      max-w-[46vw] sm:max-w-[36vw]
                      md:h-[108%] md:max-w-none
                      object-contain object-bottom
                      drop-shadow-2xl animate-mascot-float
                    "
                  />
                </div>

                {/* TEXTO */}
                <div className="
                  order-last md:order-none
                  w-full md:w-[58%]
                  h-[58%] md:h-auto
                  flex flex-col justify-center
                  text-white text-center md:text-left
                  pb-2 md:pb-0 relative z-10
                ">
                  <h1
                    className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-tight drop-shadow-lg"
                    dangerouslySetInnerHTML={{ __html: slide.title }}
                  />
                  {slide.hasButton && (
                    <div className="mt-4 sm:mt-6 md:mt-8">
                      <a
                        href={slide.buttonHref || '#'}
                        className="inline-block bg-[#d4a373] hover:bg-[#a0714a] text-white font-black text-xs sm:text-sm md:text-lg py-2.5 px-6 sm:py-3 sm:px-8 md:py-4 md:px-10 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 active:scale-95 z-[50]"
                      >
                        {slide.buttonText}
                      </a>
                    </div>
                  )}
                </div>

              </div>
            </div>
          ))}
        </div>

        {/* Flechas */}
        <button
          onClick={() => setHeroIndex((p) => (p - 1 + totalHeroSlides) % totalHeroSlides)}
          aria-label="Slide anterior"
          className="absolute left-2 md:left-5 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white hover:scale-110 text-[#1e3a5f] p-2 md:p-3.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg z-[50]"
        >
          <i className="fa-solid fa-chevron-left text-sm md:text-lg" />
        </button>
        <button
          onClick={() => setHeroIndex((p) => (p + 1) % totalHeroSlides)}
          aria-label="Slide siguiente"
          className="absolute right-2 md:right-5 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white hover:scale-110 text-[#1e3a5f] p-2 md:p-3.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg z-[50]"
        >
          <i className="fa-solid fa-chevron-right text-sm md:text-lg" />
        </button>

        {/* Dots del hero */}
        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2 z-[50]">
          {heroSlides.map((slide, idx) => (
            <button
              key={slide.id}
              onClick={() => setHeroIndex(idx)}
              aria-label={`Ir al slide ${idx + 1}`}
              className={`rounded-full transition-all duration-300 ${
                heroIndex === idx
                  ? 'bg-white w-5 h-2.5'
                  : 'bg-white/50 hover:bg-white/80 w-2.5 h-2.5'
              }`}
            />
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════
          CONTENIDO PRINCIPAL
      ═══════════════════════════════ */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-16">

        {/* PRODUCTOS DESTACADOS
            IMPORTANTE: los dots de navegación están FUERA del div
            con overflow-hidden para que sean clickeables */}
        <div
          ref={(el) => addToRefs(el)}
          className="mb-12 md:mb-20 opacity-0 translate-y-10 transition-all duration-700 ease-out"
        >
          <h2 className="text-xl md:text-3xl font-bold mb-5 md:mb-6 text-gray-800 flex items-center gap-2 md:gap-3 justify-center md:justify-start">
            <i className="fa-solid fa-star text-[#d4a373] text-base md:text-xl" /> Productos destacados
          </h2>

          {/* Track con overflow oculto — solo el track, no los dots */}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-700 ease-out"
              style={{ transform: `translateX(-${prodIndex * 100}%)` }}
            >
              {productSlides.map((slide, slideIdx) => (
                <div key={slideIdx} className="min-w-full flex-shrink-0 px-1 py-3">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-6">
                    {slide.map((producto) => (
                      <ProductCard key={producto.id} producto={producto} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dots FUERA del overflow-hidden — siempre clickeables */}
          {totalProdSlides > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              {productSlides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setProdIndex(idx)}
                  aria-label={`Página de productos ${idx + 1}`}
                  className={`rounded-full transition-all duration-300 ${
                    prodIndex === idx
                      ? 'bg-[#1e3a5f] w-5 h-2.5'
                      : 'bg-gray-300 hover:bg-gray-400 w-2.5 h-2.5'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* MARCAS ASOCIADAS */}
        <div className="mt-10 md:mt-24">
          <h2
            ref={(el) => addToRefs(el)}
            className="text-xl md:text-3xl font-bold mb-6 md:mb-12 text-[#a0714a] border-b-4 border-[#d4a373] inline-block pb-2 opacity-0 translate-y-10 transition-all duration-700"
          >
            Marcas Asociadas
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-5 md:gap-8">
            {marcas.map((marca, idx) => (
              <BrandCard
                key={marca.id}
                marca={marca}
                addToRefs={addToRefs}
                delayMs={idx * 80}
              />
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// TARJETA DE MARCA — descripción visible en todos los tamaños,
// logo más generoso, active feedback táctil
// ─────────────────────────────────────────────────────────────
function BrandCard({
  marca,
  addToRefs,
  delayMs,
}: {
  marca: Marca;
  addToRefs: (el: HTMLElement | null) => void;
  delayMs: number;
}) {
  return (
    <div
      ref={(el) => addToRefs(el)}
      style={{ transitionDelay: `${delayMs}ms` }}
      className="bg-white rounded-2xl md:rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2 active:scale-[0.97] transition-all duration-300 opacity-0 translate-y-10 cursor-pointer"
    >
      <a href={`/marca/${marca.slug}`} className="flex flex-col items-center w-full p-4 md:p-6 text-center">

        {/* Logo */}
        <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-50 rounded-xl md:rounded-2xl flex items-center justify-center mb-3 md:mb-4 overflow-hidden ring-1 ring-gray-100 hover:ring-[#d4a373]/40 transition-all duration-300">
          {marca.logoUrl ? (
            <img
              src={marca.logoUrl}
              alt={marca.name}
              className="w-full h-full object-contain p-2"
              onError={(e) => {
                const t = e.currentTarget;
                t.style.display = 'none';
                const fb = t.nextElementSibling as HTMLElement;
                if (fb) fb.style.display = 'flex';
              }}
            />
          ) : null}
          <span
            className={`${marca.logoUrl ? 'hidden' : 'flex'} w-full h-full items-center justify-center text-2xl md:text-3xl font-black text-[#a0714a]`}
            aria-hidden="true"
          >
            {marca.name.charAt(0)}
          </span>
        </div>

        {/* Nombre */}
        <h3 className="font-bold text-sm md:text-lg text-[#1e3a5f] leading-tight mb-1 md:mb-2">
          {marca.name}
        </h3>

        {/* Descripción — visible en todos los tamaños como en el diseño original */}
        <p className="text-xs md:text-sm text-gray-500 font-medium leading-snug">
          {marca.description}
        </p>

      </a>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// TARJETA DE PRODUCTO
// ─────────────────────────────────────────────────────────────
function ProductCard({ producto }: { producto: Producto }) {
  return (
    <a
      href={`/producto/${producto.slug}`}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2 active:scale-[0.97] transition-all duration-300 p-3 md:p-4 flex flex-col justify-between cursor-pointer group/card"
    >
      <div className="h-24 sm:h-28 md:h-36 bg-gray-50 rounded-xl flex items-center justify-center mb-3 overflow-hidden group-hover/card:scale-110 transition-transform duration-300">
        {producto.imageUrl ? (
          <img src={producto.imageUrl} alt={producto.name} className="w-full h-full object-contain" />
        ) : (
          <span className="text-4xl md:text-5xl">🏺</span>
        )}
      </div>
      <div>
        <h3 className="font-bold text-xs sm:text-sm md:text-base leading-tight mb-2 truncate text-gray-800">
          {producto.name}
        </h3>
        <div className="flex items-center justify-between">
          <span className="font-extrabold text-[#a0714a] text-sm md:text-lg">
            MXN {producto.price.toFixed(0)}
          </span>
          <button
            className="bg-gray-100 p-2 md:p-2.5 rounded-xl text-gray-500 text-xs md:text-sm hover:bg-[#d4a373] hover:text-white hover:shadow-md active:scale-95 transition-all duration-300"
            aria-label={`Agregar ${producto.name} al carrito`}
            onClick={(e) => e.preventDefault()}
          >
            <i className="fa-solid fa-cart-plus" />
          </button>
        </div>
      </div>
    </a>
  );
}

// ─────────────────────────────────────────────────────────────
// SKELETON
// ─────────────────────────────────────────────────────────────
function HomeSkeleton() {
  return (
    <div className="bg-gray-50 min-h-[600px] animate-pulse">
      <div className="bg-gray-200" style={{ height: 'clamp(320px, 50vw, 400px)' }} />
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-16">
        <div className="h-7 w-48 bg-gray-200 rounded mb-5" />
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-6 mb-16">
          {[1, 2, 3].map((i) => <div key={i} className="h-44 bg-gray-200 rounded-2xl" />)}
        </div>
        <div className="h-7 w-48 bg-gray-200 rounded mb-6" />
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-5 md:gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => <div key={i} className="h-40 bg-gray-200 rounded-2xl" />)}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// UTILIDAD
// ─────────────────────────────────────────────────────────────
function chunkArray<T>(arr: T[], size: number): T[][] {
  if (arr.length === 0) return [];
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) result.push(arr.slice(i, i + size));
  return result;
}