"use client";

import React, { useState, useEffect } from 'react';

// =========================================================================
// 1. INTERFACES (Contrato de Datos para el Backend)
// =========================================================================
export interface MetricasDashboard {
  totalProductos: number;
  marcasActivas: number;
  pedidosMes: number;
  ingresosMes: number;
}

export interface PedidoReciente {
  id: string;
  cliente: string;
  fecha: string;
  total: number;
  estado: 'Completado' | 'En Proceso' | 'Pendiente' | 'Cancelado';
}

export interface DashboardResponse {
  metricas: MetricasDashboard;
  pedidos: PedidoReciente[];
}

// =========================================================================
// 2. SIMULADOR DE API (El Backend Dev reemplazará esto)
// =========================================================================
const fetchDashboardData = async (): Promise<DashboardResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        metricas: {
          totalProductos: 258,
          marcasActivas: 32,
          pedidosMes: 187,
          ingresosMes: 48900,
        },
        pedidos: [
          { id: "PED-1025", cliente: "Juan Gómez", fecha: "18 Oct 2026", total: 1500, estado: "Completado" },
          { id: "PED-1026", cliente: "María Ruiz", fecha: "18 Oct 2026", total: 980, estado: "En Proceso" },
          { id: "PED-1027", cliente: "David Sosa", fecha: "17 Oct 2026", total: 2100, estado: "Pendiente" },
          { id: "PED-1028", cliente: "Juan Gómez", fecha: "18 Oct 2026", total: 1500, estado: "Completado" },
          { id: "PED-1029", cliente: "María Ruiz", fecha: "18 Oct 2026", total: 980, estado: "En Proceso" },
        ]
      });
    }, 1000);
  });
};

