import React from 'react';
import Footer from '@/components/Footer';
import BrandsBanner from '@/components/BrandsBanner'; // Importamos el banner

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      
      <header className="bg-white py-4 px-6 shadow-sm flex justify-center border-b border-gray-200 sticky top-0 z-50">
        <div className="flex items-center gap-3 text-3xl font-black text-gray-900 tracking-tight">
          Ayudadón
          <img 
            src="/images/PNG_Minim_Don.png" 
            alt="Logo Ayudadón" 
            style={{ width: '45px', height: '45px', objectFit: 'contain' }}
            className="drop-shadow-sm"
          />
        </div>
      </header>

      {/* Contenido principal (Login o Registro) */}
      <main className="flex-grow flex items-center justify-center py-10 px-4 z-10">
        {children}
      </main>

      {/* Aquí colocamos el banner deslizante antes del footer */}
      <BrandsBanner />
      
      <Footer />
    </div>
  );
}