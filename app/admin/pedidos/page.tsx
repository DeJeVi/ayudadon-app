"use client";

import React, { useState, useEffect } from 'react';

// =========================================================================
// 1. INTERFACES (Contrato de Datos para el Backend)
// =========================================================================
export interface ProductoPedido {
  nombre: string;
  cant: number;
  precio: number;
}

export interface Pedido {
  id: string;
  cliente: string;
  fecha: string;
  total: number;
  estado: 'Completado' | 'En Proceso' | 'Pendiente' | 'Cancelado';
  productos: ProductoPedido[];
  direccion: string;
}

// =========================================================================
// 2. SIMULADOR DE API (El Backend Dev reemplazará esto)
// =========================================================================
const fetchPedidosData = async (): Promise<Pedido[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { 
            id: "PED-1025", cliente: "Juan Gómez", fecha: "18 Oct 2026", total: 1500, estado: "Completado", 
            productos: [{ nombre: "Manta de Lana", cant: 1, precio: 600 }, { nombre: "Cazuela de Barro", cant: 2, precio: 450 }], 
            direccion: "Calle 5 de Mayo, 123, Toluca" 
        },
        { 
            id: "PED-1026", cliente: "María Ruiz", fecha: "18 Oct 2026", total: 980, estado: "En Proceso", 
            productos: [{ nombre: "Salsa Toluca", cant: 2, precio: 190 }, { nombre: "Taza Artesanal", cant: 4, precio: 150 }], 
            direccion: "Av. Morelos, 45, Metepec" 
        },
        { 
            id: "PED-1027", cliente: "David Sosa", fecha: "17 Oct 2026", total: 2100, estado: "Pendiente", 
            productos: [{ nombre: "Tequila Añejo", cant: 1, precio: 2100 }], 
            direccion: "Col. Centro, 89, Zumpango" 
        },
      ]);
    }, 1000);
  });
};

