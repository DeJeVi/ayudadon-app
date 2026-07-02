"use client";

import React, { useState, useEffect, useRef } from 'react';
import { getMarcas, getProductosDestacados, getHeroSlides } from '@/lib/api';
import type { Marca, Producto, HeroSlide } from '@/types/api';

export default function HomePage() {
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);

  // Hook para detectar si es pantalla móvil y ajustar los chunks del slider
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize(); // Ejecutar al montar
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
  
  // Si es móvil muestra 2 por slide, si es desktop muestra 4
  const productSlides = chunkArray(productos, isMobile ? 2 : 4);
  const totalProdSlides = productSlides.length || 1;

  const revealRefs = useRef<(HTMLElement | null)[]>([]);

  // Autoplay
  useEffect(() => {
    if (loading || heroSlides.length === 0) return;
    const heroTimer = setInterval(() => setHeroIndex((p) => (p + 1) % totalHeroSlides), 8000);
    const prodTimer = setInterval(() => setProdIndex((p) => (p + 1) % totalProdSlides), 6000);
    return () => { clearInterval(heroTimer); clearInterval(prodTimer); };
  }, [loading, heroSlides.length, totalHeroSlides, totalProdSlides]);

  // Observer para animaciones de entrada
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.remove('opacity-0', 'translate-y-16', 'scale-95');
            entry.target.classList.add('opacity-100', 'translate-y-0', 'scale-100');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    revealRefs.current.forEach((el) => { if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, [marcas, productos]);

  const addToRefs = (el: HTMLElement | null) => {
    if (el && !revealRefs.current.includes(el)) revealRefs.current.push(el);
  };

  if (loading) return <HomeSkeleton />;

  return (
    <div className="bg-[#F5F5F7] font-sans text-gray-800 overflow-x-hidden selection:bg-brand-brown selection:text-white min-h-screen">

      {/* ═══════════════════════════════
          HERO SLIDER
      ═══════════════════════════════ */}
      <section className="bg-brand-sky relative overflow-hidden group flex items-center h-[65vh] min-h-[450px] max-h-[650px] w-full">
        
        {/* Decoraciones de fondo */}
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-white/20 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
        <div className="absolute -bottom-32 right-10 w-96 h-96 bg-brand-navy/10 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />

        {/* TRACK */}
        <div
          className="flex transition-transform duration-700 ease-out w-full h-full relative z-10"
          style={{ transform: `translateX(-${heroIndex * 100}%)` }}
        >
          {heroSlides.map((slide) => (
            <div key={slide.id} className="min-w-full h-full flex-shrink-0 relative">
              <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 h-full flex flex-col md:flex-row items-center justify-center md:justify-between">

                {/* TEXTO (Arriba en móvil, Izquierda en desktop) */}
                <div className="w-full md:w-1/2 flex flex-col justify-center items-center md:items-start text-white text-center md:text-left z-20 pt-10 md:pt-0">
                  <h1
                    className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight drop-shadow-md mb-4 md:mb-6"
                    dangerouslySetInnerHTML={{ __html: slide.title }}
                  />
                  {slide.hasButton && (
                    <a
                      href={slide.buttonHref || '#'}
                      className="inline-block bg-brand-brown hover:bg-brand-brownDark text-white font-black text-sm md:text-lg py-3 px-8 md:py-4 md:px-10 rounded-full shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 active:scale-95"
                    >
                      {slide.buttonText}
                    </a>
                  )}
                </div>

                {/* MASCOTA (Abajo en móvil, Derecha en desktop) */}
                <div className="w-full md:w-1/2 h-1/2 md:h-full flex justify-center md:justify-end items-end pb-4 md:pb-0 z-10 relative">
                  <img
                    src={slide.imageUrl}
                    alt="Ayudadón"
                    className="h-full w-auto object-contain object-bottom drop-shadow-2xl animate-mascot-float scale-90 md:scale-100"
                  />
                </div>

              </div>
            </div>
          ))}
        </div>

        {/* FLECHAS DE NAVEGACIÓN */}
        <button
          onClick={() => setHeroIndex((p) => (p - 1 + totalHeroSlides) % totalHeroSlides)}
          className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 bg-white/50 hover:bg-white text-brand-navy p-3 md:p-4 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-md hover:scale-110 z-30 focus:outline-none"
        >
          <i className="fa-solid fa-chevron-left" />
        </button>
        <button
          onClick={() => setHeroIndex((p) => (p + 1) % totalHeroSlides)}
          className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 bg-white/50 hover:bg-white text-brand-navy p-3 md:p-4 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-md hover:scale-110 z-30 focus:outline-none"
        >
          <i className="fa-solid fa-chevron-right" />
        </button>

        {/* DOTS */}
        <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-3 z-30">
          {heroSlides.map((slide, idx) => (
            <button
              key={slide.id}
              onClick={() => setHeroIndex(idx)}
              className={`rounded-full transition-all duration-300 focus:outline-none ${
                heroIndex === idx ? 'bg-white w-8 h-3 shadow-md' : 'bg-white/50 hover:bg-white/80 w-3 h-3'
              }`}
            />
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════
          CONTENIDO PRINCIPAL
      ═══════════════════════════════ */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-12 md:py-20 w-full">

        {/* PRODUCTOS DESTACADOS */}
        <div ref={addToRefs} className="mb-16 md:mb-24 opacity-0 translate-y-16 transition-all duration-700 ease-out">
          
          <div className="flex justify-between items-end mb-6 md:mb-8 px-2">
            <h2 className="text-2xl md:text-4xl font-black text-brand-navy tracking-tight">
              <i className="fa-solid fa-fire-flame-curved text-brand-brown mr-2" /> Populares
            </h2>
            {/* Opcional: Botón "Ver todos" */}
            <a href="/catalogo" className="hidden sm:block text-sm font-bold text-brand-brown hover:text-brand-brownDark transition-colors">
              Ver catálogo <i className="fa-solid fa-arrow-right ml-1"></i>
            </a>
          </div>

          <div className="overflow-hidden rounded-3xl p-1 md:p-2">
            <div
              className="flex transition-transform duration-700 ease-out"
              style={{ transform: `translateX(-${prodIndex * 100}%)` }}
            >
              {productSlides.map((slide, slideIdx) => (
                <div key={slideIdx} className="min-w-full flex-shrink-0 px-2 py-2">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
                    {slide.map((producto) => (
                      <ProductCard key={producto.id} producto={producto} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dots de Productos */}
          {totalProdSlides > 1 && (
            <div className="flex justify-center gap-3 mt-6">
              {productSlides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setProdIndex(idx)}
                  className={`rounded-full transition-all duration-300 focus:outline-none ${
                    prodIndex === idx ? 'bg-brand-navy w-6 h-2.5 shadow-sm' : 'bg-gray-300 hover:bg-gray-400 w-2.5 h-2.5'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* MARCAS ASOCIADAS */}
        <div className="mt-12 md:mt-24">
          <div ref={addToRefs} className="text-center mb-8 md:mb-12 opacity-0 translate-y-16 transition-all duration-700 ease-out">
            <h2 className="text-2xl md:text-4xl font-black text-brand-navy tracking-tight">
              Nuestras Marcas
            </h2>
            <p className="text-gray-500 font-medium mt-2">Apoyando el talento y la calidad local.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {marcas.map((marca, idx) => (
              <BrandCard
                key={marca.id}
                marca={marca}
                addToRefs={addToRefs}
                delayMs={idx * 100} // Cascada fluida
              />
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// COMPONENTE: TARJETA DE MARCA
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
      ref={addToRefs}
      style={{ transitionDelay: `${delayMs}ms` }}
      className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-card hover:-translate-y-2 active:scale-95 transition-all duration-300 opacity-0 translate-y-16 group"
    >
      <a href={`/marca/${marca.slug}`} className="flex flex-col items-center w-full p-6 text-center h-full">
        
        <div className="w-20 h-20 md:w-24 md:h-24 bg-[#F5F5F7] rounded-2xl flex items-center justify-center mb-4 overflow-hidden group-hover:bg-brand-brown/10 transition-colors duration-300">
          {marca.logoUrl ? (
            <img
              src={marca.logoUrl}
              alt={marca.name}
              className="w-[70%] h-[70%] object-contain group-hover:scale-110 transition-transform duration-300"
              onError={(e) => {
                const t = e.currentTarget;
                t.style.display = 'none';
                const fb = t.nextElementSibling as HTMLElement;
                if (fb) fb.style.display = 'flex';
              }}
            />
          ) : null}
          <span
            className={`${marca.logoUrl ? 'hidden' : 'flex'} w-full h-full items-center justify-center text-3xl font-black text-brand-brown group-hover:scale-110 transition-transform`}
          >
            {marca.name.charAt(0)}
          </span>
        </div>

        <h3 className="font-bold text-sm md:text-base text-brand-navy leading-tight mb-2 line-clamp-2">
          {marca.name}
        </h3>
        
        <p className="text-xs text-gray-500 font-medium leading-snug line-clamp-3 mt-auto">
          {marca.description}
        </p>

      </a>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// COMPONENTE: TARJETA DE PRODUCTO
// ─────────────────────────────────────────────────────────────
function ProductCard({ producto }: { producto: Producto }) {
  return (
    <a
      href={`/producto/${producto.slug}`}
      className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-card hover:-translate-y-2 active:scale-95 transition-all duration-300 p-4 md:p-5 flex flex-col justify-between h-full group"
    >
      {/* Etiqueta opcional de "Nuevo" o "Hot" */}
      <div className="h-32 sm:h-40 md:h-48 bg-[#F5F5F7] rounded-2xl flex items-center justify-center mb-4 overflow-hidden relative">
        {producto.imageUrl ? (
          <img src={producto.imageUrl} alt={producto.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <span className="text-5xl md:text-7xl group-hover:scale-110 transition-transform duration-500 drop-shadow-sm">🏺</span>
        )}
      </div>

      <div className="flex flex-col flex-grow">
        <h3 className="font-bold text-sm md:text-base text-brand-navy leading-tight mb-1 line-clamp-2">
          {producto.name}
        </h3>
        {/* Placeholder para la marca si lo deseas agregar después */}
        <p className="text-[10px] sm:text-xs text-gray-400 font-bold uppercase tracking-wider mb-3">Marca Local</p>
        
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-50">
          <span className="font-black text-brand-brown text-lg md:text-xl tracking-tight">
            ${producto.price.toFixed(0)}
          </span>
          <button
            className="bg-[#F5F5F7] text-brand-navy w-10 h-10 rounded-xl flex items-center justify-center hover:bg-brand-brown hover:text-white transition-colors duration-300 shadow-sm focus:outline-none"
            aria-label={`Agregar ${producto.name} al carrito`}
            onClick={(e) => {
                e.preventDefault();
                // Lógica para abrir el carrito
            }}
          >
            <i className="fa-solid fa-cart-plus" />
          </button>
        </div>
      </div>
    </a>
  );
}

// ─────────────────────────────────────────────────────────────
// COMPONENTE: SKELETON (Carga)
// ─────────────────────────────────────────────────────────────
function HomeSkeleton() {
  return (
    <div className="bg-[#F5F5F7] min-h-screen flex flex-col animate-pulse">
      <div className="w-full h-[60vh] min-h-[450px] bg-gray-200" />
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-20 w-full">
        <div className="h-8 w-64 bg-gray-200 rounded-lg mb-8" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 lg:gap-8 mb-20">
          {[1, 2, 3, 4].map((i) => <div key={i} className="h-72 bg-gray-200 rounded-3xl" />)}
        </div>
        <div className="h-8 w-64 bg-gray-200 rounded-lg mx-auto mb-10" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {[1, 2, 3, 4, 5].map((i) => <div key={i} className="h-56 bg-gray-200 rounded-3xl" />)}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// UTILIDAD: CHUNKS (Separar array en pedazos)
// ─────────────────────────────────────────────────────────────
function chunkArray<T>(arr: T[], size: number): T[][] {
  if (arr.length === 0) return [];
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) result.push(arr.slice(i, i + size));
  return result;
}