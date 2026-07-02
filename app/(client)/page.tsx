"use client";

import React, { useState, useEffect, useRef } from 'react';
import { getMarcas, getProductosDestacados, getHeroSlides } from '@/lib/api';
import type { Marca, Producto, HeroSlide } from '@/types/api';

export default function HomePage() {
  // =========================================================================
  // DATOS — ahora vienen de la capa lib/api.ts 
  // =========================================================================
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

  // =========================================================================
  // ESTADOS DE LOS CARRUSELES
  // =========================================================================
  const [heroIndex, setHeroIndex] = useState(0);
  const [prodIndex, setProdIndex] = useState(0);

  const totalHeroSlides = heroSlides.length || 1;
  const productSlides = chunkArray(productos, 3);
  const totalProdSlides = productSlides.length || 1;

  const revealRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    if (loading || heroSlides.length === 0) return;

    const heroTimer = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % totalHeroSlides);
    }, 10000);

    const prodTimer = setInterval(() => {
      setProdIndex((prev) => (prev + 1) % totalProdSlides);
    }, 8000);

    return () => {
      clearInterval(heroTimer);
      clearInterval(prodTimer);
    };
  }, [loading, heroSlides.length, totalHeroSlides, totalProdSlides]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.remove('opacity-0', 'translate-y-10', 'translate-y-16', 'translate-y-24', 'scale-90', 'scale-95');
            entry.target.classList.add('opacity-100', 'translate-y-0', 'scale-100');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -50px 0px" }
    );

    revealRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [marcas, productos]);

  const addToRefs = (el: HTMLElement | null) => {
    if (el && !revealRefs.current.includes(el)) {
      revealRefs.current.push(el);
    }
  };

  if (loading) {
    return <HomeSkeleton />;
  }

  return (
    <div className="bg-gray-50 font-sans text-gray-800 overflow-x-hidden selection:bg-[#d4a373] selection:text-white">

      {/* HERO SLIDER */}
      <section className="bg-gradient-to-br from-[#8fd3ec] via-[#7ac7e1] to-[#5fb3d4] h-[320px] sm:h-[300px] md:h-[350px] relative overflow-hidden group flex items-center">

        <div className="absolute -top-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" aria-hidden="true" />
        <div className="absolute -bottom-24 left-1/3 w-72 h-72 bg-white/5 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-white/5 pointer-events-none" aria-hidden="true" />

        <div className="flex transition-transform duration-700 ease-out w-full h-full relative z-[5]" style={{ transform: `translateX(-${heroIndex * 100}%)` }}>
          {heroSlides.map((slide) => (
            <div key={slide.id} className="min-w-full h-full flex-shrink-0 flex flex-col md:flex-row relative max-w-7xl mx-auto px-4 md:px-6">

                <div className="w-full md:w-3/5 lg:w-2/3 h-[58%] md:h-full flex flex-col justify-center text-white relative z-10 text-center md:text-left pt-4 md:pt-0">
                    <h1
                      className="text-[1.7rem] leading-[1.15] sm:text-4xl sm:leading-tight md:text-5xl lg:text-6xl xl:text-7xl font-extrabold drop-shadow-lg text-balance"
                      dangerouslySetInnerHTML={{ __html: slide.title }}
                    ></h1>
                    {slide.hasButton && (
                      <div className="mt-4 sm:mt-6 md:mt-8">
                        <a
                          href={slide.buttonHref || '#'}
                          className="inline-block relative z-[50] pointer-events-auto bg-[#d4a373] text-white font-black text-xs sm:text-sm md:text-xl py-2.5 px-6 sm:py-3 sm:px-8 md:py-4 md:px-10 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 hover:bg-[#a0714a] transition-all duration-300 active:scale-95"
                        >
                          {slide.buttonText}
                        </a>
                      </div>
                    )}
                </div>

                <div className="relative md:absolute w-full md:w-full h-[42%] md:h-full flex justify-center md:justify-end items-end z-[40] pointer-events-none md:pr-16 lg:pr-24 order-first md:order-none">
                    <img
                      src={slide.imageUrl}
                      alt="Mascota Ayudadón"
                      className="h-full sm:h-full md:h-[100%] lg:h-[108%] w-auto max-w-[55%] sm:max-w-[45%] md:max-w-none object-contain object-bottom drop-shadow-2xl opacity-90 sm:opacity-95 md:opacity-100 animate-mascot-float"
                    />
                </div>

            </div>
          ))}
        </div>

        <button
          onClick={() => setHeroIndex((prev) => (prev - 1 + totalHeroSlides) % totalHeroSlides)}
          aria-label="Slide anterior"
          className="absolute left-2 md:left-6 top-1/2 transform -translate-y-1/2 bg-white/70 hover:bg-white hover:scale-110 text-[#1e3a5f] p-2 md:p-4 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg z-[50] focus:outline-none"
        >
            <i className="fa-solid fa-chevron-left text-base md:text-xl"></i>
        </button>
        <button
          onClick={() => setHeroIndex((prev) => (prev + 1) % totalHeroSlides)}
          aria-label="Slide siguiente"
          className="absolute right-2 md:right-6 top-1/2 transform -translate-y-1/2 bg-white/70 hover:bg-white hover:scale-110 text-[#1e3a5f] p-2 md:p-4 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg z-[50] focus:outline-none"
        >
            <i className="fa-solid fa-chevron-right text-base md:text-xl"></i>
        </button>

        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3 z-[50]">
            {heroSlides.map((slide, idx) => (
              <button
                key={slide.id}
                onClick={() => setHeroIndex(idx)}
                aria-label={`Ir al slide ${idx + 1}`}
                className={`w-2 h-2 md:w-3 md:h-3 rounded-full shadow-sm transition-all duration-300 ${heroIndex === idx ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/80'}`}
              ></button>
            ))}
        </div>
      </section>

      {/* CONTENIDO PRINCIPAL */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-16">

        {/* PRODUCTOS DESTACADOS — de 3 en 3 */}
        <div ref={(el) => addToRefs(el)} className="mb-12 md:mb-20 relative group opacity-0 translate-y-10 transition-all duration-700 ease-out">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800 text-center md:text-left flex items-center gap-3 justify-center md:justify-start">
                <i className="fa-solid fa-star text-[#d4a373] text-xl"></i> Productos destacados
            </h2>

            <div className="overflow-hidden relative px-2 py-4 -mx-2">
                <div className="flex transition-transform duration-700 ease-out w-full" style={{ transform: `translateX(-${prodIndex * 100}%)` }}>
                    {productSlides.map((slide, slideIdx) => (
                      <div key={slideIdx} className="min-w-full flex-shrink-0">
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-6">
                              {slide.map((producto) => (
                                <ProductCard key={producto.id} producto={producto} />
                              ))}
                          </div>
                      </div>
                    ))}
                </div>
            </div>

            {totalProdSlides > 1 && (
              <div className="flex justify-center gap-2 mt-6">
                  {productSlides.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setProdIndex(idx)}
                      aria-label={`Ir al grupo de productos ${idx + 1}`}
                      className={`w-2 h-2 md:w-2.5 md:h-2.5 rounded-full transition-all duration-300 ${prodIndex === idx ? 'bg-[#1e3a5f] scale-125' : 'bg-gray-300 hover:bg-gray-400'}`}
                    ></button>
                  ))}
              </div>
            )}
        </div>

       {/* NEGOCIOS ASOCIADOS */}
       <div className="mt-12 md:mt-24">
            <h2 ref={(el) => addToRefs(el)} className="text-2xl md:text-3xl font-bold mb-8 md:mb-12 text-[#a0714a] border-b-4 border-[#d4a373] inline-block pb-2 text-center md:text-left w-full md:w-auto opacity-0 translate-y-10 transition-all duration-700">
              Marcas Asociadas
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-8">
                {marcas.map((marca, idx) => (
                    <BrandCard key={marca.id} marca={marca} addToRefs={addToRefs} delayMs={idx * 100} />
                ))}
            </div>
        </div>
      </main>

    </div>
  );
}

