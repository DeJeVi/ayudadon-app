'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-500 py-3 px-4 md:px-6 ${
        scrolled ? 'bg-transparent' : 'bg-white/90 backdrop-blur-md shadow-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-[auto_1fr_auto] items-center gap-2 sm:gap-3 md:gap-6">

        {/* ── LOGO — el único elemento visible al hacer scroll, vidrio muy sutil ── */}
        <Link
          href="/"
          className={`flex items-center gap-1.5 sm:gap-2 font-black select-none transition-all duration-500 whitespace-nowrap ${
            scrolled
              ? 'text-sm sm:text-base md:text-xl px-2.5 sm:px-3 py-1.5 rounded-full bg-white/25 backdrop-blur-md backdrop-saturate-150 border border-white/20 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06)] hover:bg-white/45 hover:scale-105'
              : 'text-xl sm:text-2xl md:text-3xl text-gray-900 hover:scale-105'
          }`}
        >
          Ayudadón
          <img
            src="/images/PNG_Minim_Don.png"
            alt="Logo Ayudadón"
            className={`h-auto drop-shadow-sm transition-all duration-500 ${scrolled ? 'w-4 sm:w-5 md:w-7' : 'w-7 sm:w-10'}`}
          />
        </Link>

        {/* ── BÚSQUEDA — se oculta por completo (opacity-0 + pointer-events-none) al hacer scroll ── */}
        <div
          className={`min-w-0 transition-all duration-400 ${
            scrolled ? 'opacity-0 pointer-events-none -translate-y-2' : 'opacity-100 translate-y-0'
          }`}
        >
          <div className="relative group">
            <span className="absolute inset-y-0 left-0 flex items-center pl-2.5 sm:pl-3.5 text-gray-400 group-focus-within:text-[#a0714a] transition-colors">
              <i className="fa-solid fa-magnifying-glass text-xs sm:text-sm" aria-hidden="true" />
            </span>
            <input
              type="search"
              placeholder="Buscar"
              aria-label="Buscador"
              tabIndex={scrolled ? -1 : 0}
              className="w-full py-2 sm:py-2.5 pl-8 sm:pl-10 pr-2 sm:pr-4 rounded-full bg-white/80 backdrop-blur-sm border border-gray-200 shadow-[inset_0_1px_3px_rgba(0,0,0,0.06)] focus:bg-white focus:outline-none focus:border-[#a0714a] focus:ring-2 focus:ring-[#d4a373]/20 text-xs sm:text-sm md:text-base text-gray-800 placeholder:text-gray-400 transition-all duration-200"
            />
          </div>
        </div>

        {/* ── ÍCONOS — se ocultan por completo al hacer scroll ── */}
        <div
          className={`flex items-center gap-2.5 sm:gap-4 md:gap-6 whitespace-nowrap text-gray-700 transition-all duration-400 ${
            scrolled ? 'opacity-0 pointer-events-none -translate-y-2' : 'opacity-100 translate-y-0'
          }`}
        >

          <div className="hidden lg:flex flex-col items-end leading-tight cursor-pointer hover:text-[#a0714a] transition-colors text-gray-400">
            <span className="font-medium uppercase tracking-wider text-[10px]">Enviar a</span>
            <span className="font-bold text-sm text-[#a0714a]">
              <i className="fa-solid fa-location-dot mr-1" aria-hidden="true" />
              CP: 55614 Zumpango
            </span>
          </div>

          <div className="hidden lg:block w-px h-6 bg-gray-200" aria-hidden="true" />

          <Link
            href="/login"
            aria-label="Mi cuenta"
            tabIndex={scrolled ? -1 : 0}
            className="text-xl md:text-2xl hover:text-[#a0714a] hover:scale-110 transition-all duration-200"
          >
            <i className="fa-regular fa-user" aria-hidden="true" />
          </Link>

          <Link
            href="/carrito"
            aria-label="Carrito de compras"
            tabIndex={scrolled ? -1 : 0}
            className="relative text-xl md:text-2xl hover:text-[#a0714a] hover:scale-110 transition-all duration-200"
          >
            <i className="fa-solid fa-cart-shopping" aria-hidden="true" />
            <span className="absolute -top-1.5 -right-2 min-w-[18px] h-[18px] px-1 bg-[#ffba08] text-amber-900 text-[10px] font-black rounded-full flex items-center justify-center leading-none">
              0
            </span>
          </Link>

        </div>
      </div>
    </header>
  );
}