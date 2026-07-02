"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { getCarrito, getDireccionGuardada, procesarPago } from '@/lib/api';
import type { CartItem, DireccionEnvio } from '@/types/api';

export default function PagoPage() {
  const router = useRouter();

  // =========================================================
  // DATOS — desde la capa lib/api.ts
  // =========================================================
  const [items, setItems] = useState<CartItem[]>([]);
  const [subtotal, setSubtotal] = useState(0);
  const [envio, setEnvio] = useState(0);
  const [total, setTotal] = useState(0);
  const [direccion, setDireccion] = useState<DireccionEnvio | null>(null);
  const [loading, setLoading] = useState(true);

  // =========================================================
  // FORMULARIO DE TARJETA
  // =========================================================
  const [numeroTarjeta, setNumeroTarjeta] = useState('');
  const [vencimiento, setVencimiento] = useState('');
  const [cvc, setCvc] = useState('');
  const [titular, setTitular] = useState('');
  const [procesando, setProcesando] = useState(false);
  const [errorPago, setErrorPago] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const [carritoData, direccionData] = await Promise.all([
          getCarrito(),
          getDireccionGuardada(),
        ]);
        setItems(carritoData.items);
        setSubtotal(carritoData.subtotal);
        setEnvio(carritoData.envio);
        setTotal(carritoData.total);
        setDireccion(direccionData);
      } catch (err) {
        console.error('Error cargando datos de pago:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Animaciones reveal
  const revealRefs = useRef<(HTMLElement | null)[]>([]);
  useEffect(() => {
    if (loading) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.remove('opacity-0', 'translate-y-12', 'scale-95');
            entry.target.classList.add('opacity-100', 'translate-y-0', 'scale-100');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -50px 0px" }
    );
    revealRefs.current.forEach((el) => { if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, [loading]);

  const addToRefs = (el: HTMLElement | null) => {
    if (el && !revealRefs.current.includes(el)) revealRefs.current.push(el);
  };

  // =========================================================
  // FORMATEO DE INPUTS DE TARJETA
  // =========================================================
  const handleNumeroTarjeta = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = digits.replace(/(\d{4})(?=\d)/g, '$1 ');
    setNumeroTarjeta(formatted);
  };

  const handleVencimiento = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 4);
    const formatted = digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
    setVencimiento(formatted);
  };

  const handleCvc = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCvc(e.target.value.replace(/\D/g, '').slice(0, 4));
  };

  const handleSubmitPago = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorPago('');

    if (numeroTarjeta.replace(/\s/g, '').length < 15) {
      setErrorPago('Verifica el número de tu tarjeta.');
      return;
    }
    if (vencimiento.length < 5) {
      setErrorPago('Verifica la fecha de vencimiento.');
      return;
    }
    if (cvc.length < 3) {
      setErrorPago('Verifica el código CVC.');
      return;
    }
    if (!titular.trim()) {
      setErrorPago('Ingresa el nombre del titular de la tarjeta.');
      return;
    }

    setProcesando(true);
    try {
      const resultado = await procesarPago({ numeroTarjeta, vencimiento, cvc, titular });
      if (resultado.success) {
        router.push(`/confirmacion?orden=${resultado.numeroOrden}`);
      } else {
        setErrorPago('No pudimos procesar tu pago. Intenta de nuevo.');
      }
    } catch (err) {
      console.error('Error al procesar el pago:', err);
      setErrorPago('Ocurrió un error inesperado. Intenta de nuevo.');
    } finally {
      setProcesando(false);
    }
  };

  if (loading) return <PagoSkeleton />;

  return (
    <div className="bg-[#F5F5F7] font-sans text-gray-800 selection:bg-brand-yellow selection:text-amber-950 min-h-screen flex flex-col overflow-x-hidden">

      <main className="max-w-5xl mx-auto px-4 md:px-6 py-12 md:py-20 flex-grow w-full pb-24">

        {/* TÍTULO */}
        <div ref={addToRefs} className="flex flex-col items-center justify-center text-center mb-12 md:mb-16 opacity-0 translate-y-12 transition-all duration-[800ms] ease-out">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-brand-brownDark drop-shadow-sm">
                Realiza tu pago
            </h1>
            <p className="text-gray-500 mt-4 font-medium text-sm md:text-base max-w-lg mx-auto leading-relaxed">
                Ingresa los datos de tu tarjeta. La transacción se procesa de forma encriptada bajo los estándares de seguridad de Mercado Pago.
            </p>
        </div>

        {/* BARRA DE PROGRESO */}
        <div ref={addToRefs} className="w-full bg-transparent p-2 mb-12 md:mb-16 opacity-0 translate-y-12 transition-all duration-[800ms] ease-out delay-100">
            <div className="w-full relative px-2 max-w-3xl mx-auto">
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gray-200"></div>
                <div className="absolute bottom-0 left-0 w-3/4 h-[3px] bg-brand-brownDark rounded-full transition-all duration-1000 ease-out translate-y-[0.5px]"></div>

                <div className="flex justify-between items-end pb-4 text-xs sm:text-sm md:text-base font-bold text-gray-400 relative z-10 tracking-tight">

                    <div className="flex flex-col items-center flex-1 text-brand-brownDark">
                        <span className="mb-2">1. Carrito</span>
                        <i className="fa-solid fa-circle-check absolute -bottom-[7px] text-white bg-brand-brownDark rounded-full text-sm shadow-sm"></i>
                    </div>

                    <div className="flex flex-col items-center flex-1 text-brand-brownDark relative">
                        <span className="mb-2">2. Envío</span>
                        <i className="fa-solid fa-circle-check absolute -bottom-[7px] text-white bg-brand-brownDark rounded-full text-sm shadow-sm"></i>
                    </div>

                    <div className="flex flex-col items-center flex-1 text-gray-900 relative">
                        <span className="mb-2 text-base md:text-lg">3. Pago</span>
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-[55%] w-12 sm:w-16 md:w-[70px] flex justify-center items-center z-20">
                            <img
                                src="/images/PNG_Minim_Don.png"
                                alt="Paso actual"
                                className="w-full h-auto object-contain drop-shadow-md"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col items-center flex-1">
                        <span className="mb-2 text-center">4. Confirmación</span>
                        <div className="absolute -bottom-[4px] w-2.5 h-2.5 bg-gray-300 rounded-full"></div>
                    </div>
                </div>
            </div>
        </div>

        <form onSubmit={handleSubmitPago} className="flex flex-col lg:flex-row gap-6 lg:gap-10">

            {/* COLUMNA IZQUIERDA */}
            <div className="w-full lg:w-3/5 space-y-6">

                {/* DATOS DE ENTREGA */}
                <div ref={addToRefs} className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white opacity-0 translate-y-12 transition-all duration-[800ms] delay-200">
                    <div className="flex items-start justify-between">
                        <div className="flex gap-4 md:gap-5">
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-[#F5F5F7] rounded-full flex items-center justify-center text-gray-400 flex-shrink-0">
                                <i className="fa-solid fa-location-dot text-lg"></i>
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-gray-900 tracking-tight mb-1">
                                    Enviar a {direccion?.nombreCompleto ?? 'tu domicilio'}
                                </h2>
                                <p className="text-gray-500 text-sm leading-relaxed">
                                    {direccion ? (
                                      <>
                                        {direccion.calle}<br/>
                                        {direccion.ciudad}, Estado de México, C.P. {direccion.codigoPostal}<br/>
                                        Tel: {direccion.telefono}
                                      </>
                                    ) : 'No tienes una dirección guardada todavía.'}
                                </p>
                            </div>
                        </div>
                        <a href="/envio" className="text-sm font-bold text-[#009EE3] hover:text-blue-800 transition-colors pt-1">
                            Editar
                        </a>
                    </div>
                </div>

                {/* FORMULARIO DE TARJETA */}
                <div ref={addToRefs} className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white opacity-0 translate-y-12 transition-all duration-[800ms] delay-300">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3 md:gap-4">
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-[#F5F5F7] rounded-full flex items-center justify-center text-gray-400 flex-shrink-0">
                                <i className="fa-regular fa-credit-card text-lg"></i>
                            </div>
                            <h2 className="text-lg font-bold text-gray-900 tracking-tight">
                                Datos de la tarjeta
                            </h2>
                        </div>
                        <div className="flex gap-2 text-2xl opacity-40 grayscale">
                            <i className="fa-brands fa-cc-visa"></i>
                            <i className="fa-brands fa-cc-mastercard"></i>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="relative group">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 group-focus-within:text-[#009EE3] transition-colors">
                                <i className="fa-regular fa-credit-card"></i>
                            </span>
                            <input
                                type="text"
                                inputMode="numeric"
                                placeholder="Número de la tarjeta"
                                value={numeroTarjeta}
                                onChange={handleNumeroTarjeta}
                                required
                                className="w-full py-4 pl-12 pr-4 bg-[#F8F9FA] border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#009EE3]/30 focus:border-[#009EE3]/50 text-gray-800 transition-all font-medium"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="relative group">
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    placeholder="Vencimiento (MM/AA)"
                                    value={vencimiento}
                                    onChange={handleVencimiento}
                                    required
                                    className="w-full py-4 px-5 bg-[#F8F9FA] border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#009EE3]/30 focus:border-[#009EE3]/50 text-gray-800 transition-all font-medium text-center md:text-left"
                                />
                            </div>
                            <div className="relative group">
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    placeholder="CVC"
                                    value={cvc}
                                    onChange={handleCvc}
                                    required
                                    className="w-full py-4 px-5 bg-[#F8F9FA] border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#009EE3]/30 focus:border-[#009EE3]/50 text-gray-800 transition-all font-medium text-center md:text-left"
                                />
                            </div>
                        </div>

                        <div className="relative group">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 group-focus-within:text-[#009EE3] transition-colors">
                                <i className="fa-regular fa-user"></i>
                            </span>
                            <input
                                type="text"
                                placeholder="Nombre completo del titular"
                                value={titular}
                                onChange={(e) => setTitular(e.target.value)}
                                required
                                className="w-full py-4 pl-12 pr-4 bg-[#F8F9FA] border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#009EE3]/30 focus:border-[#009EE3]/50 text-gray-800 transition-all font-medium"
                            />
                        </div>

                        {errorPago && (
                          <p className="text-red-500 text-sm font-bold text-center pt-1">{errorPago}</p>
                        )}
                    </div>

                    <div className="mt-6 pt-5 border-t border-gray-100 flex items-center justify-center gap-2 text-xs text-gray-500">
                        <i className="fa-solid fa-shield-check text-[#009EE3] text-sm"></i>
                        <span>Pagos procesados de forma segura por <strong>Mercado Pago</strong></span>
                    </div>
                </div>

            </div>

            {/* COLUMNA DERECHA: RESUMEN */}
            <div className="w-full lg:w-2/5">
                <div ref={addToRefs} className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-6 md:p-8 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border border-white lg:sticky lg:top-28 opacity-0 translate-y-12 transition-all duration-[800ms] delay-400">

                    <h2 className="text-xl font-bold text-gray-900 mb-6 tracking-tight">Resumen</h2>

                    <div className="space-y-3 mb-6 max-h-48 overflow-y-auto pr-1">
                      {items.map((item) => (
                        <div key={item.id} className="flex items-center gap-3 text-sm">
                          <div className="w-12 h-12 bg-[#F5F5F7] rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                            {item.imageUrl ? (
                              <img src={item.imageUrl} alt={item.name} className="w-full h-full object-contain" />
                            ) : (
                              <span className="text-xl">🏺</span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-gray-800 truncate">{item.name}</p>
                            <p className="text-gray-400 text-xs">Cant: {item.quantity}</p>
                          </div>
                          <span className="font-bold text-gray-900 whitespace-nowrap">MXN {(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-4 mb-6 text-sm text-gray-500 border-t border-gray-100 pt-4">
                        <div className="flex justify-between items-center">
                            <span>Artículos ({items.reduce((acc, i) => acc + i.quantity, 0)})</span>
                            <span className="text-gray-900 font-medium">MXN {subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span>Envío</span>
                            <span className="text-gray-900 font-medium">{envio === 0 ? 'Gratis' : `MXN ${envio.toFixed(2)}`}</span>
                        </div>
                    </div>

                    <div className="border-t border-gray-100 pt-6 mb-8">
                        <div className="flex justify-between items-end mb-1">
                            <span className="text-base font-bold text-gray-900">Total</span>
                            <span className="text-3xl font-black text-gray-900 tracking-tighter">MXN {total.toFixed(2)}</span>
                        </div>
                    </div>

                    <button
                      type="submit"
                      disabled={procesando}
                      className="w-full bg-[#009EE3] hover:bg-[#008ACB] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold h-14 rounded-full shadow-[0_8px_20px_-6px_rgba(0,158,227,0.5)] hover:shadow-[0_12px_24px_-6px_rgba(0,158,227,0.6)] hover:-translate-y-0.5 transition-all active:scale-[0.98] text-lg flex items-center justify-center gap-2"
                    >
                        {procesando ? (
                          <>
                            <i className="fa-solid fa-circle-notch fa-spin"></i> Procesando...
                          </>
                        ) : (
                          `Pagar MXN ${total.toFixed(2)}`
                        )}
                    </button>

                    <div className="mt-6 flex flex-col items-center text-center gap-3">
                        <p className="text-[11px] text-gray-400 font-medium px-2 leading-relaxed">
                            Al hacer clic en "Pagar", aceptas los Términos y Condiciones. Tu información está protegida.
                        </p>
                    </div>

                </div>
            </div>
        </form>

      </main>

    </div>
  );
}

function PagoSkeleton() {
  return (
    <div className="bg-[#F5F5F7] min-h-screen animate-pulse">
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-12 md:py-20">
        <div className="h-10 w-72 bg-gray-200 rounded mx-auto mb-4" />
        <div className="h-4 w-96 bg-gray-200 rounded mx-auto mb-16" />
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
          <div className="w-full lg:w-3/5 space-y-6">
            <div className="h-28 bg-gray-200 rounded-[2rem]" />
            <div className="h-80 bg-gray-200 rounded-[2rem]" />
          </div>
          <div className="w-full lg:w-2/5">
            <div className="h-96 bg-gray-200 rounded-[2rem]" />
          </div>
        </div>
      </div>
    </div>
  );
}