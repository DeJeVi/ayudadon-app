"use client";

import React, { useState, useEffect } from 'react';
import { getCarrito, updateCantidadCarrito, eliminarDelCarrito } from '@/lib/api';
import type { CartItem } from '@/types/api';

export default function CarritoPage() {
  // =========================================================
  // DATOS — desde la capa lib/api.ts
  // =========================================================
  const [items, setItems] = useState<CartItem[]>([]);
  const [subtotal, setSubtotal] = useState(0);
  const [envio, setEnvio] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [mutating, setMutating] = useState<string | null>(null); // id del item que se está actualizando, para deshabilitar sus controles

  useEffect(() => {
    async function loadData() {
      try {
        const carrito = await getCarrito();
        setItems(carrito.items);
        setSubtotal(carrito.subtotal);
        setEnvio(carrito.envio);
        setTotal(carrito.total);
      } catch (err) {
        console.error('Error cargando el carrito:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const totalArticulos = items.reduce((acc, item) => acc + item.quantity, 0);

  // =========================================================
  // ACCIONES DEL CARRITO — todas pasan por la capa de datos real
  // =========================================================
  const handleUpdateQty = async (itemId: string, delta: number) => {
    const item = items.find((i) => i.id === itemId);
    if (!item) return;
    const nuevaCantidad = Math.max(1, item.quantity + delta);

    setMutating(itemId);
    try {
      const carrito = await updateCantidadCarrito(itemId, nuevaCantidad);
      setItems(carrito.items);
      setSubtotal(carrito.subtotal);
      setEnvio(carrito.envio);
      setTotal(carrito.total);
    } catch (err) {
      console.error('Error al actualizar la cantidad:', err);
    } finally {
      setMutating(null);
    }
  };

  const handleRemove = async (itemId: string) => {
    setMutating(itemId);
    try {
      const carrito = await eliminarDelCarrito(itemId);
      setItems(carrito.items);
      setSubtotal(carrito.subtotal);
      setEnvio(carrito.envio);
      setTotal(carrito.total);
    } catch (err) {
      console.error('Error al eliminar el producto:', err);
    } finally {
      setMutating(null);
    }
  };

  if (loading) return <CarritoSkeleton />;

  return (
    <div className="bg-gray-50 font-sans text-gray-800 selection:bg-brand-brown selection:text-white min-h-screen flex flex-col overflow-x-hidden">

      <main className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-12 flex-grow w-full">

        <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-8 text-center md:text-left">Tu carrito</h1>

        {/* BARRA DE PROGRESO */}
        <div className="w-full relative mb-16 mt-4 px-2">
            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gray-200"></div>
            <div className="absolute bottom-0 left-0 w-1/4 h-[4px] bg-brand-brown rounded-full transition-all duration-500 translate-y-[1px]"></div>

            <div className="flex justify-between items-end pb-4 text-xs sm:text-sm md:text-lg font-bold text-gray-400 relative z-10">

                <div className="flex flex-col items-center flex-1 text-gray-900 relative">
                    <span className="mb-2">1. Carrito</span>
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-[60%] w-12 sm:w-16 md:w-20 flex justify-center items-center z-20">
                        <img
                            src="/images/PNG_Minim_Don.png"
                            alt="Paso actual"
                            className="w-full h-auto object-contain drop-shadow-md"
                        />
                    </div>
                </div>

                <div className="flex flex-col items-center flex-1">
                    <span className="mb-2">2. Envío</span>
                </div>
                <div className="flex flex-col items-center flex-1">
                    <span className="mb-2">3. Pago</span>
                </div>
                <div className="flex flex-col items-center flex-1">
                    <span className="mb-2 text-center">4. Confirmación</span>
                </div>
            </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">

            {/* LISTA DE PRODUCTOS */}
            <div className="w-full lg:w-2/3">
                <div className="bg-white rounded-3xl p-4 md:p-6 shadow-card border border-gray-100 flex flex-col gap-4 md:gap-6">

                    {items.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            <i className="fa-solid fa-cart-arrow-down text-6xl mb-4 text-gray-300"></i>
                            <h3 className="text-xl font-bold">Tu carrito está vacío</h3>
                            <p className="mt-2">¡Explora nuestras marcas y encuentra lo que necesitas!</p>
                            <a href="/" className="mt-6 inline-block bg-brand-brown text-white px-8 py-3 rounded-full font-bold hover:bg-brand-brownDark transition-colors">
                              Volver a la tienda
                            </a>
                        </div>
                    ) : (
                        items.map((item, index) => (
                            <div key={item.id}>
                                <div className={`flex flex-col sm:flex-row items-center gap-4 sm:gap-6 group transition-opacity duration-200 ${mutating === item.id ? 'opacity-50' : ''}`}>

                                    {/* Imagen del producto */}
                                    <div className="w-full sm:w-32 h-32 bg-gray-50 rounded-2xl border border-gray-100 flex flex-shrink-0 items-center justify-center overflow-hidden group-hover:scale-105 transition-transform duration-300">
                                        {item.imageUrl ? (
                                          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-contain" />
                                        ) : (
                                          <span className="text-5xl md:text-6xl">🏺</span>
                                        )}
                                    </div>

                                    {/* Info del Producto */}
                                    <div className="flex-1 w-full text-center sm:text-left">
                                        <h3 className="text-lg md:text-xl font-bold text-gray-900">{item.name}</h3>
                                        <p className="text-emerald-700 font-black text-lg md:text-xl mt-1">MXN {item.price.toFixed(2)}</p>
                                    </div>

                                    {/* Controles de Cantidad y Eliminar */}
                                    <div className="flex items-center gap-6 sm:gap-8 w-full sm:w-auto justify-center sm:justify-end mt-4 sm:mt-0">

                                        <div className="flex items-center border border-gray-200 rounded-full bg-gray-50 h-10 md:h-12 px-1">
                                            <button
                                              onClick={() => handleUpdateQty(item.id, -1)}
                                              disabled={mutating === item.id}
                                              aria-label={`Disminuir cantidad de ${item.name}`}
                                              className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center text-gray-500 hover:bg-gray-200 hover:text-black rounded-full transition-colors font-bold text-xl disabled:opacity-50"
                                            >-</button>
                                            <span className="w-8 text-center font-bold text-gray-900 text-base md:text-lg">{item.quantity}</span>
                                            <button
                                              onClick={() => handleUpdateQty(item.id, 1)}
                                              disabled={mutating === item.id}
                                              aria-label={`Aumentar cantidad de ${item.name}`}
                                              className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center text-gray-500 hover:bg-gray-200 hover:text-black rounded-full transition-colors font-bold text-xl disabled:opacity-50"
                                            >+</button>
                                        </div>

                                        <button
                                          onClick={() => handleRemove(item.id)}
                                          disabled={mutating === item.id}
                                          aria-label={`Eliminar ${item.name} del carrito`}
                                          className="flex items-center gap-2 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
                                        >
                                            <span className="hidden sm:inline text-sm font-medium">Eliminar</span>
                                            <i className="fa-regular fa-trash-can text-xl"></i>
                                        </button>
                                    </div>
                                </div>
                                {index < items.length - 1 && <hr className="mt-4 md:mt-6 border-gray-100" />}
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* RESUMEN DEL PEDIDO */}
            <div className="w-full lg:w-1/3">
                <div className="bg-gray-100 rounded-[2rem] p-6 md:p-8 shadow-inner border border-gray-200 lg:sticky lg:top-24">

                    <h2 className="text-xl md:text-2xl font-black text-gray-900 mb-6 border-b border-gray-300 pb-4">Resumen del pedido</h2>

                    <div className="flex justify-between items-end mb-2">
                        <span className="font-bold text-gray-700">Subtotal</span>
                        <span className="font-bold text-gray-900">MXN {subtotal.toFixed(2)}</span>
                    </div>
                    <p className="text-xs text-gray-500 mb-4">{totalArticulos} artículo(s)</p>

                    <div className="flex justify-between items-center mb-2">
                        <span className="font-bold text-gray-700">Envío</span>
                        <span className="font-bold text-gray-900">{envio === 0 ? 'Gratis' : `MXN ${envio.toFixed(2)}`}</span>
                    </div>
                    <p className="text-xs text-gray-500 mb-6">Gestionado por Envíos Ayudadón</p>

                    <div className="border-t border-gray-300 pt-6 mb-8">
                        <div className="flex justify-between items-end mb-1">
                            <span className="text-xl font-black text-gray-900">TOTAL</span>
                            <span className="text-2xl font-black text-gray-900">MXN {total.toFixed(2)}</span>
                        </div>
                        <p className="text-right text-xs text-gray-500 font-medium">IVA Incluido</p>
                    </div>

                    <a
                      href={items.length > 0 ? '/envio' : '#'}
                      className={`w-full bg-brand-brown hover:bg-brand-brownDark text-white font-black h-14 rounded-full shadow-lg shadow-brand-brown/30 hover:shadow-xl hover:-translate-y-1 transition-all active:scale-95 text-lg flex items-center justify-center gap-3 ${items.length === 0 ? 'opacity-50 pointer-events-none' : ''}`}
                    >
                        Proceder al Envío <i className="fa-solid fa-handshake"></i>
                    </a>

                    <div className="mt-4 text-center">
                        <a href="/" className="text-sm text-brand-brownDark font-bold hover:underline">Continuar comprando</a>
                    </div>
                </div>
            </div>
        </div>

      </main>

    </div>
  );
}

function CarritoSkeleton() {
  return (
    <div className="bg-gray-50 min-h-screen animate-pulse">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="h-9 w-48 bg-gray-200 rounded mb-8" />
        <div className="h-1 w-full bg-gray-200 rounded mb-16" />
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          <div className="w-full lg:w-2/3 space-y-4">
            <div className="h-36 bg-gray-200 rounded-3xl" />
            <div className="h-36 bg-gray-200 rounded-3xl" />
            <div className="h-36 bg-gray-200 rounded-3xl" />
          </div>
          <div className="w-full lg:w-1/3">
            <div className="h-80 bg-gray-200 rounded-[2rem]" />
          </div>
        </div>
      </div>
    </div>
  );
}