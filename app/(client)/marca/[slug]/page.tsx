"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { getMarcaBySlug, getProductosByMarca, getHeroSlides } from '@/lib/api';
import type { Marca, Producto, HeroSlide } from '@/types/api';

export default function MarcaPage() {
  const params = useParams();
  const slug = params.slug as string;

  // =========================================================
  // DATOS — desde la capa lib/api.ts (mock hoy, backend real después)
  // =========================================================
  const [marca, setMarca] = useState<Marca | null>(null);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [marcaData, slidesData] = await Promise.all([
          getMarcaBySlug(slug),
          getHeroSlides(),
        ]);

        if (!marcaData) {
          setNotFound(true);
          return;
        }

        const productosData = await getProductosByMarca(marcaData.id);
        setMarca(marcaData);
        setProductos(productosData);
        setHeroSlides(slidesData);
      } catch (err) {
        console.error('Error cargando datos de la marca:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [slug]);

  // =========================================================
  // ESTADOS DEL CARRUSEL Y ANIMACIONES
  // =========================================================
  const [heroIndex, setHeroIndex] = useState(0);
  const totalHeroSlides = heroSlides.length || 1;
  const revealRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    if (loading || heroSlides.length === 0) return;
    const heroTimer = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % totalHeroSlides);
    }, 10000);
    return () => clearInterval(heroTimer);
  }, [loading, heroSlides.length, totalHeroSlides]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.remove('opacity-0', 'translate-y-10');
            entry.target.classList.add('opacity-100', 'translate-y-0');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -50px 0px" }
    );
    revealRefs.current.forEach((el) => { if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, [marca, productos]);

  const addToRefs = (el: HTMLElement | null) => {
    if (el && !revealRefs.current.includes(el)) revealRefs.current.push(el);
  };

  if (loading) return <MarcaSkeleton />;

  if (notFound || !marca) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-black text-brand-navy mb-2">Marca no encontrada</h1>
        <p className="text-gray-500">No pudimos encontrar la marca que buscas.</p>
        <a href="/" className="inline-block mt-6 bg-brand-brown text-white font-bold px-6 py-3 rounded-full hover:bg-brand-brownDark transition-colors">
          Volver al inicio
        </a>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 font-sans text-gray-800 overflow-x-hidden selection:bg-brand-brown selection:text-white flex flex-col min-h-screen">

      {/* HERO SLIDER — idéntico al Home, usando datos reales de hero-slides */}
      <section className="bg-gradient-to-br from-[#8fd3ec] via-brand-sky to-[#5fb3d4] h-[320px] sm:h-[300px] md:h-[350px] relative overflow-hidden group flex items-center">

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
                          className="inline-block relative z-[50] pointer-events-auto bg-brand-brown text-white font-black text-xs sm:text-sm md:text-xl py-2.5 px-6 sm:py-3 sm:px-8 md:py-4 md:px-10 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 hover:bg-brand-brownDark transition-all duration-300 active:scale-95"
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
          className="absolute left-2 md:left-6 top-1/2 transform -translate-y-1/2 bg-white/70 hover:bg-white hover:scale-110 text-brand-navy p-2 md:p-4 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg z-[50] focus:outline-none"
        >
            <i className="fa-solid fa-chevron-left text-base md:text-xl"></i>
        </button>
        <button
          onClick={() => setHeroIndex((prev) => (prev + 1) % totalHeroSlides)}
          aria-label="Slide siguiente"
          className="absolute right-2 md:right-6 top-1/2 transform -translate-y-1/2 bg-white/70 hover:bg-white hover:scale-110 text-brand-navy p-2 md:p-4 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg z-[50] focus:outline-none"
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

      {/* CONTENIDO DE LA MARCA */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-16 flex-grow w-full">

        {/* ENCABEZADO DE LA MARCA */}
        <div ref={(el) => addToRefs(el)} className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10 md:mb-12 pb-6 border-b-2 border-gray-200/60 opacity-0 translate-y-10 transition-all duration-700 ease-out">

            <div className="flex flex-col md:flex-row items-center text-center md:text-left gap-4 md:gap-6 w-full md:w-auto">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white flex items-center justify-center bg-white flex-shrink-0 overflow-hidden relative shadow-sm hover:shadow-xl hover:scale-105 transition-all duration-300">
                    {marca.logoUrl ? (
                      <img
                        src={marca.logoUrl}
                        alt={`Logo de ${marca.name}`}
                        className="w-full h-full object-contain p-2"
                        onError={(e) => {
                          const target = e.currentTarget;
                          target.style.display = 'none';
                          const fallback = target.nextElementSibling as HTMLElement;
                          if (fallback) fallback.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <span
                      className={`${marca.logoUrl ? 'hidden' : 'flex'} w-full h-full items-center justify-center text-3xl font-black text-brand-brownDark`}
                      aria-hidden="true"
                    >
                      {marca.name.charAt(0)}
                    </span>
                </div>
                <div>
                    <h1 className="text-3xl md:text-5xl font-black text-brand-navy mb-2 tracking-tight">{marca.name}</h1>
                    <p className="text-gray-600 text-sm md:text-base max-w-xl leading-relaxed font-medium mx-auto md:mx-0">
                        {marca.description}
                    </p>
                </div>
            </div>

            {/* Iconos de Confianza */}
            <div className="flex gap-4 sm:gap-6 md:gap-10 w-full md:w-auto justify-center md:justify-end mt-4 md:mt-0 pt-6 md:pt-0">
                <div className="flex flex-col items-center text-center gap-2 group">
                    <div className="w-12 h-12 rounded-full bg-brand-brown/10 flex items-center justify-center group-hover:bg-brand-brown transition-colors">
                        <i className="fa-solid fa-truck-fast text-xl md:text-2xl text-brand-brown group-hover:text-white transition-colors"></i>
                    </div>
                    <span className="text-xs md:text-sm font-bold text-brand-navy leading-tight">Envío<br/>local</span>
                </div>
                <div className="flex flex-col items-center text-center gap-2 group">
                    <div className="w-12 h-12 rounded-full bg-brand-brown/10 flex items-center justify-center group-hover:bg-brand-brown transition-colors">
                        <i className="fa-solid fa-handshake-angle text-xl md:text-2xl text-brand-brown group-hover:text-white transition-colors"></i>
                    </div>
                    <span className="text-xs md:text-sm font-bold text-brand-navy leading-tight">Apoyo<br/>comunitario</span>
                </div>
                <div className="flex flex-col items-center text-center gap-2 group">
                    <div className="w-12 h-12 rounded-full bg-brand-sky/20 flex items-center justify-center group-hover:bg-brand-sky transition-colors">
                        <i className="fa-regular fa-credit-card text-xl md:text-2xl text-brand-navyLight group-hover:text-white transition-colors"></i>
                    </div>
                    <span className="text-xs md:text-sm font-bold text-brand-navy leading-tight">Pagos<br/>seguros</span>
                </div>
            </div>
        </div>

        {/* GRID DE PRODUCTOS DE LA MARCA */}
        <div ref={(el) => addToRefs(el)} className="w-full opacity-0 translate-y-10 transition-all duration-700 ease-out">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-brand-navy border-b-4 border-brand-brown inline-block pb-2">
              Catálogo de Productos
            </h2>

            {productos.length === 0 ? (
              <p className="text-gray-500 text-center py-12">Esta marca aún no tiene productos publicados.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                  {productos.map((prod) => (
                      <a
                        key={prod.id}
                        href={`/producto/${prod.slug}`}
                        className="bg-white rounded-2xl shadow-card border border-gray-100 p-4 flex flex-col justify-between hover:shadow-card-hover hover:-translate-y-2 transition-all duration-300 group/card cursor-pointer"
                      >
                          <div className="h-24 md:h-36 bg-gray-50 rounded-xl flex items-center justify-center mb-4 overflow-hidden group-hover/card:scale-110 transition-transform duration-300">
                              {prod.imageUrl ? (
                                <img src={prod.imageUrl} alt={prod.name} className="w-full h-full object-contain" />
                              ) : (
                                <span className="text-4xl md:text-5xl">🏺</span>
                              )}
                          </div>
                          <div className="mt-auto">
                              <h3 className="font-bold text-sm md:text-base leading-tight mb-2 truncate text-gray-800">{prod.name}</h3>
                              <div className="flex items-center justify-between mt-2">
                                  <span className="font-extrabold text-brand-brownDark text-base md:text-lg">MXN {prod.price.toFixed(0)}</span>
                                  <button
                                    className="bg-gray-100 p-2 md:p-2.5 rounded-xl text-gray-600 hover:bg-brand-brown hover:text-white hover:shadow-md transition-all duration-300 active:scale-95"
                                    aria-label={`Agregar ${prod.name} al carrito`}
                                    onClick={(e) => e.preventDefault()}
                                  >
                                      <i className="fa-solid fa-cart-plus"></i>
                                  </button>
                              </div>
                          </div>
                      </a>
                  ))}
              </div>
            )}
        </div>

      </main>
    </div>
  );
}

function MarcaSkeleton() {
  return (
    <div className="bg-gray-50 min-h-screen animate-pulse">
      <div className="h-[320px] sm:h-[300px] md:h-[350px] bg-gray-200" />
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-16">
        <div className="flex items-center gap-6 mb-12">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gray-200" />
          <div className="flex-1">
            <div className="h-8 w-64 bg-gray-200 rounded mb-3" />
            <div className="h-4 w-96 bg-gray-200 rounded" />
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {[1, 2, 3, 4, 5].map((i) => <div key={i} className="h-48 bg-gray-200 rounded-2xl" />)}
        </div>
      </div>
    </div>
  );
}