// =============================================================
// SUBCOMPONENTES
// =============================================================

function BrandCard({ marca, addToRefs, delayMs }: { marca: Marca; addToRefs: (el: HTMLElement | null) => void; delayMs: number }) {
  return (
    <div
      ref={(el) => addToRefs(el)}
      style={{ transitionDelay: `${delayMs}ms` }}
      className="bg-white rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 p-6 flex flex-col items-center justify-center border border-gray-100 group cursor-pointer text-center opacity-0 translate-y-10"
    >
      <a href={`/marca/${marca.slug}`} className="flex flex-col items-center w-full">
        <div className="w-16 h-16 md:w-24 md:h-24 bg-gray-50 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-[#d4a373]/20 group-hover:scale-110 transition-all duration-300 overflow-hidden">
          {marca.logoUrl ? (
            <img
              src={marca.logoUrl}
              alt={marca.name}
              className="w-full h-full object-contain p-1"
              onError={(e) => {
                const target = e.currentTarget;
                target.style.display = 'none';
                const fallback = target.nextElementSibling as HTMLElement;
                if (fallback) fallback.style.display = 'flex';
              }}
            />
          ) : null}
          <span
            className={`${marca.logoUrl ? 'hidden' : 'flex'} w-full h-full items-center justify-center text-lg md:text-2xl font-black text-[#a0714a]`}
            aria-hidden="true"
          >
            {marca.name.charAt(0)}
          </span>
        </div>
        <h3 className="font-bold text-sm md:text-lg text-[#1e3a5f] leading-tight">{marca.name}</h3>
        <p className="text-xs md:text-sm text-gray-500 mt-2 font-medium">{marca.description}</p>
      </a>
    </div>
  );
}

