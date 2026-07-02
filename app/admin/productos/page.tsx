"use client";

import React, { useState, useEffect } from 'react';

// =========================================================================
// 1. INTERFACES (Contrato de Datos para el Backend)
// =========================================================================
export interface ProductoAdmin {
  id: string;
  nombre: string;
  marca: string;
  imagen: string;
  descripcion: string;
  precio: number;
  stock: number;
  estado: 'Activo' | 'Inactivo' | 'Agotado';
}

// =========================================================================
// 2. SIMULADOR DE API (El Backend Dev reemplazará esto)
// =========================================================================
const fetchProductosData = async (): Promise<ProductoAdmin[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: "PROD-101", nombre: "Tequila Artesanal Añejo", marca: "Destilería Sol", imagen: "", descripcion: "Destilado con pasión siguiendo un proceso de antigüedad en solera.", precio: 450, stock: 12, estado: 'Activo' },
        { id: "PROD-102", nombre: "Cazuela de Barro Grande", marca: "Barro y Fuego", imagen: "", descripcion: "Cazuela libre de plomo, ideal para moles y guisos.", precio: 800, stock: 5, estado: 'Activo' },
        { id: "PROD-103", nombre: "Manta de Lana Tejida", marca: "Textiles del Valle", imagen: "", descripcion: "Cobija de lana 100% natural tejida a mano.", precio: 1200, stock: 0, estado: 'Agotado' },
        { id: "PROD-104", nombre: "Salsa Habanero tatemado", marca: "Salsas Toluca", imagen: "", descripcion: "Salsa muy picante con ingredientes locales.", precio: 190, stock: 45, estado: 'Activo' },
        { id: "PROD-105", nombre: "Cuadro Abstracto 'Amanecer'", marca: "Loan - Arte Moderno", imagen: "/marcas/Loan arte.png", descripcion: "Pintura acrílica sobre lienzo, 120x80cm.", precio: 4500, stock: 1, estado: 'Inactivo' },
      ]);
    }, 1000);
  });
};

