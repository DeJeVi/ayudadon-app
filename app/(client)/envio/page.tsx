"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function EnvioPage() {
  const router = useRouter();

  // =========================================================
  // ESTADOS (Formulario Visual)
  // =========================================================
  const [saveAddress, setSaveAddress] = useState(true);
  const [guardando, setGuardando] = useState(false);

  // =========================================================
  // DATOS DE MUESTRA (Mockup)
  // =========================================================
  const cartItems = [
    { id: 1, name: "Salsa Toluca", price: 250, qty: 1, icon: "🍲" },
    { id: 2, name: "Cazuela Barro Grande", price: 800, qty: 1, icon: "🥘" },
    { id: 3, name: "Jarrito de Barro", price: 750, qty: 1, icon: "🏺" },
    { id: 4, name: "Manta de Lana", price: 800, qty: 1, icon: "🧶" },
  ];

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const envio = 0; // Envío gratis simulado
  const total = subtotal + envio;

  // =========================================================
  // ANIMACIONES (Intersection Observer)
  // =========================================================
  const revealRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.remove('opacity-0', 'translate-y-16');
            entry.target.classList.add('opacity-100', 'translate-y-0');
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
  }, []);

  const addToRefs = (el: HTMLElement | null) => {
    if (el && !revealRefs.current.includes(el)) {
      revealRefs.current.push(el);
    }
  };

  // Redirección a TU vista de pago
  const handleContinuar = (e: React.FormEvent) => {
    e.preventDefault();
    setGuardando(true);
    setTimeout(() => {
      setGuardando(false);
      router.push('/pago'); // Te envía a tu propia página de pago
    }, 1000);
  };

  return (
    <div className="bg-[#F5F5F7] font-sans text-gray-800 selection:bg-brand-brown selection:text-white min-h-screen flex flex-col overflow-x-hidden">
      
      {/* =========================================================
          CONTENIDO PRINCIPAL (Sin Header ni Footer globales)
      ========================================================= */}
      <main className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-12 flex-grow w-full pb-20">
        
        {/* TÍTULO */}
        <div ref={addToRefs} className="flex flex-col items-center justify-center text-center mb-10 md:mb-12 opacity-0 translate-y-16 transition-all duration-700 ease-out">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-brand-navy tracking-tight">
                Datos de Envío
            </h1>
            <p className="text-gray-500 mt-3 font-medium text-sm md:text-base max-w-md mx-auto">
                Verifica tu dirección para continuar con el pago de forma segura.
            </p>
        </div>

        {/* BARRA DE PROGRESO */}
        <div ref={addToRefs} className="w-full bg-transparent p-2 mb-10 md:mb-14 opacity-0 translate-y-16 transition-all duration-700 ease-out delay-100">
            <div className="w-full relative px-2 max-w-4xl mx-auto">
                <div className="absolute bottom-0 left-0 w-full h-[3px] bg-gray-200 rounded-full"></div>
                <div className="absolute bottom-0 left-0 w-1/2 h-[3px] bg-brand-brown rounded-full transition-all duration-1000 ease-out"></div>

                <div className="flex justify-between items-end pb-4 text-[10px] sm:text-xs md:text-sm font-bold text-gray-400 relative z-10">
                    
                    {/* Paso 1 */}
                    <div className="flex flex-col items-center flex-1 text-brand-brown relative">
                        <span className="mb-2">1. Carrito</span>
                        <i className="fa-solid fa-circle-check absolute -bottom-[7px] text-white bg-brand-brown rounded-full text-base shadow-sm"></i>
                    </div>
                    
                    {/* Paso 2 (Activo) */}
                    <div className="flex flex-col items-center flex-1 text-brand-navy relative">
                        <span className="mb-2 text-sm md:text-base font-black">2. Envío</span>
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-[55%] w-12 sm:w-16 md:w-[70px] flex justify-center items-center z-20">
                            <img src="/images/PNG_Minim_Don.png" alt="Paso actual" className="w-full h-auto object-contain drop-shadow-md"/>
                        </div>
                    </div>
                    
                    {/* Paso 3 */}
                    <div className="flex flex-col items-center flex-1 relative">
                        <span className="mb-2">3. Pago</span>
                        <div className="absolute -bottom-[4px] w-2.5 h-2.5 bg-gray-300 rounded-full"></div>
                    </div>
                    {/* Paso 4 */}
                    <div className="flex flex-col items-center flex-1 relative">
                        <span className="mb-2 text-center">4. Confirmación</span>
                        <div className="absolute -bottom-[4px] w-2.5 h-2.5 bg-gray-300 rounded-full"></div>
                    </div>
                </div>
            </div>
        </div>

        {/* LAYOUT A 2 COLUMNAS */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
            
            {/* COLUMNA IZQUIERDA: FORMULARIO Y PRODUCTOS */}
            <div className="w-full lg:w-2/3 space-y-8">
                
                {/* TARJETA 1: DIRECCIÓN DE ENTREGA */}
                <div ref={addToRefs} className="bg-white rounded-[2rem] p-6 md:p-8 shadow-card border border-gray-100 opacity-0 translate-y-16 transition-all duration-700 delay-200">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                        <h2 className="text-xl md:text-2xl font-black text-brand-navy tracking-tight">
                            <i className="fa-solid fa-truck-fast mr-2 text-brand-brown"></i> Dirección de Entrega
                        </h2>
                    </div>

                    <form onSubmit={handleContinuar} className="space-y-4 sm:space-y-5" id="envio-form">
                        <div className="relative group">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 group-focus-within:text-brand-brown transition-colors">
                                <i className="fa-regular fa-user"></i>
                            </span>
                            <input required type="text" placeholder="Nombre Completo" className="w-full py-3.5 sm:py-4 pl-12 pr-4 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-brand-brown/50 text-brand-navy transition-all font-medium text-sm sm:text-base" />
                        </div>

                        <div className="relative group">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 group-focus-within:text-brand-brown transition-colors">
                                <i className="fa-solid fa-map-location-dot"></i>
                            </span>
                            <input required type="text" placeholder="Dirección (Calle, Número, Colonia)" className="w-full py-3.5 sm:py-4 pl-12 pr-4 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-brand-brown/50 text-brand-navy transition-all font-medium text-sm sm:text-base" />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
                            <div className="relative group sm:col-span-1">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 group-focus-within:text-brand-brown transition-colors">
                                    <i className="fa-solid fa-city"></i>
                                </span>
                                <input required type="text" placeholder="Ciudad" className="w-full py-3.5 sm:py-4 pl-12 pr-4 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-brand-brown/50 text-brand-navy transition-all font-medium text-sm sm:text-base" />
                            </div>
                            <div className="relative group sm:col-span-1">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 group-focus-within:text-brand-brown transition-colors">
                                    <i className="fa-solid fa-envelopes-bulk"></i>
                                </span>
                                <input required type="text" inputMode="numeric" placeholder="C.P." className="w-full py-3.5 sm:py-4 pl-12 pr-4 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-brand-brown/50 text-brand-navy transition-all font-medium text-sm sm:text-base" />
                            </div>
                            <div className="relative group sm:col-span-1">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 group-focus-within:text-brand-brown transition-colors">
                                    <i className="fa-solid fa-phone"></i>
                                </span>
                                <input required type="tel" placeholder="Teléfono" className="w-full py-3.5 sm:py-4 pl-12 pr-4 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-brand-brown/50 text-brand-navy transition-all font-medium text-sm sm:text-base" />
                            </div>
                        </div>

                        <div className="flex items-center justify-end mt-2 pt-5 border-t border-gray-100">
                            <label className="flex items-center cursor-pointer gap-3 group">
                                <span className="text-xs sm:text-sm font-bold text-gray-500 group-hover:text-brand-navy transition-colors">Guardar dirección para el futuro</span>
                                <div className="relative flex-shrink-0">
                                    <input type="checkbox" className="sr-only" checked={saveAddress} onChange={() => setSaveAddress(!saveAddress)} />
                                    <div className={`block w-11 sm:w-12 h-6 sm:h-7 rounded-full transition-colors duration-300 ease-in-out ${saveAddress ? 'bg-brand-brown' : 'bg-gray-200'}`}></div>
                                    <div className={`absolute left-1 top-1 bg-white w-4 sm:w-5 h-4 sm:h-5 rounded-full transition-transform duration-300 ease-in-out shadow-sm ${saveAddress ? 'translate-x-5' : ''}`}></div>
                                </div>
                            </label>
                        </div>
                    </form>
                </div>

                {/* TARJETA 2: RESUMEN DE PRODUCTOS */}
                <div ref={addToRefs} className="bg-transparent opacity-0 translate-y-16 transition-all duration-700 delay-300">
                    <h2 className="text-lg md:text-xl font-black text-brand-navy mb-4 tracking-tight px-1">
                        Tu pedido <span className="text-gray-400 text-base font-bold">({cartItems.length} artículos)</span>
                    </h2>
                    
                    <div className="flex overflow-x-auto gap-3 sm:gap-4 pb-4 scrollbar-hide snap-x">
                        {cartItems.map((item) => (
                            <div key={item.id} className="min-w-[140px] md:min-w-[160px] bg-white rounded-2xl p-3 shadow-card border border-gray-100 snap-start flex-shrink-0 group">
                                <div className="bg-[#F5F5F7] h-24 sm:h-28 rounded-xl flex items-center justify-center text-4xl sm:text-5xl mb-3 sm:mb-4 overflow-hidden">
                                    <span className="group-hover:scale-110 transition-transform duration-500 drop-shadow-sm">{item.icon}</span>
                                </div>
                                <div className="px-1 text-left">
                                    <h4 className="font-bold text-brand-navy text-xs sm:text-sm truncate mb-1">{item.name}</h4>
                                    <div className="flex justify-between items-center mt-1 sm:mt-2">
                                        <p className="text-gray-400 text-[10px] sm:text-xs font-bold">{item.qty}x</p>
                                        <p className="text-brand-brown font-black text-xs sm:text-sm">${item.price}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

            {/* =========================================================
                COLUMNA DERECHA: TOTAL Y PAGO (Sticky)
            ========================================================= */}
            <div className="w-full lg:w-1/3">
                <div ref={addToRefs} className="bg-white rounded-[2rem] p-6 md:p-8 shadow-card border border-gray-100 lg:sticky lg:top-28 opacity-0 translate-y-16 transition-all duration-700 delay-300">
                    
                    <h2 className="text-lg md:text-xl font-black text-brand-navy mb-5 md:mb-6 tracking-tight">Resumen de Costos</h2>
                    
                    <div className="space-y-3 md:space-y-4 mb-5 md:mb-6 text-sm text-gray-500 font-medium">
                        <div className="flex justify-between items-center">
                            <span>Subtotal</span>
                            <span className="text-brand-navy font-bold">MXN {subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span>Envío</span>
                            <span className="text-[#166534] bg-[#F0FDF4] border border-[#DCFCE7] px-2 py-0.5 rounded-full font-bold text-[10px] sm:text-xs uppercase tracking-wider">Gratis</span>
                        </div>
                    </div>

                    <div className="border-t border-gray-100 pt-5 md:pt-6 mb-6 md:mb-8">
                        <div className="flex justify-between items-end mb-1">
                            <span className="text-sm md:text-base font-bold text-gray-500 uppercase tracking-wider">Total a pagar</span>
                            <span className="text-2xl md:text-3xl font-black text-brand-navy tracking-tighter">MXN {total.toFixed(2)}</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <button 
                            type="submit"
                            form="envio-form"
                            disabled={guardando}
                            className="w-full bg-brand-navy hover:bg-brand-navyLight disabled:opacity-70 disabled:cursor-not-allowed text-white font-black h-12 sm:h-14 rounded-full shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all active:scale-95 text-base sm:text-lg flex items-center justify-center gap-2 sm:gap-3"
                        >
                            {guardando ? (
                                <><i className="fa-solid fa-circle-notch fa-spin"></i> Cargando...</>
                            ) : (
                                <><i className="fa-solid fa-lock text-lg sm:text-xl opacity-90"></i> Continuar al Pago</>
                            )}
                        </button>
                    </div>
                    
                    <div className="mt-5 md:mt-6 text-center">
                        <p className="text-[10px] sm:text-xs text-gray-400 font-medium px-2 sm:px-4 leading-relaxed">
                            Tus datos están protegidos. En el siguiente paso podrás elegir tu método de pago.
                        </p>
                        <div className="flex justify-center gap-3 sm:gap-4 mt-3 sm:mt-4 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300 text-xl sm:text-2xl text-brand-navy">
                            <i className="fa-brands fa-cc-visa"></i>
                            <i className="fa-brands fa-cc-mastercard"></i>
                            <i className="fa-brands fa-cc-amex"></i>
                        </div>
                    </div>

                </div>
            </div>
        </div>

      </main>

      {/* Estilos para ocultar scrollbars */}
      <style dangerouslySetInnerHTML={{__html: `
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
}