function ProductCard({ producto }: { producto: Producto }) {
  return (
    <a
      href={`/producto/${producto.slug}`}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col justify-between hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group/card cursor-pointer"
    >
      <div className="h-24 md:h-36 bg-gray-50 rounded-xl flex items-center justify-center mb-4 overflow-hidden group-hover/card:scale-110 transition-transform duration-300">
        {producto.imageUrl ? (
          <img src={producto.imageUrl} alt={producto.name} className="w-full h-full object-contain" />
        ) : (
          <span className="text-4xl md:text-5xl">🏺</span>
        )}
      </div>
      <div>
          <h3 className="font-bold text-sm md:text-base leading-tight mb-2 truncate text-gray-800">{producto.name}</h3>
          <div className="flex items-center justify-between mt-2">
              <span className="font-extrabold text-[#a0714a] text-base md:text-lg">MXN {producto.price.toFixed(0)}</span>
              <button
                className="bg-gray-100 p-2 md:p-2.5 rounded-xl text-gray-600 hover:bg-[#d4a373] hover:text-white hover:shadow-md transition-all duration-300 active:scale-95"
                aria-label={`Agregar ${producto.name} al carrito`}
                onClick={(e) => e.preventDefault()}
              >
                <i className="fa-solid fa-cart-plus"></i>
              </button>
          </div>
      </div>
    </a>
  );
}

function HomeSkeleton() {
  return (
    <div className="bg-gray-50 min-h-[600px] animate-pulse">
      <div className="h-[320px] sm:h-[300px] md:h-[350px] bg-gray-200" />
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-16">
        <div className="h-8 w-48 bg-gray-200 rounded mb-6" />
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-6 mb-16">
          {[1, 2, 3].map((i) => <div key={i} className="h-48 bg-gray-200 rounded-2xl" />)}
        </div>
        <div className="h-8 w-56 bg-gray-200 rounded mb-8" />
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => <div key={i} className="h-48 bg-gray-200 rounded-3xl" />)}
        </div>
      </div>
    </div>
  );
}

// =============================================================
// UTILIDAD
// =============================================================

function chunkArray<T>(arr: T[], size: number): T[][] {
  if (arr.length === 0) return [];
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}