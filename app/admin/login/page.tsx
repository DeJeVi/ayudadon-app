"use client";

import React, { useState } from 'react';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Intento de acceso administrador:", email);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 selection:bg-brand-brown selection:text-white font-sans">

      {/* Contenedor principal */}
      <div className="w-full max-w-md relative z-10 animate-fadeUp">
        
        {/* Logo y Título */}
        <div className="text-center mb-8 flex flex-col items-center">
            <div className="flex items-center gap-2 text-3xl md:text-4xl font-black text-brand-navy mb-2 tracking-tight">
                Ayudadón
                <img src="/images/PNG_Minim_Don.png" alt="Mascota" className="w-10 h-auto drop-shadow-sm" />
            </div>
            <div className="inline-block bg-brand-navy text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2">
                Panel de Administración
            </div>
        </div>

        {/* Tarjeta del Formulario (Estilo limpio e-commerce) */}
        <div className="bg-white p-8 md:p-10 rounded-[2rem] shadow-card border border-gray-100">
            <form onSubmit={handleLogin} className="space-y-6">
                
                {/* Input Correo */}
                <div>
                    <label className="block text-sm font-bold text-brand-navy mb-2 ml-1" htmlFor="email">
                        Correo electrónico
                    </label>
                    <div className="relative group">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 group-focus-within:text-brand-brown transition-colors">
                            <i className="fa-solid fa-envelope"></i>
                        </span>
                        <input 
                            type="email" 
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full py-3.5 pl-12 pr-4 bg-gray-50 border border-gray-200 text-brand-navy font-bold rounded-2xl focus:outline-none focus:border-brand-brown focus:ring-2 focus:ring-brand-brown/20 transition-all placeholder-gray-400"
                            placeholder="admin@ayudadon.com"
                            required
                        />
                    </div>
                </div>

                {/* Input Contraseña */}
                <div>
                    <label className="block text-sm font-bold text-brand-navy mb-2 ml-1" htmlFor="password">
                        Contraseña
                    </label>
                    <div className="relative group">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 group-focus-within:text-brand-brown transition-colors">
                            <i className="fa-solid fa-lock"></i>
                        </span>
                        <input 
                            type="password" 
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full py-3.5 pl-12 pr-4 bg-gray-50 border border-gray-200 text-brand-navy font-bold rounded-2xl focus:outline-none focus:border-brand-brown focus:ring-2 focus:ring-brand-brown/20 transition-all placeholder-gray-400 tracking-widest placeholder:tracking-normal"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                </div>

                {/* Opciones extra */}
                <div className="flex items-center justify-between text-sm pt-2">
                    <label className="flex items-center text-gray-500 cursor-pointer hover:text-brand-navy transition-colors font-medium group">
                        <input type="checkbox" className="mr-2 accent-brand-brown w-4 h-4 cursor-pointer" />
                        <span className="group-hover:text-brand-navy transition-colors">Recordarme</span>
                    </label>
                    <a href="#" className="text-brand-brown hover:text-brand-brownDark font-bold transition-colors">¿Olvidaste tu acceso?</a>
                </div>

                {/* Botón de Submit */}
                <button 
                    type="submit" 
                    className="w-full bg-brand-brown text-white font-black text-lg py-4 px-4 rounded-full shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:bg-brand-brownDark transition-all duration-300 mt-4 active:scale-95"
                >
                    Iniciar Sesión
                </button>
            </form>
        </div>

        {/* Retorno a la tienda */}
        <div className="mt-8 text-center">
            <a href="/" className="inline-flex items-center justify-center gap-2 text-gray-500 hover:text-brand-brown text-sm font-bold transition-colors group">
                <i className="fa-solid fa-arrow-left group-hover:-translate-x-1 transition-transform"></i> 
                Volver a la tienda
            </a>
        </div>

      </div>
    </div>
  );
}