export default function AdminDashboardPage() {
  // =========================================================================
  // 3. ESTADOS DEL COMPONENTE
  // =========================================================================
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // =========================================================================
  // 4. EFECTO DE CARGA
  // =========================================================================
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        // TODO: BACKEND DEV -> Cambiar fetchDashboardData() por la llamada real
        const result = await fetchDashboardData(); 
        setData(result);
      } catch (err) {
        console.error("Error al cargar el dashboard:", err);
        setError("Ocurrió un error al intentar conectar con el servidor.");
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // Utilidad para estilos de la tabla
  const getStatusStyle = (estado: PedidoReciente['estado']) => {
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
          OVERLAY MÓVIL (Fondo oscuro al abrir menú)
      ========================================================= */}
      {isMobileMenuOpen && (
        <div 
            className="fixed inset-0 bg-brand-navy/40 backdrop-blur-sm z-40 md:hidden animate-fadeUp"
            style={{ animationDuration: '0.2s' }}
            onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* =========================================================
          SIDEBAR (Responsivo)
      ========================================================= */}
      <aside className={`fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 flex flex-col z-50 transform transition-transform duration-300 md:relative md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} shadow-2xl md:shadow-none`}>
        <div className="flex-1 flex flex-col">
          
          <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100 cursor-pointer">
            <div className="flex items-center gap-2">
                <img src="/images/PNG_Minim_Don.png" alt="Mascota" className="w-8 h-8 drop-shadow-sm" />
                <span className="text-xl font-black text-brand-navy tracking-tight">Ayudadón</span>
            </div>
            {/* Botón cerrar en móvil */}
            <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden text-gray-400 hover:text-red-500 text-2xl">
                &times;
            </button>
          </div>

          <nav className="flex flex-col gap-2 p-4">
            <a href="/admin/dashboard" className="flex items-center gap-3 px-4 py-3 bg-brand-navy text-white rounded-xl font-bold shadow-card transition-all">
              <i className="fa-solid fa-house w-5 text-center"></i> Dashboard
            </a>
            <a href="/admin/productos" className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-brand-navy rounded-xl font-medium transition-all group">
              <i className="fa-solid fa-box w-5 text-center group-hover:scale-110 transition-transform"></i> Productos
            </a>
            <a href="/admin/marcas" className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-brand-navy rounded-xl font-medium transition-all group">
              <i className="fa-solid fa-tag w-5 text-center group-hover:scale-110 transition-transform"></i> Marcas
            </a>
            <a href="/admin/pedidos" className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-brand-navy rounded-xl font-medium transition-all group">
              <i className="fa-regular fa-file-lines w-5 text-center group-hover:scale-110 transition-transform"></i> Pedidos
            </a>
          </nav>
        </div>

        <div className="p-6 flex flex-col items-center border-t border-gray-100">
            <img src="/images/PNG_Don.png" alt="Ayudadón" className="w-16 h-auto opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300" />
            <span className="text-xs text-gray-400 font-medium mt-2">v 1.0.0</span>
        </div>
      </aside>

      {/* =========================================================
          CONTENEDOR PRINCIPAL
      ========================================================= */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* HEADER */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6 z-10 shadow-sm flex-shrink-0">
            
            <div className="flex items-center gap-4">
                {/* Menú Hamburguesa Móvil */}
                <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden text-gray-500 hover:text-brand-navy focus:outline-none">
                    <i className="fa-solid fa-bars text-xl"></i>
                </button>

                {/* Buscador */}
                <div className="w-full max-w-md relative hidden sm:block group">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 group-focus-within:text-brand-navy transition-colors">
                        <i className="fa-solid fa-magnifying-glass"></i>
                    </span>
                    <input 
                        type="text" 
                        placeholder="Buscar en el panel..." 
                        className="w-full py-2 pl-10 pr-4 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:border-brand-navy focus:ring-1 focus:ring-brand-navy/20 transition-all"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4 ml-auto">
                <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                    <i className="fa-regular fa-circle-user text-xl text-gray-400 hidden sm:block"></i>
                    <span className="hidden sm:inline">Admin: <strong className="text-brand-navy">Elena R.</strong></span>
                    <span className="text-gray-300 mx-1 hidden sm:inline">|</span>
                    <a href="/admin/login" className="text-gray-400 hover:text-red-500 transition-colors font-bold" title="Cerrar sesión">
                        <i className="fa-solid fa-right-from-bracket text-lg sm:text-sm"></i> <span className="hidden sm:inline">Salir</span>
                    </a>
                </div>
            </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#F5F5F7] p-4 sm:p-6 md:p-8">
            
            <h1 className="text-2xl md:text-3xl font-black text-brand-navy tracking-tight mb-6 md:mb-8 animate-fadeUp">
                Panel Principal
            </h1>

            {/* ESTADO 1: CARGANDO */}
            {isLoading && (
              <div className="animate-pulse">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-gray-200 h-24 rounded-2xl"></div>
                  ))}
                </div>
                <div className="bg-gray-200 h-96 rounded-[2rem]"></div>
              </div>
            )}

            {/* ESTADO 2: ERROR */}
            {!isLoading && error && (
              <div className="bg-red-50 border border-red-200 text-red-800 rounded-2xl p-6 flex flex-col items-center justify-center text-center animate-fadeUp">
                <i className="fa-solid fa-triangle-exclamation text-4xl mb-4 text-red-400"></i>
                <h3 className="font-bold text-lg mb-2">Error de conexión</h3>
                <p>{error}</p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="mt-4 bg-red-100 hover:bg-red-200 text-red-800 font-bold py-2 px-6 rounded-full transition-colors"
                >
                  Reintentar
                </button>
              </div>
            )}

            {/* ESTADO 3: DATA EXITOSA */}
            {!isLoading && !error && data && (
              <div className="animate-fadeUp">
                
                {/* TARJETAS DE MÉTRICAS (Íconos Limpios FontAwesome) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6 mb-8">
                    
                    {/* Tarjeta 1 - Productos */}
                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-card transition-all flex items-center gap-4 group">
                        <div className="w-14 h-14 rounded-xl bg-brand-sky/10 flex items-center justify-center text-xl text-brand-sky flex-shrink-0 group-hover:scale-110 transition-transform">
                            <i className="fa-solid fa-cube"></i>
                        </div>
                        <div>
                            <p className="text-gray-500 font-medium text-xs uppercase tracking-wider mb-1">Productos</p>
                            <p className="text-2xl font-black text-brand-navy leading-none">{data.metricas.totalProductos}</p>
                        </div>
                    </div>

                    {/* Tarjeta 2 - Marcas */}
                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-card transition-all flex items-center gap-4 group">
                        <div className="w-14 h-14 rounded-xl bg-brand-yellow/10 flex items-center justify-center text-xl text-brand-yellow flex-shrink-0 group-hover:scale-110 transition-transform">
                            <i className="fa-solid fa-store"></i>
                        </div>
                        <div>
                            <p className="text-gray-500 font-medium text-xs uppercase tracking-wider mb-1">Marcas Activas</p>
                            <p className="text-2xl font-black text-brand-navy leading-none">{data.metricas.marcasActivas}</p>
                        </div>
                    </div>

                    {/* Tarjeta 3 - Pedidos */}
                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-card transition-all flex items-center gap-4 group">
                        <div className="w-14 h-14 rounded-xl bg-brand-brown/10 flex items-center justify-center text-xl text-brand-brown flex-shrink-0 group-hover:scale-110 transition-transform">
                            <i className="fa-solid fa-receipt"></i>
                        </div>
                        <div>
                            <p className="text-gray-500 font-medium text-xs uppercase tracking-wider mb-1">Pedidos del Mes</p>
                            <p className="text-2xl font-black text-brand-navy leading-none">{data.metricas.pedidosMes}</p>
                        </div>
                    </div>

                    {/* Tarjeta 4 - Ingresos */}
                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-card transition-all flex items-center gap-4 group">
                        <div className="w-14 h-14 rounded-xl bg-green-50 flex items-center justify-center text-xl text-green-600 flex-shrink-0 group-hover:scale-110 transition-transform">
                            <i className="fa-solid fa-chart-line"></i>
                        </div>
                        <div>
                            <p className="text-gray-500 font-medium text-xs uppercase tracking-wider mb-1">Ingresos (MXN)</p>
                            <p className="text-2xl font-black text-brand-navy leading-none">${data.metricas.ingresosMes.toLocaleString('es-MX')}</p>
                        </div>
                    </div>

                </div>

                {/* TABLA DE PEDIDOS */}
                <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 md:p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
                        <h2 className="text-lg md:text-xl font-bold text-brand-navy">Pedidos Recientes</h2>
                        <a href="/admin/pedidos" className="text-brand-brown hover:text-brand-brownDark font-bold text-sm transition-colors flex items-center gap-1">
                            Ver todos <i className="fa-solid fa-arrow-right"></i>
                        </a>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="px-6 md:px-8 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">ID Pedido</th>
                                    <th className="px-6 md:px-8 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Cliente</th>
                                    <th className="px-6 md:px-8 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Fecha</th>
                                    <th className="px-6 md:px-8 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Total</th>
                                    <th className="px-6 md:px-8 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider hidden md:table-cell">Estado</th>
                                    <th className="px-6 md:px-8 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {data.pedidos.map((pedido) => (
                                    <tr key={pedido.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-6 md:px-8 py-4 text-sm font-bold text-brand-navy whitespace-nowrap">{pedido.id}</td>
                                        <td className="px-6 md:px-8 py-4 text-sm text-gray-600">{pedido.cliente}</td>
                                        <td className="px-6 md:px-8 py-4 text-sm text-gray-500 whitespace-nowrap hidden sm:table-cell">{pedido.fecha}</td>
                                        <td className="px-6 md:px-8 py-4 text-sm font-black text-brand-brown whitespace-nowrap">${pedido.total.toLocaleString('es-MX')}</td>
                                        <td className="px-6 md:px-8 py-4 whitespace-nowrap hidden md:table-cell">
                                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full border ${getStatusStyle(pedido.estado)}`}>
                                                {pedido.estado}
                                            </span>
                                        </td>
                                        <td className="px-6 md:px-8 py-4 whitespace-nowrap text-center">
                                            <a 
                                                href={`/admin/pedidos/${pedido.id}`}
                                                className="inline-block bg-gray-100 hover:bg-brand-brown text-gray-600 hover:text-white text-xs font-bold py-2 px-4 rounded-lg transition-all"
                                            >
                                                Detalle
                                            </a>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

              </div>
            )}

        </main>
      </div>
    </div>
  );
}