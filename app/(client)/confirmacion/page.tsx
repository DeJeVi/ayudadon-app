"use client";

import React, { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { getCarrito } from "@/lib/api";
import type { CartItem } from "@/types/api";

function ConfirmacionContent() {
  const searchParams = useSearchParams();
  const numeroOrden =
    searchParams.get("orden") ??
    `AYD-${Math.floor(100000 + Math.random() * 900000)}`;

  const [items, setItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const carrito = await getCarrito();
        setItems(carrito.items);
        setTotal(carrito.total);
      } catch (err) {
        console.error("Error cargando el resumen de la orden:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  useEffect(() => {
    if (!loading) {
      const t = setTimeout(() => setShowContent(true), 150);
      return () => clearTimeout(t);
    }
  }, [loading]);

  const fechaEstimada = new Date();
  fechaEstimada.setDate(fechaEstimada.getDate() + 3);

  const fechaFormateada = fechaEstimada.toLocaleDateString("es-MX", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  if (loading) return <ConfirmacionSkeleton />;

  return (
    <div className="bg-gradient-to-b from-brand-sky/15 via-[#F5F5F7] to-[#F5F5F7] font-sans text-gray-800 min-h-screen flex flex-col overflow-x-hidden relative">
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        aria-hidden="true"
      >
        <div className="absolute top-12 left-[8%] w-3 h-3 bg-brand-yellow rounded-full opacity-60 animate-confetti-1" />
        <div className="absolute top-20 right-[12%] w-2 h-2 bg-brand-brown rounded-full opacity-50 animate-confetti-2" />
        <div className="absolute top-32 left-[20%] w-2.5 h-2.5 bg-brand-sky rounded-full opacity-60 animate-confetti-3" />
        <div className="absolute top-8 right-[25%] w-2 h-2 bg-brand-navyLight rounded-full opacity-40 animate-confetti-1" />
        <div className="absolute top-24 left-[35%] w-1.5 h-1.5 bg-brand-yellow rounded-full opacity-50 animate-confetti-2" />
        <div className="absolute top-16 right-[8%] w-2 h-2 bg-brand-brown rounded-full opacity-40 animate-confetti-3" />
      </div>

      <main className="max-w-3xl mx-auto px-4 md:px-6 py-12 md:py-20 flex-grow w-full relative z-10">
        <div
          className={`flex flex-col items-center text-center mb-8 md:mb-10 transition-all duration-700 ease-out ${
            showContent
              ? "opacity-100 translate-y-0 scale-100"
              : "opacity-0 translate-y-8 scale-95"
          }`}
        >
          <div className="relative mb-6">
            <div
              className="absolute inset-0 bg-brand-yellow/30 rounded-full blur-2xl scale-110"
              aria-hidden="true"
            />

            <div className="relative w-32 h-32 sm:w-40 sm:h-40 flex items-center justify-center">
              <img
                src="/images/PNG_Don.png"
                alt="Mascota Ayudadón celebrando"
                className="w-full h-full object-contain drop-shadow-xl animate-celebrate-bounce"
              />

              <div className="absolute -bottom-1 -right-1 sm:bottom-0 sm:right-0 w-10 h-10 sm:w-12 sm:h-12 bg-emerald-500 rounded-full flex items-center justify-center border-4 border-white shadow-lg animate-check-pop">
                <i className="fa-solid fa-check text-white text-lg sm:text-xl"></i>
              </div>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-brand-navy tracking-tight mb-3">
            ¡Tu compra fue exitosa!
          </h1>

          <p className="text-gray-500 font-medium text-sm md:text-base max-w-md leading-relaxed">
            Gracias por apoyar a los emprendimientos locales. Tu pedido ya está
            en camino.
          </p>
        </div>

        <div
          className={`transition-all duration-700 ease-out delay-150 ${
            showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="bg-white rounded-[1.75rem] shadow-card border border-gray-100 p-5 md:p-6 mb-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                Número de orden
              </p>
              <p className="text-xl md:text-2xl font-black text-brand-navy tracking-tight">
                {numeroOrden}
              </p>
            </div>

            <button
              onClick={() => navigator.clipboard?.writeText(numeroOrden)}
              className="text-sm font-bold text-brand-brownDark hover:text-brand-brown bg-brand-brown/10 hover:bg-brand-brown/20 px-4 py-2 rounded-full transition-colors flex items-center gap-2"
            >
              <i className="fa-regular fa-copy"></i> Copiar
            </button>
          </div>
        </div>

        <div
          className={`transition-all duration-700 ease-out delay-300 ${
            showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="bg-white rounded-[1.75rem] shadow-card border border-gray-100 p-5 md:p-8 mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-5 tracking-tight">
              Resumen del pedido
            </h2>

            <div className="space-y-3 mb-5">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 text-sm">
                  <div className="w-12 h-12 bg-[#F5F5F7] rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <span className="text-xl">🏺</span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-800 truncate">
                      {item.name}
                    </p>
                    <p className="text-gray-400 text-xs">
                      Cant: {item.quantity}
                    </p>
                  </div>

                  <span className="font-bold text-gray-900 whitespace-nowrap">
                    MXN {(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-4 flex justify-between items-end">
              <span className="text-base font-bold text-gray-900">
                Total pagado
              </span>
              <span className="text-2xl md:text-3xl font-black text-brand-navy tracking-tighter">
                MXN {total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <div
          className={`transition-all duration-700 ease-out delay-[450ms] ${
            showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="bg-brand-navy rounded-[1.75rem] p-5 md:p-8 mb-8 text-white">
            <h2 className="text-lg font-bold mb-5 tracking-tight flex items-center gap-2">
              <i className="fa-solid fa-route text-brand-yellow"></i> ¿Qué
              sigue?
            </h2>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <i className="fa-solid fa-receipt text-brand-yellow text-sm"></i>
                </div>
                <div>
                  <p className="font-bold text-sm">Confirmación por correo</p>
                  <p className="text-white/60 text-xs leading-relaxed">
                    Te enviamos los detalles de tu compra y la factura.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <i className="fa-solid fa-box text-brand-yellow text-sm"></i>
                </div>
                <div>
                  <p className="font-bold text-sm">
                    El vendedor prepara tu pedido
                  </p>
                  <p className="text-white/60 text-xs leading-relaxed">
                    Cada producto se empaca directamente por el emprendimiento
                    local.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <i className="fa-solid fa-truck text-brand-yellow text-sm"></i>
                </div>
                <div>
                  <p className="font-bold text-sm">
                    Llega aproximadamente el {fechaFormateada}
                  </p>
                  <p className="text-white/60 text-xs leading-relaxed">
                    Te avisaremos en cuanto tu pedido esté en camino.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className={`flex flex-col sm:flex-row gap-3 transition-all duration-700 ease-out delay-[600ms] ${
            showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <a
            href="/"
            className="flex-1 bg-brand-brown hover:bg-brand-brownDark text-white font-black h-14 rounded-full shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all active:scale-[0.98] text-base flex items-center justify-center gap-2"
          >
            <i className="fa-solid fa-house"></i> Volver al inicio
          </a>

          <a
            href="/pedidos"
            className="flex-1 border-2 border-brand-navy text-brand-navy hover:bg-brand-navy hover:text-white font-black h-14 rounded-full transition-all active:scale-[0.98] text-base flex items-center justify-center gap-2"
          >
            <i className="fa-solid fa-list-check"></i> Ver mis pedidos
          </a>
        </div>
      </main>
    </div>
  );
}

export default function ConfirmacionPage() {
  return (
    <Suspense fallback={<ConfirmacionSkeleton />}>
      <ConfirmacionContent />
    </Suspense>
  );
}

function ConfirmacionSkeleton() {
  return (
    <div className="bg-[#F5F5F7] min-h-screen animate-pulse">
      <div className="max-w-3xl mx-auto px-4 md:px-6 py-12 md:py-20">
        <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-6" />
        <div className="h-10 w-80 bg-gray-200 rounded mx-auto mb-3" />
        <div className="h-4 w-64 bg-gray-200 rounded mx-auto mb-10" />
        <div className="h-20 bg-gray-200 rounded-[1.75rem] mb-6" />
        <div className="h-64 bg-gray-200 rounded-[1.75rem] mb-6" />
        <div className="h-48 bg-gray-200 rounded-[1.75rem]" />
      </div>
    </div>
  );
}