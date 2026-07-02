"use client";

import React, { useState, useEffect } from 'react';

// =========================================================================
// 1. INTERFACES (Contrato de Datos para el Backend)
// =========================================================================
export interface ProductoBusqueda {
  id: string;
  name: string;
  brand: string;
  price: number;
  icon: string;
}

export interface Filtros {
  query: string; // Para filtrar por nombre de producto
  marca: string; // Para filtrar por marca
}

// =========================================================================
// 2. SIMULADOR DE API (El Backend Dev reemplazará esto)
// =========================================================================
const fetchResultadosBusqueda = async (filtros: Filtros): Promise<ProductoBusqueda[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Base de datos de prueba
      const db = [
        { id: "1", name: "Cazuela de Barro 5L", brand: "Barro y Fuego", price: 800, icon: "🥘" },
        { id: "2", name: "Olla de Barro Pequeña", brand: "Barro y Fuego", price: 450, icon: "🏺" },
        { id: "3", name: "Tequila Artesanal Añejo", brand: "Destilería Sol", price: 450, icon: "🍾" },
        { id: "4", name: "Mezcal Regional", brand: "Destilería Sol", price: 250, icon: "🥃" },
        { id: "5", name: "Salsa Habanero Tatemado", brand: "Salsas Toluca", price: 190, icon: "🌶️" },
        { id: "6", name: "Manta Tejida a Mano", brand: "Textiles del Valle", price: 1200, icon: "🧶" },
        { id: "7", name: "Cuadro Abstracto 'Amanecer'", brand: "Loan - Arte Moderno", price: 4500, icon: "🖼️" },
        { id: "8", name: "Vasos Tequileros (Set de 4)", brand: "Barro y Fuego", price: 350, icon: "🥂" },
      ];

      let filtrados = db;

      // 1. Filtrar por Nombre de Producto (query)
      if (filtros.query) {
        const busqueda = filtros.query.toLowerCase();
        filtrados = filtrados.filter(p => p.name.toLowerCase().includes(busqueda));
      }

      // 2. Filtrar por Marca
      if (filtros.marca) {
        filtrados = filtrados.filter(p => p.brand === filtros.marca);
      }
      
      resolve(filtrados);
    }, 800);
  });
};

