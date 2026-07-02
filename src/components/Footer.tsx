import React from 'react';
import Link from 'next/link';

/**
 * Footer global de Ayudadón.
 * Usado una sola vez en app/(client)/layout.tsx
 *
 * ─── REDES SOCIALES ──────────────────────────────────────────
 * Reemplaza los valores de SOCIAL_LINKS con tus URLs reales.
 */
const SOCIAL_LINKS = {
  facebook:  'https://www.facebook.com/share/1HLevNUBoz/?mibextid=wwXIfr',
  instagram: 'https://www.instagram.com/ayuda_don?igsh=eG1sbWc1dmViZGtm&utm_source=qr',
  whatsapp:  'https://wa.me/5559646034',
};

const NAV_LINKS = [
  { label: 'Sobre Ayudadón', href: '/sobre-nosotros' },
  { label: 'Contacto',       href: '/contacto' },
  { label: 'Devoluciones',   href: '/devoluciones' },
  { label: 'Políticas',      href: '/politicas' },
];

export default function Footer() {
  return (
    <footer className="relative z-0 bg-[#1e3a5f] text-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 md:py-14">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">

          {/* Logo + copyright */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="text-xl font-black text-white group-hover:text-[#d4a373] transition-colors duration-300">
                Ayudadón
              </span>
              <img
                src="/images/PNG_Minim_Don.png"
                alt="Logo Ayudadón"
                className="w-8 h-auto opacity-90 group-hover:opacity-100 transition-opacity"
              />
            </Link>
            <p className="text-xs text-white/50 font-medium">
              © {new Date().getFullYear()} Ayudadón. Todos los derechos reservados.
            </p>
          </div>

          {/* Links de navegación */}
          <nav aria-label="Links del footer">
            <ul className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2 text-sm font-medium text-white/70">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-[#d4a373] transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Redes sociales */}
          <div className="flex items-center gap-5 text-2xl text-white/70">
            <a
              href={SOCIAL_LINKS.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook de Ayudadón"
              className="hover:text-[#d4a373] hover:-translate-y-1 transition-all duration-200"
            >
              <i className="fa-brands fa-facebook" aria-hidden="true" />
            </a>
            <a
              href={SOCIAL_LINKS.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram de Ayudadón"
              className="hover:text-[#d4a373] hover:-translate-y-1 transition-all duration-200"
            >
              <i className="fa-brands fa-instagram" aria-hidden="true" />
            </a>
            <a
              href={SOCIAL_LINKS.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp de Ayudadón"
              className="hover:text-[#d4a373] hover:-translate-y-1 transition-all duration-200"
            >
              <i className="fa-brands fa-whatsapp" aria-hidden="true" />
            </a>
          </div>

        </div>
      </div>
    </footer>
  );
}