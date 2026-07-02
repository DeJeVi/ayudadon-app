"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { getProductoBySlug, getProductosRelacionados, getMarcas } from '@/lib/api';
import type { Producto, Marca } from '@/types/api';

export default function ProductoPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [producto, setProducto] = useState<Producto | null>(null);
  const [marca, setMarca] = useState<Marca | null>(null);
  const [relacionados, setRelacionados] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | undefined>();
  const [selectedColor, setSelectedColor] = useState<string | undefined>();

  const revealRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const productoData = await getProductoBySlug(slug);
        if (!productoData) {
          setNotFound(true);
          return;
        }

        const [relacionadosData, marcas] = await Promise.all([
          getProductosRelacionados(productoData.id, productoData.marcaId),
          getMarcas(),
        ]);

        const marcaData = marcas.find((m) => m.id === productoData.marcaId) ?? null;

        setProducto(productoData);
        setRelacionados(relacionadosData);
        setMarca(marcaData);
        setSelectedSize(productoData.sizes?.[0]);
        setSelectedColor(productoData.colors?.[0]);
      } catch (err) {
        console.error('Error cargando datos del producto:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [slug]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.remove('opacity-0');
            entry.target.classList.add('animate-fadeUp');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -50px 0px" }
    );
    revealRefs.current.forEach((el) => { if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, [producto]);

  const addToRefs = (el: HTMLElement | null) => {
    if (el && !revealRefs.current.includes(el)) revealRefs.current.push(el);
  };

  if (loading) return <ProductoSkeleton />;

  if (notFound || !producto) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-black text-brand-navy mb-2">Producto no encontrado</h1>
        <p className="text-gray-500">No pudimos encontrar el producto que buscas.</p>
        <a href="/" className="inline-block mt-6 bg-brand-brown text-white font-bold px-6 py-3 rounded-full hover:bg-brand-brownDark transition-colors">
          Volver al inicio
        </a>
      </div>
    );
  }

  return (
    <div className="bg-[#F5F5F7] flex flex-col w-full min-h-screen">

      <main className="max-w-5xl mx-auto px-4 md:px-6 py-6 md:py-12 flex-grow w-full">

        {/* BREADCRUMB */}
        <nav ref={addToRefs} className="text-xs md:text-sm text-gray-500 mb-6 font-medium flex justify-center items-center whitespace-nowrap overflow-x-auto pb-2 opacity-0">
            <a href="/" className="hover:text-brand-brown transition-colors">Inicio</a>
            <span className="mx-2 text-gray-300">&gt;</span>
            <a href={`/marca/${marca?.slug ?? ''}`} className="hover:text-brand-brown transition-colors">
              {marca?.name ?? 'Marca'}
            </a>
            <span className="mx-2 text-gray-300">&gt;</span>
            <span className="text-brand-navy font-bold truncate max-w-[150px] sm:max-w-none">{producto.name}</span>
        </nav>

        {/* CONTENEDOR CENTRAL DEL PRODUCTO */}
        <div className="flex flex-col items-center gap-8 md:gap-12 w-full">

            {/* GALERÍA DE IMÁGENES */}
            <div ref={addToRefs} className="w-full flex flex-col items-center gap-4 md:gap-6 opacity-0">
                <div className="bg-white rounded-[2rem] md:rounded-[3rem] w-full max-w-4xl aspect-[4/3] md:aspect-[16/9] flex items-center justify-center relative overflow-hidden shadow-card border border-gray-100 group">
                    {producto.imageUrl ? (
                      <img src={producto.imageUrl} alt={producto.name} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700" />
                    ) : (
                      <span className="text-[6rem] sm:text-9xl md:text-[14rem] drop-shadow-2xl group-hover:scale-105 transition-transform duration-700 relative z-0">🍾</span>
                    )}
                </div>

                {producto.gallery && producto.gallery.length > 0 && (
                  <div className="flex justify-center gap-3 md:gap-4 w-full">
                      {producto.gallery.map((img, idx) => (
                        <button
                          key={idx}
                          className="bg-white rounded-xl md:rounded-2xl w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 flex items-center justify-center overflow-hidden border-2 border-transparent hover:border-brand-brown cursor-pointer shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-brown/50 transition-all"
                        >
                            <img src={img} alt={`Vista ${idx + 1} de ${producto.name}`} className="w-full h-full object-cover" />
                        </button>
                      ))}
                  </div>
                )}
            </div>

            {/* DETALLES DEL PRODUCTO */}
            <div ref={addToRefs} className="w-full max-w-3xl flex flex-col items-center text-center bg-white rounded-[2rem] p-6 sm:p-8 md:p-12 shadow-card border border-gray-100 relative opacity-0">

                <div className="text-brand-brown font-bold text-xs sm:text-sm md:text-base mb-3 flex flex-wrap items-center justify-center gap-2 uppercase tracking-widest">
                    <a href={`/marca/${marca?.slug ?? ''}`} className="hover:text-brand-brownDark transition-colors">{marca?.name ?? ''}</a>
                </div>

                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-brand-navy leading-tight mb-4">{producto.name}</h1>

                <div className="text-4xl sm:text-5xl md:text-6xl font-black text-brand-navy mb-6">
                    ${producto.price.toFixed(2)} <span className="text-xl md:text-3xl text-gray-400 font-bold">MXN</span>
                </div>

                {producto.description && (
                  <p className="text-gray-600 text-sm md:text-lg leading-relaxed mb-8 md:mb-10 font-medium max-w-2xl">
                      {producto.description}
                  </p>
                )}

                {/* Filtros de Tamaño y Color — solo si el producto los tiene */}
                {(producto.sizes?.length || producto.colors?.length) ? (
                  <div className="w-full flex flex-col md:flex-row justify-center gap-6 md:gap-10 mb-8 border-t border-b border-gray-100 py-6 md:py-8">
                      {producto.sizes && producto.sizes.length > 0 && (
                        <div className="flex flex-col items-center w-full md:w-auto">
                            <h3 className="font-bold text-brand-navy mb-3 text-xs md:text-sm uppercase tracking-wider">Tamaño</h3>
                            <div className="flex flex-wrap justify-center gap-2">
                                {producto.sizes.map(size => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={`px-5 py-2.5 md:py-2 rounded-full font-bold text-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand-brown/40 ${selectedSize === size ? 'border-2 border-brand-brown bg-brand-brown/10 text-brand-brownDark shadow-sm' : 'border border-gray-200 text-gray-500 hover:border-brand-brown/50 bg-gray-50/50 hover:bg-white'}`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>
                      )}

                      {producto.sizes?.length && producto.colors?.length ? (
                        <div className="hidden md:block w-px bg-gray-200"></div>
                      ) : null}

                      {producto.colors && producto.colors.length > 0 && (
                        <div className="flex flex-col items-center w-full md:w-auto">
                            <h3 className="font-bold text-brand-navy mb-3 text-xs md:text-sm uppercase tracking-wider">Color</h3>
                            <div className="flex flex-wrap justify-center gap-2">
                                {producto.colors.map(color => (
                                    <button
                                        key={color}
                                        onClick={() => setSelectedColor(color)}
                                        className={`px-5 py-2.5 md:py-2 rounded-full font-bold text-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand-brown/40 ${selectedColor === color ? 'border-2 border-brand-brown bg-brand-brown/10 text-brand-brownDark shadow-sm' : 'border border-gray-200 text-gray-500 hover:border-brand-brown/50 bg-gray-50/50 hover:bg-white'}`}
                                    >
                                        {color}
                                    </button>
                                ))}
                            </div>
                        </div>
                      )}
                  </div>
                ) : null}

                {/* Controles de Compra */}
                <div className="w-full max-w-md flex flex-col sm:flex-row items-center gap-3 sm:gap-4 mb-8">
                    <div className="flex items-center border-2 border-gray-100 rounded-full bg-white h-12 sm:h-14 justify-between px-2 sm:px-4 w-full sm:w-36 lg:w-40 flex-shrink-0 shadow-sm focus-within:border-brand-brown/40 transition-colors">
                        <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-full flex items-center justify-center text-gray-400 hover:text-brand-brown transition-colors font-bold text-2xl focus:outline-none select-none">-</button>
                        <span className="font-black text-brand-navy text-lg sm:text-xl w-8 text-center select-none">{quantity}</span>
                        <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-full flex items-center justify-center text-gray-400 hover:text-brand-brown transition-colors font-bold text-2xl focus:outline-none select-none">+</button>
                    </div>

                    <button className="w-full flex-1 bg-brand-brown text-white font-black h-12 sm:h-14 rounded-full shadow-card hover:shadow-card-hover hover:-translate-y-0.5 hover:bg-brand-brownDark transition-all active:scale-95 text-base sm:text-lg flex items-center justify-center gap-3 group focus:outline-none focus:ring-4 focus:ring-brand-brown/30">
                        <i className="fa-solid fa-cart-shopping group-hover:scale-110 transition-transform"></i> Agregar al carrito
                    </button>
                </div>

                {/* Info de Envío */}
                <div className="flex items-center justify-center gap-2 sm:gap-3 text-brand-navy bg-brand-sky/10 px-4 sm:px-6 py-3 rounded-full text-xs sm:text-sm font-medium w-full sm:w-auto">
                    <i className="fa-solid fa-truck-fast text-brand-brown text-base sm:text-lg"></i>
                    <span className="text-center">Envío local <strong className="font-bold">Estado de México</strong></span>
                </div>

            </div>
        </div>

        {/* PRODUCTOS RELACIONADOS */}
        {relacionados.length > 0 && (
          <div ref={addToRefs} className="mt-16 md:mt-24 max-w-7xl mx-auto opacity-0">
              <div className="text-center mb-8">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-brand-navy border-b-4 border-brand-yellow inline-block pb-2">
                      También te podría interesar
                  </h2>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                  {relacionados.map((prod) => (
                      <a key={prod.id} href={`/producto/${prod.slug}`} className="bg-white rounded-2xl shadow-card hover:shadow-card-hover p-4 flex flex-col justify-between hover:-translate-y-2 transition-all duration-300 group/card cursor-pointer">
                          <div className="bg-[#F5F5F7] rounded-xl h-32 md:h-40 w-full mb-4 flex items-center justify-center overflow-hidden group-hover/card:scale-105 transition-transform duration-300">
                              {prod.imageUrl ? (
                                <img src={prod.imageUrl} alt={prod.name} className="w-full h-full object-contain" />
                              ) : (
                                <span className="text-5xl md:text-6xl">🏺</span>
                              )}
                          </div>
                          <div className="mt-auto">
                              <h4 className="font-bold text-brand-navy text-sm md:text-base mb-2 truncate">{prod.name}</h4>
                              <div className="flex items-center justify-between mt-2">
                                  <span className="font-extrabold text-brand-brown text-base md:text-lg">MXN {prod.price.toFixed(0)}</span>
                                  <button
                                    className="bg-[#F5F5F7] text-brand-navy w-10 h-10 rounded-xl flex items-center justify-center text-sm group-hover/card:bg-brand-brown group-hover/card:text-white transition-colors duration-300 active:scale-95 focus:outline-none"
                                    onClick={(e) => e.preventDefault()}
                                  >
                                      <i className="fa-solid fa-cart-plus"></i>
                                  </button>
                              </div>
                          </div>
                      </a>
                  ))}
              </div>
          </div>
        )}

      </main>
    </div>
  );
}

function ProductoSkeleton() {
  return (
    <div className="bg-[#F5F5F7] min-h-screen animate-pulse">
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-6 md:py-12">
        <div className="h-4 w-48 bg-gray-200 rounded mb-6 mx-auto" />
        <div className="bg-gray-200 rounded-[2rem] w-full aspect-[4/3] md:aspect-[16/9] mb-8" />
        <div className="bg-gray-200 rounded-[2rem] w-full max-w-3xl mx-auto h-96" />
      </div>
    </div>
  );
}