import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Ayudadón',
    template: '%s | Ayudadón',
  },
  description: 'Tu plataforma de confianza para compras locales y emprendimientos mexicanos.',
};

/**
 * Layout RAÍZ — solo provee el shell HTML.
 * NO incluye Header ni Footer aquí:
 *   - Las páginas de cliente los obtienen de app/(client)/layout.tsx
 *   - Las páginas de auth tienen su propio layout centrado
 *   - admin/login tiene su propio layout
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
          crossOrigin="anonymous"
        />
      </head>
      <body className="antialiased text-gray-900 bg-gray-50">
        {children}
      </body>
    </html>
  );
}