export default function GestionProductosPage() {
  // =========================================================================
  // 3. ESTADOS DEL COMPONENTE
  // =========================================================================
  const [productos, setProductos] = useState<ProductoAdmin[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estados para el Drawer
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [productoEnEdicion, setProductoEnEdicion] = useState<ProductoAdmin | null>(null);
  const [modoDrawer, setModoDrawer] = useState<'crear' | 'editar'>('crear');

  // =========================================================================
  // 4. EFECTO DE CARGA
  // =========================================================================
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        // TODO: BACKEND DEV -> Cambiar por: const response = await fetch('/api/admin/productos'); return await response.json();
        const data = await fetchProductosData();
        setProductos(data);
      } catch (err) {
        setError("Error al cargar los productos.");
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // =========================================================================
  // 5. MANEJADORES DEL DRAWER
  // =========================================================================
  const handleNuevoProducto = () => {
    setModoDrawer('crear');
    setProductoEnEdicion({
      id: `PROD-${100 + productos.length + 1}`, // ID mockeado
      nombre: '',
      marca: '',
      imagen: '',
      descripcion: '',
      precio: 0,
      stock: 0,
      estado: 'Activo'
    });
    setIsDrawerOpen(true);
  };

  const handleEditarProducto = (producto: ProductoAdmin) => {
    setModoDrawer('editar');
    setProductoEnEdicion({ ...producto }); 
    setIsDrawerOpen(true);
  };

  const handleCerrarDrawer = () => {
    setIsDrawerOpen(false);
    setTimeout(() => setProductoEnEdicion(null), 300);
  };

  const handleGuardarProducto = () => {
    if (!productoEnEdicion) return;

    if (modoDrawer === 'editar') {
      setProductos(productos.map(p => p.id === productoEnEdicion.id ? productoEnEdicion : p));
      // TODO: BACKEND DEV -> Fetch PUT /api/admin/productos/{id}
    } else {
      setProductos([productoEnEdicion, ...productos]);
      // TODO: BACKEND DEV -> Fetch POST /api/admin/productos
    }
    handleCerrarDrawer();
  };

  // Utilidad de colores para los estados
  const getStatusStyle = (estado: string) => {
    switch (estado) {
      case 'Activo': return 'bg-green-100 text-green-800 border-green-200';
      case 'Agotado': return 'bg-red-100 text-red-800 border-red-200';
      case 'Inactivo': return 'bg-gray-100 text-gray-600 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="flex h-screen bg-[#F5F5F7] font-sans selection:bg-brand-brown selection:text-white overflow-hidden relative">
      
      {/* =========================================================
          SIDEBAR ESTATICO
      ========================================================= */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col justify-between hidden md:flex z-20 shadow-sm">
        <div>
          <div className="h-16 flex items-center gap-2 px-6 border-b border-gray-100 cursor-pointer">
            <img src="/images/PNG_Minim_Don.png" alt="Mascota" className="w-8 h-8 drop-shadow-sm" />
            <span className="text-xl font-black text-brand-navy tracking-tight">Ayudadón</span>
          </div>

          <nav className="flex flex-col gap-2 p-4">
            <a href="/admin/dashboard" className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-brand-navy rounded-xl font-medium transition-all group">
              <i className="fa-solid fa-house w-5 text-center group-hover:scale-110 transition-transform"></i> Dashboard
            </a>
            {/* PRODUCTOS (Activo) */}
            <a href="/admin/productos" className="flex items-center gap-3 px-4 py-3 bg-brand-navy text-white rounded-xl font-bold shadow-card transition-all">
              <i className="fa-solid fa-box w-5 text-center"></i> Productos
            </a>
            <a href="/admin/marcas" className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-brand-navy rounded-xl font-medium transition-all group">
              <i className="fa-solid fa-tag w-5 text-center group-hover:scale-110 transition-transform"></i> Marcas
            </a>
            <a href="/admin/pedidos" className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-brand-navy rounded-xl font-medium transition-all group">
              <i className="fa-regular fa-file-lines w-5 text-center group-hover:scale-110 transition-transform"></i> Pedidos
            </a>
          </nav>
        </div>
      </aside>

      {/* =========================================================
          CONTENEDOR PRINCIPAL
      ========================================================= */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        
        {/* HEADER */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-10 shadow-sm flex-shrink-0">
            <div className="w-full max-w-md relative hidden sm:block group">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 group-focus-within:text-brand-navy transition-colors">
                    <i className="fa-solid fa-magnifying-glass"></i>
                </span>
                <input 
                    type="text" 
                    placeholder="Buscar productos, marcas, IDs..." 
                    className="w-full py-2 pl-10 pr-4 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:border-brand-navy focus:ring-1 focus:ring-brand-navy/20 transition-all"
                />
            </div>
            <div className="flex items-center gap-4 ml-auto">
                <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                    <i className="fa-regular fa-circle-user text-xl text-gray-400"></i>
                    <span className="hidden sm:inline">Admin: <strong className="text-brand-navy">Elena R.</strong></span>
                </div>
            </div>
        </header>

        {/* MAIN CONTENIDO */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 md:p-8">
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 animate-fadeUp">
                <h1 className="text-2xl md:text-3xl font-black text-brand-navy">Gestión de Productos</h1>
                <button 
                    onClick={handleNuevoProducto}
                    className="bg-brand-brown hover:bg-brand-brownDark text-white font-bold py-3 px-6 rounded-xl shadow-card hover:shadow-card-hover hover:-translate-y-1 active:scale-95 transition-all flex items-center gap-2"
                >
                    <i className="fa-solid fa-plus"></i> Nuevo Producto
                </button>
            </div>

            {/* ESTADO CARGANDO */}
            {isLoading && (
              <div className="bg-white rounded-[2rem] shadow-card border border-gray-100 p-8 h-96 animate-pulse"></div>
            )}

            {/* LISTA DE PRODUCTOS */}
            {!isLoading && !error && (
              <div className="bg-white rounded-[2rem] shadow-card border border-gray-100 overflow-hidden animate-fadeUp" style={{ animationDelay: '100ms' }}>
                <div className="p-6 md:p-8 border-b border-gray-100 bg-gray-50/50">
                    <h2 className="text-lg font-bold text-gray-600 uppercase tracking-wider">Inventario de Productos ({productos.length})</h2>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="px-6 md:px-8 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Producto</th>
                        <th className="px-6 md:px-8 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Marca</th>
                        <th className="px-6 md:px-8 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Precio</th>
                        <th className="px-6 md:px-8 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Stock</th>
                        <th className="px-6 md:px-8 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Estado</th>
                        <th className="px-6 md:px-8 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {productos.map((p) => (
                        <tr key={p.id} className="hover:bg-gray-50/80 transition-colors group">
                          
                          {/* Info Producto */}
                          <td className="px-6 md:px-8 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 rounded-xl bg-[#F5F5F7] border border-gray-100 flex items-center justify-center text-xl overflow-hidden flex-shrink-0">
                                      {p.imagen ? (
                                        <img src={p.imagen} alt={p.nombre} className="w-full h-full object-cover" />
                                      ) : (
                                        <span className="opacity-50">📦</span>
                                      )}
                                  </div>
                                  <div>
                                      <p className="font-bold text-brand-navy truncate max-w-[200px] sm:max-w-[300px]">{p.nombre}</p>
                                      <p className="text-xs text-gray-400 font-medium">ID: {p.id}</p>
                                  </div>
                              </div>
                          </td>
                          
                          {/* Marca */}
                          <td className="px-6 md:px-8 py-4">
                              <span className="text-sm text-gray-600 font-medium bg-gray-100 px-3 py-1 rounded-full whitespace-nowrap">{p.marca}</span>
                          </td>
                          
                          {/* Precio */}
                          <td className="px-6 md:px-8 py-4 whitespace-nowrap">
                              <span className="font-black text-brand-brown">${p.precio.toLocaleString('es-MX')}</span>
                          </td>

                          {/* Stock */}
                          <td className="px-6 md:px-8 py-4 text-center whitespace-nowrap">
                              <span className={`font-black ${p.stock > 10 ? 'text-green-600' : p.stock > 0 ? 'text-yellow-600' : 'text-red-500'}`}>
                                  {p.stock}
                              </span>
                          </td>
                          
                          {/* Estado */}
                          <td className="px-6 md:px-8 py-4 whitespace-nowrap">
                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full border ${getStatusStyle(p.estado)}`}>
                              {p.estado}
                            </span>
                          </td>
                          
                          {/* Acciones */}
                          <td className="px-6 md:px-8 py-4 whitespace-nowrap text-center">
                            <button 
                                onClick={() => handleEditarProducto(p)} 
                                className="w-10 h-10 rounded-xl bg-gray-100 text-gray-500 hover:bg-brand-brown hover:text-white hover:shadow-md transition-all focus:outline-none"
                                title="Editar Producto"
                            >
                              <i className="fa-solid fa-pen-to-square"></i>
                            </button>
                          </td>

                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
        </main>
      </div>

      {/* =========================================================
          DRAWER LATERAL (Crear / Editar Producto)
      ========================================================= */}
      {isDrawerOpen && productoEnEdicion && (
        <div 
            className="fixed inset-0 bg-brand-navy/40 backdrop-blur-sm z-50 flex justify-end animate-fadeUp" 
            style={{ animationDuration: '0.2s' }}
            onClick={handleCerrarDrawer}
        >
          <div 
            className="w-full max-w-md bg-white h-full shadow-2xl p-6 md:p-8 overflow-y-auto animate-fadeUp border-l border-gray-200 flex flex-col" 
            style={{ animationDuration: '0.3s' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header del Drawer */}
            <div className="flex justify-between items-start mb-8 pb-4 border-b border-gray-100">
              <div>
                  <h2 className="text-xl font-black text-brand-navy uppercase tracking-tight">
                      {modoDrawer === 'crear' ? 'Nuevo Producto' : 'Editar Producto'}
                  </h2>
                  <p className="text-gray-400 font-bold text-sm mt-1">{productoEnEdicion.id}</p>
              </div>
              <button 
                  onClick={handleCerrarDrawer} 
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-red-100 hover:text-red-500 transition-colors focus:outline-none"
              >
                  <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>

            {/* Formulario */}
            <div className="flex-1 space-y-5">

                {/* Previsualización de Imagen */}
                <div className="flex flex-col items-center justify-center w-full mb-4">
                    <div className="w-32 h-32 rounded-2xl border-4 border-gray-50 shadow-sm bg-[#F5F5F7] flex items-center justify-center overflow-hidden mb-3 text-5xl font-black text-gray-300">
                        {productoEnEdicion.imagen ? (
                            <img src={productoEnEdicion.imagen} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                            <i className="fa-solid fa-box-open opacity-50"></i>
                        )}
                    </div>
                </div>
                
                {/* Nombre */}
                <div>
                    <label className="block text-xs font-bold text-brand-navy uppercase tracking-wider mb-2">Nombre del Producto</label>
                    <input 
                        type="text" 
                        value={productoEnEdicion.nombre}
                        onChange={(e) => setProductoEnEdicion({...productoEnEdicion, nombre: e.target.value})}
                        placeholder="Ej. Cazuela de Barro 5L"
                        className="w-full p-3.5 border-2 border-gray-200 rounded-xl text-sm font-medium outline-none focus:border-brand-brown/50 transition-colors"
                    />
                </div>

                {/* Marca */}
                <div>
                    <label className="block text-xs font-bold text-brand-navy uppercase tracking-wider mb-2">Marca Asociada</label>
                    <input 
                        type="text" 
                        value={productoEnEdicion.marca}
                        onChange={(e) => setProductoEnEdicion({...productoEnEdicion, marca: e.target.value})}
                        placeholder="Ej. Destilería Sol"
                        className="w-full p-3.5 border-2 border-gray-200 rounded-xl text-sm font-medium outline-none focus:border-brand-brown/50 transition-colors"
                    />
                </div>

                {/* Precio y Stock */}
                <div className="flex gap-4">
                    <div className="flex-1">
                        <label className="block text-xs font-bold text-brand-navy uppercase tracking-wider mb-2">Precio (MXN)</label>
                        <input 
                            type="number" 
                            min="0"
                            value={productoEnEdicion.precio || ''}
                            onChange={(e) => setProductoEnEdicion({...productoEnEdicion, precio: parseFloat(e.target.value) || 0})}
                            placeholder="0.00"
                            className="w-full p-3.5 border-2 border-gray-200 rounded-xl text-sm font-bold text-brand-brown outline-none focus:border-brand-brown/50 transition-colors"
                        />
                    </div>
                    <div className="flex-1">
                        <label className="block text-xs font-bold text-brand-navy uppercase tracking-wider mb-2">Stock Disponible</label>
                        <input 
                            type="number" 
                            min="0"
                            value={productoEnEdicion.stock || ''}
                            onChange={(e) => setProductoEnEdicion({...productoEnEdicion, stock: parseInt(e.target.value) || 0})}
                            placeholder="0"
                            className="w-full p-3.5 border-2 border-gray-200 rounded-xl text-sm font-bold outline-none focus:border-brand-brown/50 transition-colors"
                        />
                    </div>
                </div>

                {/* URL de la Imagen */}
                <div>
                    <label className="block text-xs font-bold text-brand-navy uppercase tracking-wider mb-2">URL de la imagen</label>
                    <input 
                        type="text" 
                        value={productoEnEdicion.imagen}
                        onChange={(e) => setProductoEnEdicion({...productoEnEdicion, imagen: e.target.value})}
                        placeholder="https://ejemplo.com/producto.jpg"
                        className="w-full p-3.5 border-2 border-gray-200 rounded-xl text-sm font-medium outline-none focus:border-brand-brown/50 transition-colors"
                    />
                </div>

                {/* Descripción */}
                <div>
                    <label className="block text-xs font-bold text-brand-navy uppercase tracking-wider mb-2">Descripción</label>
                    <textarea 
                        value={productoEnEdicion.descripcion}
                        onChange={(e) => setProductoEnEdicion({...productoEnEdicion, descripcion: e.target.value})}
                        placeholder="Describe las características principales del producto..."
                        rows={3}
                        className="w-full p-3.5 border-2 border-gray-200 rounded-xl text-sm font-medium outline-none focus:border-brand-brown/50 transition-colors resize-none"
                    ></textarea>
                </div>

                {/* Estado */}
                <div>
                    <label className="block text-xs font-bold text-brand-navy uppercase tracking-wider mb-2">Estado del Producto</label>
                    <select 
                        value={productoEnEdicion.estado}
                        onChange={(e) => setProductoEnEdicion({...productoEnEdicion, estado: e.target.value as ProductoAdmin['estado']})}
                        className={`w-full p-3.5 border-2 border-gray-200 rounded-xl font-bold text-sm outline-none focus:border-brand-brown/50 transition-colors cursor-pointer appearance-none ${productoEnEdicion.estado === 'Activo' ? 'text-green-700' : productoEnEdicion.estado === 'Agotado' ? 'text-red-700' : 'text-gray-600'}`}
                    >
                        <option value="Activo">Activo (Visible y en venta)</option>
                        <option value="Agotado">Agotado (Visible, sin stock)</option>
                        <option value="Inactivo">Inactivo (Oculto)</option>
                    </select>
                </div>
            </div>

            {/* Footer del Drawer (Botones) */}
            <div className="mt-8 pt-6 border-t border-gray-100 flex gap-3 flex-shrink-0">
                <button 
                    onClick={handleCerrarDrawer}
                    className="flex-1 py-4 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors focus:outline-none"
                >
                    Cancelar
                </button>
                <button 
                    onClick={handleGuardarProducto}
                    disabled={!productoEnEdicion.nombre || productoEnEdicion.precio <= 0}
                    className="flex-1 py-4 rounded-xl font-black text-white bg-brand-brown hover:bg-brand-brownDark hover:-translate-y-1 hover:shadow-md transition-all active:scale-95 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none focus:outline-none"
                >
                    {modoDrawer === 'crear' ? 'Crear Producto' : 'Guardar'}
                </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}