export default function GestionPedidosPage() {
  // =========================================================================
  // 3. ESTADOS DEL COMPONENTE
  // =========================================================================
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estado para el Drawer
  const [selectedPedido, setSelectedPedido] = useState<Pedido | null>(null);
  const [nuevoEstado, setNuevoEstado] = useState<string>('');

  // =========================================================================
  // 4. EFECTO DE CARGA
  // =========================================================================
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        // TODO: BACKEND DEV -> Cambiar por: const response = await fetch('/api/admin/pedidos'); return await response.json();
        const data = await fetchPedidosData();
        setPedidos(data);
      } catch (err) {
        setError("Error al cargar los pedidos.");
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // Función para abrir el drawer y setear el estado actual
  const handleOpenDrawer = (pedido: Pedido) => {
    setSelectedPedido(pedido);
    setNuevoEstado(pedido.estado);
  };

  // Función simulada para guardar el nuevo estado
  const handleGuardarEstado = () => {
    if (!selectedPedido) return;
    
    // Actualizamos la lista local para que se vea el cambio inmediatamente
    const pedidosActualizados = pedidos.map(p => 
      p.id === selectedPedido.id ? { ...p, estado: nuevoEstado as Pedido['estado'] } : p
    );
    setPedidos(pedidosActualizados);
    
    // TODO: BACKEND DEV -> Aquí iría el fetch POST/PUT para actualizar en BD
    console.log(`Actualizando pedido ${selectedPedido.id} a estado: ${nuevoEstado}`);
    
    setSelectedPedido(null); // Cerrar drawer
  };

  // Utilidad para estilos de etiquetas (Pills)
  const getStatusStyle = (estado: string) => {
    switch (estado) {
      case 'Completado': return 'bg-green-100 text-green-800 border-green-200';
      case 'En Proceso': return 'bg-brand-yellow/20 text-yellow-800 border-brand-yellow/40';
      case 'Pendiente': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Cancelado': return 'bg-red-100 text-red-800 border-red-200';
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
            <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-brand-navy rounded-xl font-medium transition-all group">
              <i className="fa-solid fa-box w-5 text-center group-hover:scale-110 transition-transform"></i> Productos
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-brand-navy rounded-xl font-medium transition-all group">
              <i className="fa-solid fa-tag w-5 text-center group-hover:scale-110 transition-transform"></i> Marcas
            </a>
            <a href="/admin/pedidos" className="flex items-center gap-3 px-4 py-3 bg-brand-navy text-white rounded-xl font-bold shadow-card transition-all">
              <i className="fa-regular fa-file-lines w-5 text-center"></i> Pedidos
            </a>
          </nav>
        </div>
      </aside>

      {/* =========================================================
          CONTENEDOR PRINCIPAL
      ========================================================= */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-10 shadow-sm flex-shrink-0">
            <div className="w-full max-w-md relative hidden sm:block group">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 group-focus-within:text-brand-navy transition-colors">
                    <i className="fa-solid fa-magnifying-glass"></i>
                </span>
                <input 
                    type="text" 
                    placeholder="Buscar pedidos, clientes, estados..." 
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

        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 md:p-8">
            
            <h1 className="text-2xl md:text-3xl font-black text-brand-navy mb-8 animate-fadeUp">Gestión de Pedidos</h1>

            {/* ESTADO CARGANDO */}
            {isLoading && (
              <div className="bg-white rounded-[2rem] shadow-card border border-gray-100 p-8 h-96 animate-pulse"></div>
            )}

            {/* LISTA DE PEDIDOS */}
            {!isLoading && !error && (
              <div className="bg-white rounded-[2rem] shadow-card border border-gray-100 overflow-hidden animate-fadeUp">
                <div className="p-6 md:p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h2 className="text-lg font-bold text-gray-600 uppercase tracking-wider">Lista de Pedidos</h2>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="px-6 md:px-8 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">ID Pedido</th>
                        <th className="px-6 md:px-8 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Cliente</th>
                        <th className="px-6 md:px-8 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Fecha</th>
                        <th className="px-6 md:px-8 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Total (MXN)</th>
                        <th className="px-6 md:px-8 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Estado</th>
                        <th className="px-6 md:px-8 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {pedidos.map((p) => (
                        <tr key={p.id} className="hover:bg-gray-50/80 transition-colors group">
                          <td className="px-6 md:px-8 py-4 text-sm font-bold text-brand-navy whitespace-nowrap">{p.id}</td>
                          <td className="px-6 md:px-8 py-4 text-sm text-gray-600">{p.cliente}</td>
                          <td className="px-6 md:px-8 py-4 text-sm text-gray-500 whitespace-nowrap">{p.fecha}</td>
                          <td className="px-6 md:px-8 py-4 text-sm font-bold text-brand-brown whitespace-nowrap">${p.total.toLocaleString('es-MX')}</td>
                          <td className="px-6 md:px-8 py-4 whitespace-nowrap">
                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full border ${getStatusStyle(p.estado)}`}>
                              {p.estado}
                            </span>
                          </td>
                          <td className="px-6 md:px-8 py-4 whitespace-nowrap text-center">
                            <button 
                                onClick={() => handleOpenDrawer(p)} 
                                className="bg-brand-brown hover:bg-brand-brownDark text-white text-xs font-bold py-2 px-4 rounded-lg shadow-sm hover:shadow active:scale-95 transition-all"
                            >
                              Ver Detalle
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Paginación visual (Mock) */}
                <div className="p-4 border-t border-gray-100 flex justify-center text-gray-500 text-sm gap-2 font-bold">
                    <button className="hover:text-brand-brown"><i className="fa-solid fa-angles-left"></i></button>
                    <button className="hover:text-brand-brown"><i className="fa-solid fa-angle-left"></i></button>
                    <button className="bg-brand-yellow text-brand-navy px-3 py-1 rounded-md">1</button>
                    <button className="hover:bg-gray-100 px-3 py-1 rounded-md transition-colors">2</button>
                    <button className="hover:bg-gray-100 px-3 py-1 rounded-md transition-colors">3</button>
                    <button className="hover:text-brand-brown"><i className="fa-solid fa-angle-right"></i></button>
                    <button className="hover:text-brand-brown"><i className="fa-solid fa-angles-right"></i></button>
                </div>
              </div>
            )}
        </main>
      </div>

      {/* =========================================================
          DRAWER LATERAL (Detalle del Pedido)
      ========================================================= */}
      {selectedPedido && (
        <div 
            className="fixed inset-0 bg-brand-navy/40 backdrop-blur-sm z-50 flex justify-end animate-fadeUp" 
            style={{ animationDuration: '0.2s' }}
            onClick={() => setSelectedPedido(null)}
        >
          <div 
            className="w-full max-w-md bg-white h-full shadow-2xl p-6 md:p-8 overflow-y-auto animate-fadeUp border-l border-gray-200 flex flex-col" 
            style={{ animationDuration: '0.3s' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header del Drawer */}
            <div className="flex justify-between items-start mb-8 pb-4 border-b border-gray-100">
              <div>
                  <h2 className="text-xl font-black text-brand-navy uppercase tracking-tight">Detalle del Pedido</h2>
                  <p className="text-brand-brown font-bold text-lg">{selectedPedido.id}</p>
              </div>
              <button 
                  onClick={() => setSelectedPedido(null)} 
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-red-100 hover:text-red-500 transition-colors"
              >
                  <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>

            {/* Info Resumen */}
            <div className="text-sm mb-8 space-y-2 bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <p className="flex justify-between"><span className="font-bold text-brand-navy">Cliente:</span> <span className="text-gray-600">{selectedPedido.cliente}</span></p>
              <p className="flex justify-between"><span className="font-bold text-brand-navy">Fecha:</span> <span className="text-gray-600">{selectedPedido.fecha}</span></p>
              <p className="flex justify-between pt-2 border-t border-gray-200 mt-2"><span className="font-black text-brand-navy">Total Pagado:</span> <span className="font-black text-brand-brown text-lg">${selectedPedido.total.toLocaleString('es-MX')} MXN</span></p>
            </div>

            {/* Productos */}
            <div className="mb-8">
              <h4 className="font-bold text-brand-navy mb-4 text-xs uppercase tracking-wider">Productos Comprados</h4>
              
              <table className="w-full text-sm text-left border-collapse">
                  <thead>
                      <tr className="border-b border-gray-200 text-xs text-gray-500">
                          <th className="pb-2 font-bold">Producto</th>
                          <th className="pb-2 font-bold text-center">Cant.</th>
                          <th className="pb-2 font-bold text-right">Subtotal</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                      {selectedPedido.productos.map((prod, i) => (
                        <tr key={i}>
                            <td className="py-3 text-gray-800 font-medium pr-2">{prod.nombre}</td>
                            <td className="py-3 text-gray-600 text-center">{prod.cant}x</td>
                            <td className="py-3 font-bold text-brand-navy text-right">${(prod.cant * prod.precio).toLocaleString('es-MX')}</td>
                        </tr>
                      ))}
                  </tbody>
              </table>
              <div className="font-black text-right mt-4 text-brand-navy text-lg flex justify-between items-center bg-brand-sky/10 p-3 rounded-xl">
                  <span className="text-sm uppercase text-brand-navyLight">Total:</span>
                  ${selectedPedido.total.toLocaleString('es-MX')} MXN
              </div>
            </div>

            {/* Datos de Envío */}
            <div className="mb-8">
              <h4 className="font-bold text-brand-navy mb-3 text-xs uppercase tracking-wider">Datos de Envío</h4>
              <div className="flex gap-3 text-sm text-gray-600 bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
                  <i className="fa-solid fa-location-dot mt-1 text-brand-brown"></i>
                  <div>
                      <p className="font-bold text-brand-navy mb-1">Dirección de entrega:</p>
                      <p>{selectedPedido.direccion}</p>
                      <p className="mt-2 text-xs font-bold text-brand-sky"><i className="fa-solid fa-truck-fast mr-1"></i> Método: Envíos Ayudadón</p>
                  </div>
              </div>
            </div>

            {/* Cambio de Estado */}
            <div className="mt-auto pt-6 border-t border-gray-100">
              <h4 className="font-bold text-brand-navy mb-3 text-xs uppercase tracking-wider">Estado del Pedido</h4>
              <div className="flex flex-col gap-3">
                  <select 
                      value={nuevoEstado}
                      onChange={(e) => setNuevoEstado(e.target.value)}
                      className={`w-full p-3.5 border-2 rounded-xl font-bold text-sm outline-none transition-colors cursor-pointer appearance-none ${getStatusStyle(nuevoEstado)}`}
                  >
                    <option value="Completado">Completado</option>
                    <option value="En Proceso">En Proceso</option>
                    <option value="Pendiente">Pendiente</option>
                    <option value="Cancelado">Cancelado</option>
                  </select>
                  
                  {/* Botón Guardar - Solo se habilita si el estado cambió */}
                  <button 
                      onClick={handleGuardarEstado}
                      disabled={nuevoEstado === selectedPedido.estado}
                      className={`w-full py-4 rounded-xl font-black text-white transition-all shadow-sm ${nuevoEstado === selectedPedido.estado ? 'bg-gray-300 cursor-not-allowed' : 'bg-brand-navy hover:bg-brand-navyLight hover:-translate-y-1 hover:shadow-md active:scale-95'}`}
                  >
                      {nuevoEstado === selectedPedido.estado ? 'Sin cambios' : 'Guardar Estado'}
                  </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}