export default function BusquedaPage() {
  // =========================================================================
  // 3. ESTADOS DEL COMPONENTE
  // =========================================================================
  const [productos, setProductos] = useState<ProductoBusqueda[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState<boolean>(false);
  
  // Estado de los filtros
  const [filtros, setFiltros] = useState<Filtros>({
    query: '', // Por defecto vacío para mostrar todo el catálogo si no hay búsqueda
    marca: ''
  });

  // Marcas disponibles estáticas para el filtro (El backend podría mandarlas dinámicamente)
  const marcasDisponibles = [
    'Barro y Fuego', 
    'Destilería Sol', 
    'Salsas Toluca', 
    'Textiles del Valle', 
    'Loan - Arte Moderno'
  ];

  // =========================================================================
  // 4. EFECTO DE BÚSQUEDA (Se dispara al cambiar un filtro)
  // =========================================================================
  useEffect(() => {
    const buscar = async () => {
      setIsLoading(true);
      // TODO: BACKEND DEV -> fetch(`/api/productos/buscar?q=${filtros.query}&marca=${filtros.marca}`)
      const resultados = await fetchResultadosBusqueda(filtros);
      setProductos(resultados);
      setIsLoading(false);
    };
    buscar();
  }, [filtros]);

  return (
    <div className="bg-[#F5F5F7] min-h-screen font-sans flex flex-col items-center w-full selection:bg-brand-brown selection:text-white">
      
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-10 w-full flex-grow flex flex-col md:flex-row gap-8">
        
        {/* =========================================================
            HEADER MÓVIL Y BOTÓN DE FILTROS
        ========================================================= */}
        <div className="md:hidden flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">Catálogo</p>
                <h1 className="text-xl font-black text-brand-navy">
                    {filtros.query ? `Resultados para "${filtros.query}"` : 'Todos los productos'}
                </h1>
            </div>
            <button 
                onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
                className="bg-brand-sky/10 text-brand-navy w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg hover:bg-brand-sky/20 transition-colors focus:outline-none"
            >
                <i className="fa-solid fa-sliders"></i>
            </button>
        </div>

        {/* =========================================================
            BARRA LATERAL (FILTROS DE NOMBRE Y MARCA)
        ========================================================= */}
        <aside className={`w-full md:w-64 xl:w-72 flex-shrink-0 flex flex-col gap-6 ${isMobileFiltersOpen ? 'block' : 'hidden md:flex'}`}>
            
            {/* Título Desktop */}
            <div className="hidden md:block mb-2">
                <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">Catálogo</p>
                <h1 className="text-2xl xl:text-3xl font-black text-brand-navy break-words">
                    {filtros.query ? `"${filtros.query}"` : 'Todos los productos'}
                </h1>
                <p className="text-sm font-medium text-gray-500 mt-2">{productos.length} resultados encontrados</p>
            </div>

            {/* Contenedor de Filtros */}
            <div className="bg-white rounded-3xl p-6 shadow-card border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-brand-navy text-lg"><i className="fa-solid fa-filter mr-2 text-brand-brown"></i> Filtros</h3>
                    <button 
                        onClick={() => setFiltros({ query: '', marca: '' })}
                        className="text-xs font-bold text-brand-brown hover:underline focus:outline-none"
                    >
                        Limpiar todo
                    </button>
                </div>

                {/* Filtro: Nombre del Producto (Buscador Interno) */}
                <div className="mb-6">
                    <h4 className="font-bold text-sm text-brand-navy mb-3 uppercase tracking-wider">Nombre del Producto</h4>
                    <div className="relative w-full">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                            <i className="fa-solid fa-magnifying-glass"></i>
                        </span>
                        <input 
                            type="text" 
                            placeholder="Ej. Cazuela, Tequila..." 
                            value={filtros.query}
                            onChange={(e) => setFiltros({...filtros, query: e.target.value})}
                            className="w-full pl-9 pr-3 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-brand-brown/50 focus:bg-white transition-all"
                        />
                    </div>
                </div>

                <div className="w-full h-px bg-gray-100 mb-6"></div>

                {/* Filtro: Marca */}
                <div>
                    <h4 className="font-bold text-sm text-brand-navy mb-3 uppercase tracking-wider">Marcas</h4>
                    <div className="flex flex-col gap-2">
                        {marcasDisponibles.map(marca => (
                            <button 
                                key={marca}
                                onClick={() => setFiltros({...filtros, marca: filtros.marca === marca ? '' : marca})}
                                className={`text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all focus:outline-none ${filtros.marca === marca ? 'bg-brand-brown/10 text-brand-brownDark font-bold border border-brand-brown/30 shadow-sm' : 'text-gray-600 hover:bg-gray-50 border border-transparent hover:border-gray-200'}`}
                            >
                                {marca}
                            </button>
                        ))}
                    </div>
                </div>

            </div>
        </aside>

        {/* =========================================================
            RESULTADOS (GRID DE TARJETAS)
        ========================================================= */}
        <div className="flex-1 w-full">
            
            {/* Header de Resultados Desktop */}
            <div className="hidden md:flex justify-between items-center mb-6 bg-white px-6 py-4 rounded-2xl shadow-sm border border-gray-100">
                <span className="font-bold text-gray-600">Mostrando {productos.length} resultados</span>
                <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-brand-navy">Ordenar por:</span>
                    <select className="bg-gray-50 border border-gray-200 text-sm font-medium rounded-xl px-4 py-2 outline-none focus:border-brand-brown cursor-pointer">
                        <option>Relevancia</option>
                        <option>Menor Precio</option>
                        <option>Mayor Precio</option>
                        <option>A-Z</option>
                    </select>
                </div>
            </div>

            {/* ESTADO: CARGANDO */}
            {isLoading && (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 animate-pulse">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="bg-white rounded-2xl p-4 h-64 border border-gray-100 shadow-sm flex flex-col justify-between">
                            <div className="bg-gray-200 rounded-xl h-32 w-full mb-4"></div>
                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                            <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                        </div>
                    ))}
                </div>
            )}

            {/* ESTADO: SIN RESULTADOS */}
            {!isLoading && productos.length === 0 && (
                <div className="bg-white rounded-[2rem] p-8 md:p-12 flex flex-col items-center justify-center text-center shadow-card border border-gray-100 animate-fadeUp">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-6 text-3xl">
                        <i className="fa-solid fa-box-open"></i>
                    </div>
                    <h2 className="text-xl md:text-2xl font-black text-brand-navy mb-2">No encontramos resultados</h2>
                    <p className="text-gray-500 max-w-md text-sm md:text-base">No pudimos encontrar ningún producto con el nombre o la marca seleccionada. Intenta buscar de otra manera.</p>
                    <button 
                        onClick={() => setFiltros({ query: '', marca: '' })}
                        className="mt-6 bg-brand-brown text-white font-bold py-3 px-8 rounded-xl shadow-card hover:shadow-card-hover hover:-translate-y-1 hover:bg-brand-brownDark transition-all active:scale-95"
                    >
                        Limpiar filtros
                    </button>
                </div>
            )}

            {/* ESTADO: CON RESULTADOS */}
            {!isLoading && productos.length > 0 && (
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 animate-fadeUp">
                    {productos.map((prod) => (
                        <a key={prod.id} href={`/producto/${prod.id}`} className="bg-white border border-gray-100 rounded-2xl p-3 sm:p-4 flex flex-col justify-between shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 group cursor-pointer">
                            
                            <div className="bg-[#F5F5F7] rounded-xl h-32 md:h-40 w-full mb-3 sm:mb-4 flex items-center justify-center text-5xl md:text-6xl group-hover:scale-105 transition-transform duration-300 relative overflow-hidden">
                                <span className="relative z-10 drop-shadow-sm">{prod.icon}</span>
                            </div>
                            
                            <div className="mt-auto flex flex-col h-full">
                                <span className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 truncate">{prod.brand}</span>
                                <h4 className="font-bold text-brand-navy text-sm md:text-base mb-3 leading-snug line-clamp-2">{prod.name}</h4>
                                
                                <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-50">
                                    <span className="font-black text-brand-brown text-base sm:text-lg">MXN {prod.price}</span>
                                    
                                    <button 
                                        onClick={(e) => { e.preventDefault(); console.log("Añadido al carrito:", prod.id); }}
                                        className="bg-[#F5F5F7] text-brand-navy w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-sm group-hover:bg-brand-brown group-hover:text-white transition-colors duration-300 active:scale-95 focus:outline-none"
                                        title="Agregar al Carrito"
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