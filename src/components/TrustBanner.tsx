'use client';

import React, { useState, useEffect, useRef } from 'react';

/**
 * TrustBanner — Aparece justo ANTES del footer (entre el contenido y el footer),
 * con efecto de "emerger desde atrás" cuando el footer entra en el viewport.
 *
 * A diferencia de la versión anterior (fixed bottom-0 / overlay sobre toda la página),
 * este vive en el FLUJO NORMAL del documento: ocupa espacio real entre el contenido
 * y el Footer. Se anima con un colapso de altura + fade, simulando que "sale" desde
 * atrás del footer y se asienta en su posición final.
 *
 * Se activa observando el propio wrapper de este componente: cuando se acerca al
 * viewport (rootMargin negativo hacia arriba), se considera que el usuario "llegó
 * al final" y se dispara la animación.
 */
export default function TrustBanner() {
  const [visible, setVisible] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el); // una vez que aparece, se queda visible
        }
      },
      { threshold: 0, rootMargin: '0px 0px -10% 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const items = [
    { icon: 'fa-solid fa-truck', label: 'Seguridad en cada envío' },
    { icon: 'fa-solid fa-ban',   label: 'Cancelaciones antes de 24 horas' },
    { icon: 'fa-solid fa-lock',  label: 'Pagos seguros con MercadoPago' },
  ];

  return (
    <div
      ref={wrapperRef}
      className={`
        overflow-hidden transition-all duration-700 ease-out
        ${visible ? 'max-h-[200px] opacity-100' : 'max-h-0 opacity-0'}
      `}
    >
      <div
        className={`
          bg-[#d4a373] py-4 md:py-5 px-4
          shadow-[0_-10px_28px_-6px_rgba(0,0,0,0.22)]
          ${visible ? 'trust-bounce' : 'translate-y-full'}
        `}
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-center md:justify-around items-center gap-4 md:gap-6 text-center">
          {items.map((item, idx) => (
            <React.Fragment key={item.label}>
              <div className="flex items-center gap-2.5 text-amber-950 font-bold text-sm md:text-base hover:scale-105 transition-transform duration-200">
                <i className={`${item.icon} text-xl md:text-2xl text-amber-800`} aria-hidden="true" />
                <span>{item.label}</span>
              </div>
              {idx < items.length - 1 && (
                <div className="hidden sm:block w-px h-6 bg-amber-800/30" aria-hidden="true" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}