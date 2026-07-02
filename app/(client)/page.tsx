"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { getMarcas, getProductosDestacados, getHeroSlides } from "@/lib/api";
import type { Marca, Producto, HeroSlide } from "@/types/api";

export default function HomePage() {
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);

  const isMobile = useIsMobile();
  const prefersReducedMotion = usePrefersReducedMotion();

  const [heroIndex, setHeroIndex] = useState(0);
  const [prodIndex, setProdIndex] = useState(0);

  const revealRefs = useRef<(HTMLElement | null)[]>([]);

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
        console.error("Error cargando datos del home:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const productSlides = useMemo(() => {
    return chunkArray(productos, isMobile ? 2 : 4);
  }, [productos, isMobile]);

  const totalHeroSlides = heroSlides.length || 1;
  const totalProdSlides = productSlides.length || 1;

  useEffect(() => {
    if (
      loading ||
      prefersReducedMotion ||
      heroSlides.length === 0 ||
      totalHeroSlides <= 1
    ) {
      return;
    }

    const heroTimer = window.setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % totalHeroSlides);
    }, 8500);

    return () => window.clearInterval(heroTimer);
  }, [loading, prefersReducedMotion, heroSlides.length, totalHeroSlides]);

  useEffect(() => {
    if (
      loading ||
      prefersReducedMotion ||
      productos.length === 0 ||
      totalProdSlides <= 1
    ) {
      return;
    }

    const prodTimer = window.setInterval(() => {
      setProdIndex((prev) => (prev + 1) % totalProdSlides);
    }, 7000);

    return () => window.clearInterval(prodTimer);
  }, [loading, prefersReducedMotion, productos.length, totalProdSlides]);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.remove("opacity-0", "translate-y-8");
          entry.target.classList.add("opacity-100", "translate-y-0");

          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -24px 0px",
      }
    );

    revealRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [marcas.length, productos.length, prefersReducedMotion]);

  const addToRefs = (el: HTMLElement | null) => {
    if (el && !revealRefs.current.includes(el)) {
      revealRefs.current.push(el);
    }
  };

  const revealClass = prefersReducedMotion
    ? "opacity-100 translate-y-0"
    : "opacity-0 translate-y-8 transition-[opacity,transform] duration-500 ease-out";

  if (loading) return <HomeSkeleton />;

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#F5F5F7] font-sans text-gray-800 selection:bg-brand-brown selection:text-white">
      {/* HERO */}
      <section className="relative flex min-h-[560px] w-full items-center overflow-hidden bg-brand-sky sm:min-h-[620px] md:h-[68vh] md:min-h-[520px] md:max-h-[680px]">
        <div
          className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-white/20 blur-2xl md:h-72 md:w-72"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-28 right-0 h-72 w-72 rounded-full bg-brand-navy/10 blur-2xl md:h-96 md:w-96"
          aria-hidden="true"
        />

        <div
          className="relative z-10 flex h-full w-full transition-transform duration-500 ease-out will-change-transform"
          style={{ transform: `translateX(-${heroIndex * 100}%)` }}
        >
          {heroSlides.map((slide, idx) => (
            <div key={slide.id} className="min-w-full flex-shrink-0">
              <div className="mx-auto grid h-full max-w-7xl grid-rows-[auto_1fr] items-center gap-2 px-4 pb-10 pt-8 sm:px-6 md:grid-cols-2 md:grid-rows-1 md:gap-8 md:px-12 md:py-0 lg:px-16">
                <div className="z-20 flex flex-col items-center text-center text-white md:items-start md:text-left">
                  <h1
                    className="mb-4 max-w-[680px] text-[2.45rem] font-black leading-[0.95] tracking-tight drop-shadow-md sm:text-5xl md:mb-6 md:text-6xl lg:text-7xl"
                    dangerouslySetInnerHTML={{
                      __html: cleanAyudadonTitle(slide.title),
                    }}
                  />

                  {slide.hasButton && (
                    <a
                      href={slide.buttonHref || "#"}
                      className="rounded-full bg-brand-brown px-7 py-3 text-sm font-black text-white shadow-card transition-[background-color,transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:bg-brand-brownDark hover:shadow-card-hover active:scale-95 md:px-10 md:py-4 md:text-lg"
                    >
                      {slide.buttonText}
                    </a>
                  )}
                </div>

                <div className="relative flex h-full min-h-[300px] items-end justify-center md:min-h-0 md:justify-end">
                  <img
                    src={slide.imageUrl}
                    alt="Ayudadón"
                    loading={idx === 0 ? "eager" : "lazy"}
                    decoding="async"
                    fetchPriority={idx === 0 ? "high" : "auto"}
                    className="max-h-[360px] w-auto max-w-[112%] object-contain object-bottom drop-shadow-2xl sm:max-h-[430px] md:max-h-[95%] md:max-w-full md:translate-x-4 lg:translate-x-8"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {totalHeroSlides > 1 && (
          <>
            <button
              onClick={() =>
                setHeroIndex((prev) => (prev - 1 + totalHeroSlides) % totalHeroSlides)
              }
              className="absolute left-3 top-1/2 z-30 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/70 text-brand-navy shadow-md transition duration-200 hover:bg-white active:scale-95 md:left-8 md:h-12 md:w-12"
              aria-label="Slide anterior"
            >
              <i className="fa-solid fa-chevron-left" />
            </button>

            <button
              onClick={() => setHeroIndex((prev) => (prev + 1) % totalHeroSlides)}
              className="absolute right-3 top-1/2 z-30 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/70 text-brand-navy shadow-md transition duration-200 hover:bg-white active:scale-95 md:right-8 md:h-12 md:w-12"
              aria-label="Siguiente slide"
            >
              <i className="fa-solid fa-chevron-right" />
            </button>

            <div className="absolute bottom-5 left-0 right-0 z-30 flex justify-center gap-2">
              {heroSlides.map((slide, idx) => (
                <button
                  key={slide.id}
                  onClick={() => setHeroIndex(idx)}
                  className={`h-2.5 rounded-full transition-all duration-200 ${
                    heroIndex === idx
                      ? "w-8 bg-white shadow-md"
                      : "w-2.5 bg-white/50 hover:bg-white/80"
                  }`}
                  aria-label={`Ir al slide ${idx + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </section>

      <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 md:px-8 md:py-16">
        {/* PRODUCTOS DESTACADOS */}
        <section
          ref={addToRefs}
          className={`mb-14 md:mb-20 ${revealClass}`}
        >
          <div className="mb-5 flex items-end justify-between px-1 md:mb-7">
            <h2 className="text-2xl font-black tracking-tight text-brand-navy md:text-4xl">
              <i className="fa-solid fa-fire-flame-curved mr-2 text-brand-brown" />
              Productos Destacados
            </h2>

            <a
              href="/catalogo"
              className="hidden text-sm font-bold text-brand-brown transition-colors hover:text-brand-brownDark sm:block"
            >
              Ver catálogo <i className="fa-solid fa-arrow-right ml-1" />
            </a>
          </div>

          <div className="overflow-hidden rounded-3xl">
            <div
              className="flex transition-transform duration-500 ease-out will-change-transform"
              style={{ transform: `translateX(-${prodIndex * 100}%)` }}
            >
              {productSlides.map((slide, slideIdx) => (
                <div key={slideIdx} className="min-w-full flex-shrink-0 px-1 py-1">
                  <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4 md:gap-6 lg:gap-8">
                    {slide.map((producto) => (
                      <ProductCard key={producto.id} producto={producto} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {totalProdSlides > 1 && (
            <div className="mt-5 flex justify-center gap-2">
              {productSlides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setProdIndex(idx)}
                  className={`h-2.5 rounded-full transition-all duration-200 ${
                    prodIndex === idx
                      ? "w-7 bg-brand-navy shadow-sm"
                      : "w-2.5 bg-gray-300 hover:bg-gray-400"
                  }`}
                  aria-label={`Ir a productos ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </section>

        {/* MARCAS ASOCIADAS */}
        <section className="mt-12 md:mt-20">
          <div
            ref={addToRefs}
            className={`mb-7 text-center md:mb-10 ${revealClass}`}
          >
            <h2 className="text-2xl font-black tracking-tight text-brand-navy md:text-4xl">
              Nuestras Marcas
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm font-medium text-gray-500 sm:text-base">
              Apoyando el talento y la calidad local.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
            {marcas.map((marca, idx) => (
              <BrandCard
                key={marca.id}
                marca={marca}
                addToRefs={addToRefs}
                delayMs={prefersReducedMotion ? 0 : Math.min(idx * 35, 175)}
                revealClass={revealClass}
              />
            ))}
          </div>
        </section>
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
  revealClass,
}: {
  marca: Marca;
  addToRefs: (el: HTMLElement | null) => void;
  delayMs: number;
  revealClass: string;
}) {
  return (
    <article
      ref={addToRefs}
      style={{ transitionDelay: `${delayMs}ms` }}
      className={`group overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition-[opacity,transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-card active:scale-[0.98] ${revealClass}`}
    >
      <a
        href={`/marca/${marca.slug}`}
        className="flex h-full min-h-[190px] w-full flex-col items-center p-3 text-center sm:min-h-[220px] sm:p-4 md:min-h-[250px]"
      >
        <div className="mb-3 flex h-28 w-full items-center justify-center overflow-hidden rounded-2xl bg-[#F5F5F7] p-3 transition-colors duration-200 group-hover:bg-brand-brown/10 sm:h-32 md:h-36">
          {marca.logoUrl ? (
            <img
              src={marca.logoUrl}
              alt={marca.name}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                const target = e.currentTarget;
                target.style.display = "none";

                const fallback = target.nextElementSibling as HTMLElement | null;
                if (fallback) fallback.style.display = "flex";
              }}
            />
          ) : null}

          <span
            className={`${
              marca.logoUrl ? "hidden" : "flex"
            } h-full w-full items-center justify-center text-5xl font-black text-brand-brown transition-transform duration-300 group-hover:scale-105`}
          >
            {marca.name.charAt(0)}
          </span>
        </div>

        <h3 className="mb-1 line-clamp-2 text-sm font-black leading-tight text-brand-navy sm:text-base">
          {marca.name}
        </h3>

        <p className="line-clamp-2 text-[11px] font-medium leading-snug text-gray-500 sm:text-xs md:line-clamp-3">
          {marca.description}
        </p>
      </a>
    </article>
  );
}

// ─────────────────────────────────────────────────────────────
// COMPONENTE: TARJETA DE PRODUCTO
// ─────────────────────────────────────────────────────────────
function ProductCard({ producto }: { producto: Producto }) {
  return (
    <a
      href={`/producto/${producto.slug}`}
      className="group flex h-full flex-col justify-between rounded-3xl border border-gray-100 bg-white p-3 shadow-sm transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-card active:scale-[0.98] sm:p-4 md:p-5"
    >
      <div className="relative mb-3 flex h-32 items-center justify-center overflow-hidden rounded-2xl bg-[#F5F5F7] sm:h-40 md:h-48">
        {producto.imageUrl ? (
          <img
            src={producto.imageUrl}
            alt={producto.name}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <span className="text-5xl drop-shadow-sm transition-transform duration-300 group-hover:scale-105 md:text-7xl">
            🏺
          </span>
        )}
      </div>

      <div className="flex flex-grow flex-col">
        <h3 className="mb-1 line-clamp-2 text-sm font-bold leading-tight text-brand-navy md:text-base">
          {producto.name}
        </h3>

        <p className="mb-3 text-[10px] font-bold uppercase tracking-wider text-gray-400 sm:text-xs">
          Marca Local
        </p>

        <div className="mt-auto flex items-center justify-between border-t border-gray-50 pt-3">
          <span className="text-lg font-black tracking-tight text-brand-brown md:text-xl">
            ${producto.price.toFixed(0)}
          </span>

          <button
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F5F5F7] text-brand-navy shadow-sm transition-colors duration-200 hover:bg-brand-brown hover:text-white focus:outline-none md:h-10 md:w-10"
            aria-label={`Agregar ${producto.name} al carrito`}
            onClick={(e) => {
              e.preventDefault();
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
// COMPONENTE: SKELETON
// ─────────────────────────────────────────────────────────────
function HomeSkeleton() {
  return (
    <div className="flex min-h-screen flex-col bg-[#F5F5F7] animate-pulse">
      <div className="h-[560px] w-full bg-gray-200 md:h-[60vh] md:min-h-[520px]" />

      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 md:px-8 md:py-16">
        <div className="mb-6 h-8 w-52 rounded-lg bg-gray-200 md:w-64" />

        <div className="mb-16 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4 md:gap-6 lg:gap-8">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="h-64 rounded-3xl bg-gray-200 md:h-72" />
          ))}
        </div>

        <div className="mx-auto mb-8 h-8 w-52 rounded-lg bg-gray-200 md:w-64" />

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
          {[1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="h-48 rounded-3xl bg-gray-200 md:h-56" />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// HOOK: detectar móvil
// ─────────────────────────────────────────────────────────────
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");

    const update = () => {
      setIsMobile(mediaQuery.matches);
    };

    update();

    mediaQuery.addEventListener("change", update);

    return () => {
      mediaQuery.removeEventListener("change", update);
    };
  }, []);

  return isMobile;
}

// ─────────────────────────────────────────────────────────────
// HOOK: reducir animaciones si el dispositivo lo pide
// ─────────────────────────────────────────────────────────────
function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const update = () => {
      setPrefersReducedMotion(mediaQuery.matches);
    };

    update();

    mediaQuery.addEventListener("change", update);

    return () => {
      mediaQuery.removeEventListener("change", update);
    };
  }, []);

  return prefersReducedMotion;
}

// ─────────────────────────────────────────────────────────────
// UTILIDAD: limpiar título del hero
// ─────────────────────────────────────────────────────────────
function cleanAyudadonTitle(title: string) {
  return title
    .replace(/¡\s*(Ayudad[oó]n)\s*!/gi, "$1")
    .replace(/¡/g, "")
    .replace(/!/g, "");
}

// ─────────────────────────────────────────────────────────────
// UTILIDAD: CHUNKS
// ─────────────────────────────────────────────────────────────
function chunkArray<T>(arr: T[], size: number): T[][] {
  if (arr.length === 0) return [];

  const result: T[][] = [];

  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }

  return result;
}