"use client";

import React, { useState, useEffect } from 'react';

// =========================================================================
// 1. INTERFACES (Contrato de Datos para el Backend)
// =========================================================================
export interface MarcaAdmin {
  id: string;
  nombre: string;
  imagen: string;
  descripcion: string;
  totalProductos: number;
  estado: 'Activa' | 'Inactiva' | 'Pendiente';
  fechaRegistro: string;
}

// =========================================================================
// 2. SIMULADOR DE API (El Backend Dev reemplazará esto)
// =========================================================================
const fetchMarcasData = async (): Promise<MarcaAdmin[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: "MAR-001", nombre: "Destilería Sol", imagen: "", descripcion: "Destilados artesanales y tradicionales elaborados con el mejor agave de la región.", totalProductos: 12, estado: 'Activa', fechaRegistro: "10 Ene 2026" },
        { id: "MAR-002", nombre: "Loan - Arte Moderno", imagen: "/marcas/Loan arte.png", descripcion: "Arte abstracto contemporáneo, muy humano, muy visual y nada artificial.", totalProductos: 8, estado: 'Activa', fechaRegistro: "15 Feb 2026" },
        { id: "MAR-003", nombre: "Salsas Toluca", imagen: "", descripcion: "Salsas y condimentos 100% caseros, sin conservadores.", totalProductos: 4, estado: 'Activa', fechaRegistro: "22 Mar 2026" },
        { id: "MAR-004", nombre: "Textiles del Valle", imagen: "", descripcion: "Prendas tejidas a mano por comunidades de artesanos del Estado de México.", totalProductos: 0, estado: 'Pendiente', fechaRegistro: "16 Jun 2026" },
        { id: "MAR-005", nombre: "Barro y Fuego", imagen: "", descripcion: "Alfarería tradicional, cazuelas, ollas y jarritos de barro libres de plomo.", totalProductos: 24, estado: 'Inactiva', fechaRegistro: "05 Nov 2025" },
      ]);
    }, 1000);
  });
};

