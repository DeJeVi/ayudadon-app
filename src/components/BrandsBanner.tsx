import React from 'react';

export default function BrandsBanner() {
  // Arreglo con las rutas de tus imágenes reales
  // Cambia los nombres de los archivos por los que tú guardaste en la carpeta public/marcas/
   const brands = [
    { name: 'Casa', src: '/marcas/Casa Julio César.png' },
    { name: 'ITP', src: '/marcas/ITP Mobiliario.png' },
    { name: 'Loan', src: '/marcas/Loan arte.png' },
    { name: 'ORO', src: '/marcas/Oro negro.png' },
    { name: 'Vitralma', src: '/marcas/Vitralma.png' },
    { name: 'Peyote', src: '/marcas/Peyote Leather.png' },
  ];

  // Duplicamos para el efecto de carrusel infinito suave
  const duplicatedBrands = [...brands, ...brands, ...brands];

  return (
    <div className="w-full bg-gray-50 overflow-hidden py-8">
      <div className="max-w-7xl mx-auto px-4 mb-6 text-center">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
          Marcas de nuestro catálogo
        </p>
      </div>
      
      <div className="relative w-full flex">
        <div className="flex w-max animate-scroll items-center">
          {duplicatedBrands.map((brand, index) => (
            <div 
              key={index} 
              className="flex-shrink-0 mx-8 md:mx-16 flex items-center justify-center"
            >
              <img 
                src={brand.src} 
                alt={`Logo de ${brand.name}`}
                /* 
                  Aquí ocurre la magia de CSS:
                  - h-10 u h-12 controla el alto (para que todos se vean uniformes).
                  - object-contain evita que se deformen.
                  - grayscale y opacity-50 los apaga.
                  - hover:grayscale-0 y hover:opacity-100 les devuelve el color original al tocarlos.
                */
                className="h-20 md:h-24 w-auto object-contain grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-500 cursor-pointer drop-shadow-sm"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}