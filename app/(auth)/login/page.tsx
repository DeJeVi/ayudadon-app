"use client";

import React, { useState } from 'react';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Datos listos para enviar:", formData);
  };

  return (
    <div className="w-full max-w-md flex flex-col items-center mx-auto">
      {/* Encabezado con logo integrado */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">
              Iniciar Sesión
            </h2>
            {/* Logo lateral de tamaño controlado */}
            <div className="w-10 h-10 flex-shrink-0">
              <img 
                src="/images/PNG_Minim_Don.png" 
                alt="Logo lateral" 
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          <p className="text-sm text-gray-500 font-medium">
            Bienvenido de vuelta a Ayudadón
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Campo: Correo */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1" htmlFor="email">
              Correo electrónico
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                <i className="fa-regular fa-envelope"></i>
              </span>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full py-3.5 pl-11 pr-4 border border-gray-200 rounded-xl text-gray-900 font-semibold focus:outline-none focus:border-amber-900 focus:ring-2 focus:ring-amber-900/20 transition-all bg-gray-50 focus:bg-white placeholder:text-gray-400 placeholder:font-normal"
                placeholder="tudireccionde@correo.com"
              />
            </div>
          </div>

          {/* Campo: Contraseña */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-bold text-gray-700" htmlFor="password">
                Contraseña
              </label>
              <a href="#" className="text-xs font-bold text-gray-400 hover:text-amber-900 transition-colors">
                ¿Olvidaste tu contraseña?
              </a>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                <i className="fa-solid fa-lock"></i>
              </span>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full py-3.5 pl-11 pr-12 border border-gray-200 rounded-xl text-gray-900 font-semibold focus:outline-none focus:border-amber-900 focus:ring-2 focus:ring-amber-900/20 transition-all bg-gray-50 focus:bg-white placeholder:text-gray-400 placeholder:font-normal"
                placeholder="••••••••"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-amber-900 transition-colors"
              >
                <i className={showPassword ? "fa-regular fa-eye-slash" : "fa-regular fa-eye"}></i>
              </button>
            </div>
          </div>

          {/* Botón Submit con el amarillo oficial */}
          <button
            type="submit"
            className="w-full mt-6 bg-[#d4a373] text-yello-400 font-black text-lg py-3.5 px-4 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:bg-amber-900 transition-all duration-300 active:scale-95"
          >
            Entrar
            
          </button>
        </form>

        <div className="my-8 flex items-center">
          <div className="flex-grow border-t border-gray-100"></div>
          <span className="mx-4 text-xs text-gray-400 font-bold uppercase tracking-wider">O</span>
          <div className="flex-grow border-t border-gray-100"></div>
        </div>

        <p className="text-center text-sm text-gray-500 font-medium">
          ¿Aún no tienes cuenta?{' '}
          {/* Enlace con el tono marrón oficial */}
          <a href="/registro" className="text-[#d4a373] hover:text-amber-900 font-black transition-colors">
            Regístrate
          </a>
        </p>
      </div>
  );
}