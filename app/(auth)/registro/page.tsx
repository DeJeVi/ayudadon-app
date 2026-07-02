"use client";

import React, { useState } from 'react';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    nombre: '',
    paterno: '',
    materno: '',
    telefono: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let { name, value } = e.target;

    // Validación: Nombres y Apellidos (Solo letras, minúsculas)
    if (name === 'nombre' || name === 'paterno' || name === 'materno') {
      value = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '').toLowerCase();
    }
    // Validación: Teléfono (Solo números, max 10)
    if (name === 'telefono') {
      value = value.replace(/[^0-9]/g, '').slice(0, 10);
    }
    // Validación: Correo (Minúsculas)
    if (name === 'email') {
      value = value.toLowerCase();
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    console.log("Datos listos para enviar:", formData);
  };

  return (
    <div className="w-full max-w-md flex flex-col items-center mx-auto">
      <div className="w-full bg-white rounded-[2rem] shadow-md border border-gray-100 p-6 md:p-10 relative z-10">
        
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">Crear cuenta</h2>
            <div className="w-10 h-10 flex-shrink-0">
              <img src="/images/PNG_Minim_Don.png" alt="Logo" className="w-full h-full object-contain" />
            </div>
          </div>
          <p className="text-sm text-gray-500 font-medium">Únete a la comunidad de Ayudadón</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Nombre(s)</label>
            <input name="nombre" type="text" required value={formData.nombre} onChange={handleChange} className="w-full py-3 px-4 border border-gray-200 rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-amber-900/20" placeholder="Nombre(s)" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">A. Paterno</label>
              <input name="paterno" type="text" required value={formData.paterno} onChange={handleChange} className="w-full py-3 px-4 border border-gray-200 rounded-xl bg-gray-50 outline-none" placeholder="Paterno" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">A. Materno</label>
              <input name="materno" type="text" required value={formData.materno} onChange={handleChange} className="w-full py-3 px-4 border border-gray-200 rounded-xl bg-gray-50 outline-none" placeholder="Materno" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Teléfono</label>
            <input name="telefono" type="tel" required value={formData.telefono} onChange={handleChange} className="w-full py-3 px-4 border border-gray-200 rounded-xl bg-gray-50 outline-none" placeholder="10 dígitos" />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Correo electrónico</label>
            <input name="email" type="email" required value={formData.email} onChange={handleChange} className="w-full py-3 px-4 border border-gray-200 rounded-xl bg-gray-50 outline-none" placeholder="tu@correo.com" />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Contraseña</label>
            <input name="password" type="password" required value={formData.password} onChange={handleChange} 
            className="w-full py-3.5 pl-11 pr-12 border border-gray-200 rounded-xl text-gray-900 font-semibold focus:outline-none focus:border-amber-900 focus:ring-2 focus:ring-amber-900/20 transition-all bg-gray-50 focus:bg-white placeholder:text-gray-400 placeholder:font-normal"
            placeholder="••••••••" />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Confirmar contraseña</label>
            <input name="confirmPassword" type="password" required value={formData.confirmPassword} onChange={handleChange}                
             className="w-full py-3.5 pl-11 pr-12 border border-gray-200 rounded-xl text-gray-900 font-semibold focus:outline-none focus:border-amber-900 focus:ring-2 focus:ring-amber-900/20 transition-all bg-gray-50 focus:bg-white placeholder:text-gray-400 placeholder:font-normal"
             placeholder="••••••••" />
            {error && <p className="text-red-500 text-xs font-bold mt-1">{error}</p>}
          </div>

          <button type="submit" className="w-full mt-6 bg-[#d4a373] text-yello-400 font-black text-lg py-3.5 px-4 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:bg-amber-900 transition-all duration-300 active:scale-95">
            Registrarme
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 font-medium mt-8">
          ¿Ya tienes cuenta? <a href="/login" className="text-[#d4a373] hover:text-amber-900 font-black">Inicia sesión</a>
        </p>
      </div>
    </div>
  );
}