export default function GestionMarcasPage() {
  // =========================================================================
  // 3. ESTADOS DEL COMPONENTE
  // =========================================================================
  const [marcas, setMarcas] = useState<MarcaAdmin[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estados para el Drawer (Editar / Crear Nueva)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [marcaEnEdicion, setMarcaEnEdicion] = useState<MarcaAdmin | null>(null);
  const [modoDrawer, setModoDrawer] = useState<'crear' | 'editar'>('crear');

  // =========================================================================
  // 4. EFECTO DE CARGA
  // =========================================================================
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        // TODO: BACKEND DEV -> Cambiar por: const response = await fetch('/api/admin/marcas'); return await response.json();
        const data = await fetchMarcasData();
        setMarcas(data);
      } catch (err) {
        setError("Error al cargar las marcas.");
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // =========================================================================
  // 5. MANEJADORES DEL DRAWER
  // =========================================================================
  const handleNuevaMarca = () => {
    setModoDrawer('crear');
    setMarcaEnEdicion({
      id: `MAR-00${marcas.length + 1}`, // ID temporal mockeado
      nombre: '',
      imagen: '',
      descripcion: '',
      totalProductos: 0,
      estado: 'Pendiente',
      fechaRegistro: new Date().toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })
    });
    setIsDrawerOpen(true);
  };

  const handleEditarMarca = (marca: MarcaAdmin) => {
    setModoDrawer('editar');
    setMarcaEnEdicion({ ...marca }); // Copia para no mutar el estado original hasta guardar
    setIsDrawerOpen(true);
  };

  const handleCerrarDrawer = () => {
    setIsDrawerOpen(false);
    setTimeout(() => setMarcaEnEdicion(null), 300); // Esperar que termine la animación
  };

  const handleGuardarMarca = () => {
    if (!marcaEnEdicion) return;

    if (modoDrawer === 'editar') {
      setMarcas(marcas.map(m => m.id === marcaEnEdicion.id ? marcaEnEdicion : m));
      // TODO: BACKEND DEV -> Fetch PUT /api/admin/marcas/{id}
    } else {
      setMarcas([marcaEnEdicion, ...marcas]);
      // TODO: BACKEND DEV -> Fetch POST /api/admin/marcas
    }
    handleCerrarDrawer();
  };

  // Utilidad de colores para los estados
  const getStatusStyle = (estado: string) => {
    switch (estado) {
      case 'Activa': return 'bg-green-100 text-green-800 border-green-200';
      case 'Pendiente': return 'bg-brand-yellow/20 text-yellow-800 border-brand-yellow/40';
      case 'Inactiva': return 'bg-gray-100 text-gray-600 border-gray-200';
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
            <a href="/admin/productos" className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-brand-navy rounded-xl font-medium transition-all group">
              <i className="fa-solid fa-box w-5 text-center group-hover:scale-110 transition-transform"></i> Productos
            </a>
            {/* MARCAS (Activo) */}
            <a href="/admin/marcas" className="flex items-center gap-3 px-4 py-3 bg-brand-navy text-white rounded-xl font-bold shadow-card transition-all">
              <i className="fa-solid fa-tag w-5 text-center"></i> Marcas
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
                    placeholder="Buscar marcas..." 
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
                <h1 className="text-2xl md:text-3xl font-black text-brand-navy">Gestión de Marcas</h1>
                <button 
                    onClick={handleNuevaMarca}
                    className="bg-brand-brown hover:bg-brand-brownDark text-white font-bold py-3 px-6 rounded-xl shadow-card hover:shadow-card-hover hover:-translate-y-1 active:scale-95 transition-all flex items-center gap-2"
                >
                    <i className="fa-solid fa-plus"></i> Nueva Marca
                </button>
            </div>

            {/* ESTADO CARGANDO */}
            {isLoading && (
              <div className="bg-white rounded-[2rem] shadow-card border border-gray-100 p-8 h-96 animate-pulse"></div>
            )}

            {/* LISTA DE MARCAS */}
            {!isLoading && !error && (
              <div className="bg-white rounded-[2rem] shadow-card border border-gray-100 overflow-hidden animate-fadeUp" style={{ animationDelay: '100ms' }}>
                <div className="p-6 md:p-8 border-b border-gray-100 bg-gray-50/50">
                    <h2 className="text-lg font-bold text-gray-600 uppercase tracking-wider">Marcas Registradas ({marcas.length})</h2>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="px-6 md:px-8 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Info Marca</th>
                        <th className="px-6 md:px-8 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Descripción</th>
                        <th className="px-6 md:px-8 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Productos</th>
                        <th className="px-6 md:px-8 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Estado</th>
                        <th className="px-6 md:px-8 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {marcas.map((m) => (
                        <tr key={m.id} className="hover:bg-gray-50/80 transition-colors group">
                          
                          {/* Info Marca (Logo + Nombre) */}
                          <td className="px-6 md:px-8 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 rounded-full bg-white shadow-sm border border-gray-200 flex items-center justify-center font-black text-brand-navy overflow-hidden flex-shrink-0">
                                      {m.imagen ? (
                                        <img src={m.imagen} alt={m.nombre} className="w-full h-full object-cover" />
                                      ) : (
                                        m.nombre.charAt(0)
                                      )}
                                  </div>
                                  <div>
                                      <p className="font-bold text-brand-navy">{m.nombre}</p>
                                      <p className="text-xs text-gray-400 font-medium">ID: {m.id}</p>
                                  </div>
                              </div>
                          </td>
                          
                          {/* Descripción (Truncada) */}
                          <td className="px-6 md:px-8 py-4">
                              <p className="text-sm text-gray-600 line-clamp-2 max-w-xs">{m.descripcion}</p>
                          </td>
                          
                          {/* Total Productos */}
                          <td className="px-6 md:px-8 py-4 text-center whitespace-nowrap">
                              <span className="bg-brand-sky/20 text-brand-navyLight font-bold py-1 px-3 rounded-lg text-sm">
                                  {m.totalProductos}
                              </span>
                          </td>
                          
                          {/* Estado */}
                          <td className="px-6 md:px-8 py-4 whitespace-nowrap">
                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full border ${getStatusStyle(m.estado)}`}>
                              {m.estado}
                            </span>
                          </td>
                          
                          {/* Acciones */}
                          <td className="px-6 md:px-8 py-4 whitespace-nowrap text-center">
                            <button 
                                onClick={() => handleEditarMarca(m)} 
                                className="w-10 h-10 rounded-xl bg-gray-100 text-gray-500 hover:bg-brand-brown hover:text-white hover:shadow-md transition-all focus:outline-none"
                                title="Editar Marca"
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
          DRAWER LATERAL (Crear / Editar Marca)
      ========================================================= */}
      {isDrawerOpen && marcaEnEdicion && (
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
                      {modoDrawer === 'crear' ? 'Nueva Marca' : 'Editar Marca'}
                  </h2>
                  <p className="text-gray-400 font-bold text-sm mt-1">{marcaEnEdicion.id}</p>
              </div>
              <button 
                  onClick={handleCerrarDrawer} 
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-red-100 hover:text-red-500 transition-colors focus:outline-none"
              >
                  <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>

            {/* Formulario */}
            <div className="flex-1 space-y-6">

                {/* Previsualización de Imagen */}
                <div className="flex flex-col items-center justify-center w-full mb-6">
                    <div className="w-24 h-24 rounded-full border-4 border-gray-50 shadow-sm bg-gray-100 flex items-center justify-center overflow-hidden mb-3 text-3xl font-black text-gray-300">
                        {marcaEnEdicion.imagen ? (
                            <img src={marcaEnEdicion.imagen} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                            marcaEnEdicion.nombre ? marcaEnEdicion.nombre.charAt(0).toUpperCase() : <i className="fa-regular fa-image"></i>
                        )}
                    </div>
                </div>
                
                {/* Nombre de la Marca */}
                <div>
                    <label className="block text-xs font-bold text-brand-navy uppercase tracking-wider mb-2">Nombre de la Marca</label>
                    <input 
                        type="text" 
                        value={marcaEnEdicion.nombre}
                        onChange={(e) => setMarcaEnEdicion({...marcaEnEdicion, nombre: e.target.value})}
                        placeholder="Ej. Destilería Sol"
                        className="w-full p-3.5 border-2 border-gray-200 rounded-xl text-sm font-medium outline-none focus:border-brand-brown/50 transition-colors"
                    />
                </div>

                {/* URL de la Imagen */}
                <div>
                    <label className="block text-xs font-bold text-brand-navy uppercase tracking-wider mb-2">Logo (URL de la imagen)</label>
                    <input 
                        type="text" 
                        value={marcaEnEdicion.imagen}
                        onChange={(e) => setMarcaEnEdicion({...marcaEnEdicion, imagen: e.target.value})}
                        placeholder="https://ejemplo.com/logo.png"
                        className="w-full p-3.5 border-2 border-gray-200 rounded-xl text-sm font-medium outline-none focus:border-brand-brown/50 transition-colors"
                    />
                </div>

                {/* Descripción */}
                <div>
                    <label className="block text-xs font-bold text-brand-navy uppercase tracking-wider mb-2">Descripción</label>
                    <textarea 
                        value={marcaEnEdicion.descripcion}
                        onChange={(e) => setMarcaEnEdicion({...marcaEnEdicion, descripcion: e.target.value})}
                        placeholder="Escribe un resumen sobre la marca y lo que venden..."
                        rows={4}
                        className="w-full p-3.5 border-2 border-gray-200 rounded-xl text-sm font-medium outline-none focus:border-brand-brown/50 transition-colors resize-none"
                    ></textarea>
                </div>

                {/* Estado */}
                <div>
                    <label className="block text-xs font-bold text-brand-navy uppercase tracking-wider mb-2">Estado de la Marca</label>
                    <select 
                        value={marcaEnEdicion.estado}
                        onChange={(e) => setMarcaEnEdicion({...marcaEnEdicion, estado: e.target.value as MarcaAdmin['estado']})}
                        className={`w-full p-3.5 border-2 border-gray-200 rounded-xl font-bold text-sm outline-none focus:border-brand-brown/50 transition-colors cursor-pointer appearance-none ${marcaEnEdicion.estado === 'Activa' ? 'text-green-700' : marcaEnEdicion.estado === 'Inactiva' ? 'text-gray-600' : 'text-yellow-700'}`}
                    >
                        <option value="Activa">Activa (Pública)</option>
                        <option value="Pendiente">Pendiente (Revisión)</option>
                        <option value="Inactiva">Inactiva (Oculta)</option>
                    </select>
                </div>
                
                {modoDrawer === 'editar' && (
                    <div className="bg-brand-sky/10 p-4 rounded-xl flex items-center justify-between border border-brand-sky/20">
                        <span className="text-sm font-bold text-brand-navy">Productos Activos:</span>
                        <span className="text-lg font-black text-brand-brown">{marcaEnEdicion.totalProductos}</span>
                    </div>
                )}

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
                    onClick={handleGuardarMarca}
                    disabled={!marcaEnEdicion.nombre || !marcaEnEdicion.descripcion}
                    className="flex-1 py-4 rounded-xl font-black text-white bg-brand-brown hover:bg-brand-brownDark hover:-translate-y-1 hover:shadow-md transition-all active:scale-95 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none focus:outline-none"
                >
                    {modoDrawer === 'crear' ? 'Crear Marca' : 'Guardar'}
                </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}