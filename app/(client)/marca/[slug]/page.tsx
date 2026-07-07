"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { getMarcaBySlug, getProductosByMarca, getHeroSlides } from "@/lib/api";
import type { Marca, Producto, HeroSlide } from "@/types/api";

export default function MarcaPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [marca, setMarca] = useState<Marca | null>(null);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [heroIndex, setHeroIndex] = useState(0);
  const totalHeroSlides = heroSlides.length || 1;

  const revealRefs = useRef<(HTMLElement | null)[]>([]);
  const prefersReducedMotion = usePrefersReducedMotion();

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
        console.error("Error cargando datos de la marca:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [slug]);

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
    }, 9000);

    return () => window.clearInterval(heroTimer);
  }, [loading, prefersReducedMotion, heroSlides.length, totalHeroSlides]);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.remove("opacity-0", "translate-y-6");
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
  }, [marca, productos.length, prefersReducedMotion]);

  const addToRefs = (el: HTMLElement | null) => {
    if (el && !revealRefs.current.includes(el)) {
      revealRefs.current.push(el);
    }
  };

  const revealClass = prefersReducedMotion
    ? "opacity-100 translate-y-0"
    : "opacity-0 translate-y-6 transition-[opacity,transform] duration-500 ease-out";

  if (loading) return <MarcaSkeleton />;

  if (notFound || !marca) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 text-center">
        <h1 className="mb-2 text-2xl font-black text-brand-navy">
          Marca no encontrada
        </h1>

        <p className="text-gray-500">
          No pudimos encontrar la marca que buscas.
        </p>

        <a
          href="/"
          className="mt-6 inline-block rounded-full bg-brand-brown px-6 py-3 font-bold text-white transition-colors hover:bg-brand-brownDark"
        >
          Volver al inicio
        </a>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-[#F5F5F7] font-sans text-gray-800 selection:bg-brand-brown selection:text-white">
      {/* BANNER / CARRUSEL MÁS PEQUEÑO */}
      <section className="group relative flex h-[190px] items-center overflow-hidden bg-gradient-to-br from-[#8fd3ec] via-brand-sky to-[#5fb3d4] sm:h-[215px] md:h-[250px]">
        <div
          className="pointer-events-none absolute -left-20 -top-20 h-56 w-56 rounded-full bg-white/10 blur-2xl"
          aria-hidden="true"
        />

        <div
          className="pointer-events-none absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-white/5 blur-3xl"
          aria-hidden="true"
        />

        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-white/5"
          aria-hidden="true"
        />

        <div
          className="relative z-[5] flex h-full w-full transition-transform duration-500 ease-out will-change-transform"
          style={{ transform: `translateX(-${heroIndex * 100}%)` }}
        >
          {heroSlides.map((slide, idx) => (
            <div
              key={slide.id}
              className="mx-auto flex h-full min-w-full max-w-7xl flex-shrink-0 items-center px-4 sm:px-6 md:px-8"
            >
              <div className="relative z-10 flex w-[62%] flex-col justify-center text-left text-white sm:w-[58%] md:w-[60%]">
                <h1
                  className="text-[1.35rem] font-black leading-[1.05] tracking-tight drop-shadow-md sm:text-3xl md:text-4xl lg:text-5xl"
                  dangerouslySetInnerHTML={{
                    __html: cleanAyudadonTitle(slide.title),
                  }}
                />

                {slide.hasButton && (
                  <div className="mt-3 sm:mt-4">
                    <a
                      href={slide.buttonHref || "#"}
                      className="inline-block rounded-full bg-brand-brown px-5 py-2 text-xs font-black text-white shadow-lg transition-[background-color,transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:bg-brand-brownDark hover:shadow-xl active:scale-95 sm:px-7 sm:py-2.5 sm:text-sm md:px-8 md:py-3 md:text-base"
                    >
                      {slide.buttonText}
                    </a>
                  </div>
                )}
              </div>

              <div className="pointer-events-none absolute bottom-0 right-2 z-[8] flex h-full w-[45%] items-end justify-end sm:right-6 md:right-10 md:w-[42%] lg:right-16">
                <img
                  src={slide.imageUrl}
                  alt="Mascota Ayudadón"
                  loading={idx === 0 ? "eager" : "lazy"}
                  decoding="async"
                  className="h-[95%] w-auto max-w-full object-contain object-bottom drop-shadow-2xl md:h-[105%]"
                />
              </div>
            </div>
          ))}
        </div>

        {totalHeroSlides > 1 && (
          <>
            <button
              onClick={() =>
                setHeroIndex(
                  (prev) => (prev - 1 + totalHeroSlides) % totalHeroSlides
                )
              }
              aria-label="Slide anterior"
              className="absolute left-2 top-1/2 z-[50] flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/70 text-brand-navy shadow-lg transition duration-200 hover:bg-white active:scale-95 md:left-5 md:h-10 md:w-10"
            >
              <i className="fa-solid fa-chevron-left text-sm md:text-base" />
            </button>

            <button
              onClick={() =>
                setHeroIndex((prev) => (prev + 1) % totalHeroSlides)
              }
              aria-label="Slide siguiente"
              className="absolute right-2 top-1/2 z-[50] flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/70 text-brand-navy shadow-lg transition duration-200 hover:bg-white active:scale-95 md:right-5 md:h-10 md:w-10"
            >
              <i className="fa-solid fa-chevron-right text-sm md:text-base" />
            </button>

            <div className="absolute right-3 top-3 z-[50] flex items-center gap-1.5 rounded-full bg-black/10 px-2 py-1.5 backdrop-blur-sm sm:right-6 sm:top-5 sm:gap-2 sm:px-2.5 sm:py-2 md:right-8 md:top-6">
  {heroSlides.map((slide, idx) => (
    <button
      key={slide.id}
      onClick={() => setHeroIndex(idx)}
      aria-label={`Ir al slide ${idx + 1}`}
      className={`h-1.5 rounded-full shadow-sm transition-all duration-200 sm:h-2 ${
        heroIndex === idx
          ? "w-6 bg-white sm:w-7"
          : "w-1.5 bg-white/60 hover:bg-white/90 sm:w-2"
      }`}
    />
  ))}
</div>
          </>
        )}
      </section>

      {/* CONTENIDO DE LA MARCA */}
      <main className="relative z-10 mx-auto -mt-8 w-full max-w-7xl flex-grow px-4 pb-12 sm:px-6 md:-mt-10 md:pb-16">
        {/* ENCABEZADO DE MARCA CON MÁS PROTAGONISMO */}
        <section
          ref={addToRefs}
          className={`mb-10 overflow-hidden rounded-[2rem] border border-gray-100 bg-white p-5 shadow-card sm:p-6 md:mb-12 md:p-8 ${revealClass}`}
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left md:gap-6">
              <div className="flex h-32 w-32 flex-shrink-0 items-center justify-center overflow-hidden rounded-[2rem] border-4 border-white bg-[#F5F5F7] shadow-md transition-transform duration-200 hover:scale-[1.02] sm:h-36 sm:w-36 md:h-44 md:w-44">
                {marca.logoUrl ? (
                  <img
                    src={marca.logoUrl}
                    alt={`Logo de ${marca.name}`}
                    loading="eager"
                    decoding="async"
                    className="h-full w-full object-contain p-4"
                    onError={(e) => {
                      const target = e.currentTarget;
                      target.style.display = "none";

                      const fallback =
                        target.nextElementSibling as HTMLElement | null;

                      if (fallback) fallback.style.display = "flex";
                    }}
                  />
                ) : null}

                <span
                  className={`${
                    marca.logoUrl ? "hidden" : "flex"
                  } h-full w-full items-center justify-center text-6xl font-black text-brand-brownDark`}
                  aria-hidden="true"
                >
                  {marca.name.charAt(0)}
                </span>
              </div>

              <div>
                <p className="mb-2 text-xs font-black uppercase tracking-[0.24em] text-brand-brown">
                  Marca local
                </p>

                <h1 className="mb-3 text-4xl font-black leading-none tracking-tight text-brand-navy sm:text-5xl md:text-6xl">
                  {marca.name}
                </h1>

                <p className="mx-auto max-w-2xl text-sm font-medium leading-relaxed text-gray-600 sm:mx-0 md:text-base">
                  {marca.description}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 border-t border-gray-100 pt-5 sm:gap-4 lg:w-[360px] lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
              <TrustItem
                icon="fa-solid fa-truck-fast"
                title="Envío"
                subtitle="local"
                variant="brown"
              />

              <TrustItem
                icon="fa-solid fa-handshake-angle"
                title="Apoyo"
                subtitle="comunitario"
                variant="brown"
              />

              <TrustItem
                icon="fa-regular fa-credit-card"
                title="Pagos"
                subtitle="seguros"
                variant="sky"
              />
            </div>
          </div>
        </section>

        {/* PRODUCTOS */}
        <section
          ref={addToRefs}
          className={`w-full ${revealClass}`}
        >
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between md:mb-8">
            <div>
              <h2 className="inline-block border-b-4 border-brand-brown pb-2 text-2xl font-black text-brand-navy md:text-3xl">
                Catálogo de Productos
              </h2>

              <p className="mt-2 text-sm font-medium text-gray-500">
                Productos disponibles de {marca.name}.
              </p>
            </div>

            <span className="text-sm font-bold text-brand-brown">
              {productos.length} producto{productos.length === 1 ? "" : "s"}
            </span>
          </div>

          {productos.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-gray-300 bg-white px-6 py-14 text-center">
              <p className="font-bold text-brand-navy">
                Esta marca aún no tiene productos publicados.
              </p>

              <p className="mt-2 text-sm text-gray-500">
                Cuando agregues productos, aparecerán aquí.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
              {productos.map((prod) => (
                <ProductCard key={prod.id} producto={prod} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function TrustItem({
  icon,
  title,
  subtitle,
  variant,
}: {
  icon: string;
  title: string;
  subtitle: string;
  variant: "brown" | "sky";
}) {
  const iconClass =
    variant === "brown"
      ? "bg-brand-brown/10 text-brand-brown group-hover:bg-brand-brown group-hover:text-white"
      : "bg-brand-sky/20 text-brand-navyLight group-hover:bg-brand-sky group-hover:text-white";

  return (
    <div className="group flex flex-col items-center rounded-2xl bg-gray-50 px-2 py-4 text-center transition-colors duration-200 hover:bg-white">
      <div
        className={`mb-2 flex h-11 w-11 items-center justify-center rounded-full transition-colors duration-200 ${iconClass}`}
      >
        <i className={`${icon} text-lg`} />
      </div>

      <span className="text-xs font-black leading-tight text-brand-navy sm:text-sm">
        {title}
        <br />
        {subtitle}
      </span>
    </div>
  );
}

function ProductCard({ producto }: { producto: Producto }) {
  return (
    <a
      href={`/producto/${producto.slug}`}
      className="group/card flex h-full flex-col justify-between rounded-3xl border border-gray-100 bg-white p-3 shadow-sm transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-card active:scale-[0.98] sm:p-4"
    >
      <div className="mb-3 flex h-28 items-center justify-center overflow-hidden rounded-2xl bg-gray-50 sm:h-36 md:h-40">
        {producto.imageUrl ? (
          <img
            src={producto.imageUrl}
            alt={producto.name}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-contain p-2 transition-transform duration-300 group-hover/card:scale-105"
          />
        ) : (
          <span className="text-4xl transition-transform duration-300 group-hover/card:scale-105 md:text-5xl">
            🏺
          </span>
        )}
      </div>

      <div className="mt-auto">
        <h3 className="mb-2 line-clamp-2 text-sm font-bold leading-tight text-gray-800 md:text-base">
          {producto.name}
        </h3>

        <div className="mt-2 flex items-center justify-between gap-2">
          <span className="text-sm font-black text-brand-brownDark sm:text-base md:text-lg">
            MXN {producto.price.toFixed(0)}
          </span>

          <button
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-600 transition-colors duration-200 hover:bg-brand-brown hover:text-white active:scale-95 md:h-10 md:w-10"
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

function MarcaSkeleton() {
  return (
    <div className="min-h-screen bg-[#F5F5F7] animate-pulse">
      <div className="h-[190px] bg-gray-200 sm:h-[215px] md:h-[250px]" />

      <div className="mx-auto -mt-8 w-full max-w-7xl px-4 pb-12 sm:px-6 md:-mt-10">
        <div className="mb-10 rounded-[2rem] border border-gray-100 bg-white p-5 shadow-card sm:p-6 md:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="h-32 w-32 rounded-[2rem] bg-gray-200 sm:h-36 sm:w-36 md:h-44 md:w-44" />

            <div className="flex-1">
              <div className="mb-3 h-5 w-32 rounded bg-gray-200" />
              <div className="mb-4 h-10 w-64 rounded bg-gray-200" />
              <div className="h-4 w-full max-w-xl rounded bg-gray-200" />
            </div>
          </div>
        </div>

        <div className="mb-6 h-8 w-64 rounded bg-gray-200" />

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
          {[1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="h-52 rounded-3xl bg-gray-200" />
          ))}
        </div>
      </div>
    </div>
  );
}

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

function cleanAyudadonTitle(title: string) {
  return title
    .replace(/¡\s*(Ayudad[oó]n)\s*!/gi, "$1")
    .replace(/¡/g, "")
    .replace(/!/g, "");
}