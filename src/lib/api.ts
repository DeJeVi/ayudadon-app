import type { Marca, Producto, HeroSlide, CartItem, DireccionEnvio } from '@/types/api';

/**
 * ============================================================
 * CAPA DE DATOS — PUNTO ÚNICO DE CONEXIÓN CON EL BACKEND
 * ============================================================
 *
 * INSTRUCCIONES PARA EL ENCARGADO DEL BACKEND:
 *
 * Cada función de abajo tiene dos partes:
 *   1. Los datos MOCK (lo que se usa ahora para la previsualización)
 *   2. Una sección comentada con el fetch real, ya escrita y lista
 *
 * Para conectar tu API real:
 *   - Descomenta el bloque "BACKEND REAL"
 *   - Borra o comenta el bloque "MOCK"
 *   - Ajusta la URL si tu endpoint se llama distinto
 *   - Asegúrate que tu API devuelva exactamente el shape definido
 *     en /types/api.ts (Marca, Producto, HeroSlide)
 *
 * No es necesario tocar ningún componente visual (HomePage, BrandCard,
 * ProductCard, etc.) — todos consumen estas funciones, no la fuente
 * de datos directamente. Eso significa que el día que conectes el
 * backend real, el resto del sitio sigue funcionando sin cambios.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

// ─────────────────────────────────────────────────────────────
// MARCAS
// ─────────────────────────────────────────────────────────────
export async function getMarcas(): Promise<Marca[]> {

  // ─── MOCK (borrar cuando el backend esté listo) ───
  return MOCK_MARCAS;

  // ─── BACKEND REAL (descomentar y usar) ───
  // const res = await fetch(`${API_BASE_URL}/marcas`, {
  //   cache: 'no-store', // o 'force-cache' / revalidate según tu estrategia
  // });
  // if (!res.ok) throw new Error('Error al obtener marcas');
  // const data: { marcas: Marca[] } = await res.json();
  // return data.marcas;
}

export async function getMarcaBySlug(slug: string): Promise<Marca | null> {

  // ─── MOCK ───
  return MOCK_MARCAS.find((m) => m.slug === slug) ?? null;

  // ─── BACKEND REAL ───
  // const res = await fetch(`${API_BASE_URL}/marcas/${slug}`, { cache: 'no-store' });
  // if (res.status === 404) return null;
  // if (!res.ok) throw new Error('Error al obtener la marca');
  // return res.json();
}

// ─────────────────────────────────────────────────────────────
// PRODUCTOS
// ─────────────────────────────────────────────────────────────
export async function getProductosDestacados(): Promise<Producto[]> {

  // ─── MOCK ───
  return MOCK_PRODUCTOS;

  // ─── BACKEND REAL ───
  // const res = await fetch(`${API_BASE_URL}/productos?featured=true`, { cache: 'no-store' });
  // if (!res.ok) throw new Error('Error al obtener productos destacados');
  // const data: { productos: Producto[] } = await res.json();
  // return data.productos;
}

export async function getProductosByMarca(marcaId: string): Promise<Producto[]> {

  // ─── MOCK ───
  return MOCK_PRODUCTOS.filter((p) => p.marcaId === marcaId);

  // ─── BACKEND REAL ───
  // const res = await fetch(`${API_BASE_URL}/productos?marcaId=${marcaId}`, { cache: 'no-store' });
  // if (!res.ok) throw new Error('Error al obtener productos de la marca');
  // const data: { productos: Producto[] } = await res.json();
  // return data.productos;
}

export async function getProductoBySlug(slug: string): Promise<Producto | null> {

  // ─── MOCK ───
  return MOCK_PRODUCTOS.find((p) => p.slug === slug) ?? null;

  // ─── BACKEND REAL ───
  // const res = await fetch(`${API_BASE_URL}/productos/${slug}`, { cache: 'no-store' });
  // if (res.status === 404) return null;
  // if (!res.ok) throw new Error('Error al obtener el producto');
  // return res.json();
}

export async function getProductosRelacionados(productoId: string, marcaId: string): Promise<Producto[]> {

  // ─── MOCK ───
  return MOCK_PRODUCTOS.filter((p) => p.marcaId === marcaId && p.id !== productoId);

  // ─── BACKEND REAL ───
  // const res = await fetch(`${API_BASE_URL}/productos/${productoId}/relacionados`, { cache: 'no-store' });
  // if (!res.ok) throw new Error('Error al obtener productos relacionados');
  // const data: { productos: Producto[] } = await res.json();
  // return data.productos;
}

// ─────────────────────────────────────────────────────────────
// HERO SLIDES
// ─────────────────────────────────────────────────────────────
export async function getHeroSlides(): Promise<HeroSlide[]> {

  // ─── MOCK ───
  return MOCK_HERO_SLIDES;

  // ─── BACKEND REAL ───
  // const res = await fetch(`${API_BASE_URL}/hero-slides`, { cache: 'no-store' });
  // if (!res.ok) throw new Error('Error al obtener slides del hero');
  // const data: { slides: HeroSlide[] } = await res.json();
  // return data.slides;
}

// ─────────────────────────────────────────────────────────────
// CARRITO
// ─────────────────────────────────────────────────────────────
export async function getCarrito(): Promise<{ items: CartItem[]; subtotal: number; envio: number; total: number }> {

  // ─── MOCK ───
  const subtotal = MOCK_CARRITO.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const envio = 0; // envío gratis simulado
  return { items: MOCK_CARRITO, subtotal, envio, total: subtotal + envio };

  // ─── BACKEND REAL ───
  // const res = await fetch(`${API_BASE_URL}/carrito`, { cache: 'no-store', credentials: 'include' });
  // if (!res.ok) throw new Error('Error al obtener el carrito');
  // return res.json();
}

export async function getDireccionGuardada(): Promise<DireccionEnvio | null> {

  // ─── MOCK ───
  return MOCK_DIRECCION;

  // ─── BACKEND REAL ───
  // const res = await fetch(`${API_BASE_URL}/direccion`, { cache: 'no-store', credentials: 'include' });
  // if (res.status === 404) return null;
  // if (!res.ok) throw new Error('Error al obtener la dirección guardada');
  // return res.json();
}

/** Actualiza la cantidad de un item del carrito. Devuelve el carrito completo recalculado. */
export async function updateCantidadCarrito(
  itemId: string,
  quantity: number
): Promise<{ items: CartItem[]; subtotal: number; envio: number; total: number }> {

  // ─── MOCK — muta el array en memoria, simulando una respuesta de servidor ───
  const item = MOCK_CARRITO.find((i) => i.id === itemId);
  if (item) item.quantity = Math.max(1, quantity);
  return getCarrito();

  // ─── BACKEND REAL ───
  // const res = await fetch(`${API_BASE_URL}/carrito/${itemId}`, {
  //   method: 'PATCH',
  //   headers: { 'Content-Type': 'application/json' },
  //   credentials: 'include',
  //   body: JSON.stringify({ quantity }),
  // });
  // if (!res.ok) throw new Error('Error al actualizar la cantidad');
  // return res.json();
}

/** Elimina un item del carrito. Devuelve el carrito completo recalculado. */
export async function eliminarDelCarrito(
  itemId: string
): Promise<{ items: CartItem[]; subtotal: number; envio: number; total: number }> {

  // ─── MOCK ───
  const idx = MOCK_CARRITO.findIndex((i) => i.id === itemId);
  if (idx !== -1) MOCK_CARRITO.splice(idx, 1);
  return getCarrito();

  // ─── BACKEND REAL ───
  // const res = await fetch(`${API_BASE_URL}/carrito/${itemId}`, {
  //   method: 'DELETE',
  //   credentials: 'include',
  // });
  // if (!res.ok) throw new Error('Error al eliminar el producto del carrito');
  // return res.json();
}

/** Simula el procesamiento del pago. En producción aquí se llamaría al SDK de Mercado Pago o a tu endpoint propio. */
export async function procesarPago(payload: {
  numeroTarjeta: string;
  vencimiento: string;
  cvc: string;
  titular: string;
}): Promise<{ success: boolean; numeroOrden: string }> {

  // ─── MOCK — simula latencia de red y siempre aprueba ───
  await new Promise((resolve) => setTimeout(resolve, 1500));
  return { success: true, numeroOrden: `AYD-${Math.floor(100000 + Math.random() * 900000)}` };

  // ─── BACKEND REAL ───
  // const res = await fetch(`${API_BASE_URL}/pagos`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   credentials: 'include',
  //   body: JSON.stringify(payload),
  // });
  // if (!res.ok) throw new Error('Error al procesar el pago');
  // return res.json();
}


/* ================================================================
   DATOS MOCK — usados SOLO para previsualización mientras no
   hay backend conectado. El encargado del backend puede usar
   esta misma estructura como referencia de qué insertar en la BD.
   ================================================================ */

const MOCK_CARRITO: CartItem[] = [
  { id: 'ci1', productoId: 'p1', name: 'Cazuela Barro 1', price: 800, imageUrl: null, quantity: 1 },
  { id: 'ci2', productoId: 'p2', name: 'Cazuela Barro 2', price: 800, imageUrl: null, quantity: 1 },
  { id: 'ci3', productoId: 'p4', name: 'Tequila Artesanal Añejo', price: 45, imageUrl: null, quantity: 2 },
];

const MOCK_DIRECCION: DireccionEnvio = {
  nombreCompleto: 'Justin Mason',
  calle: 'Calle Falsa 123, Colonia Centro',
  colonia: 'Centro',
  ciudad: 'Zumpango',
  codigoPostal: '55614',
  telefono: '555-123-4567',
  guardarParaElFuturo: true,
};

const MOCK_MARCAS: Marca[] = [
  { id: '1', slug: 'casa-julio-cesar',  name: 'Casa Julio César', logoUrl: '/marcas/Casa Julio César.png', description: 'Artículos y algo más para el hogar',                 category: 'Hogar',      isActive: true, displayOrder: 1 },
  { id: '2', slug: 'itp-mobiliario',    name: 'ITP Mobiliario',   logoUrl: '/marcas/ITP Mobiliario.png',   description: 'Fabricante de mobiliario educacional, residencial, bar & restaurantes e instituciona', category: 'Hogar',      isActive: true, displayOrder: 2 },
  { id: '3', slug: 'loan-arte',         name: 'Loan Arte',        logoUrl: '/marcas/Loan arte.png',        description: 'Arte abstracto contemporáneo, muy humano, muy visual y nada artificial',                                     category: 'Arte',       isActive: true, displayOrder: 3 },
  { id: '4', slug: 'oro-negro',         name: 'Oro negro',        logoUrl: '/marcas/Oro negro.png',        description: 'Distribuidora de ropa al por mayor ubicados en Naucalpan',                    category: 'Alimentos',  isActive: true, displayOrder: 4 },
  { id: '5', slug: 'peyote-leather',    name: 'Peyote Leather',   logoUrl: '/marcas/Peyote Leather.png',   description: 'Artículos de cuero artesanales hechos a mano.',                              category: 'Accesorios', isActive: true, displayOrder: 5 },
  { id: '6', slug: 'vitralma',          name: 'Vitralma',         logoUrl: '/marcas/Vitralma.png',         description: 'Joyas personalizadas que cuentan tu historia. Diseños únicos creados especialmente para ti.',                        category: 'Alimentos',  isActive: true, displayOrder: 6 },
  { id: '7', slug: 'brillo-de-plata',      name: 'Brillo de Plata',     logoUrl: '/marcas/Domótica 369.png',     description: 'El brillo de la plata con la dulzura de la Miel',                       category: 'Tecnología', isActive: true, displayOrder: 7 },
  { id: '8', slug: 'titan-accesorios',  name: 'Titán Accesorios', logoUrl: '/marcas/Titán Accesorios.png', description: 'Fundas y Electrónica',                     category: 'Tecnología', isActive: true, displayOrder: 8 },
  { id: '9', slug: 'mint-software',     name: 'Mint Software',    logoUrl: '/marcas/Mint Software.png',    description: 'Desarrollo Web',                           category: 'Tecnología', isActive: true, displayOrder: 9 },
];

const MOCK_PRODUCTOS: Producto[] = [
  { id: 'p1', slug: 'cazuela-barro-1', name: 'Cazuela Barro 1', imageUrl: null, price: 800, marcaId: '1', isFeatured: true, stock: 12 },
  { id: 'p2', slug: 'cazuela-barro-2', name: 'Cazuela Barro 2', imageUrl: null, price: 800, marcaId: '1', isFeatured: true, stock: 8  },
  { id: 'p3', slug: 'cazuela-barro-3', name: 'Cazuela Barro 3', imageUrl: null, price: 800, marcaId: '1', isFeatured: true, stock: 5  },
  {
    id: 'p4',
    slug: 'tequila-artesanal-anejo',
    name: 'Tequila Artesanal Añejo',
    imageUrl: null,
    price: 45.00,
    marcaId: '6',
    description: 'Agave, barrica de roble, artesanal. Destilado con pasión siguiendo un proceso de antigüedad en solera. Su embotellado manual y selección cuidadosa de los mejores magueyes lo hacen único.',
    sizes: ['750ml', '1L'],
    colors: ['Gold', 'Silver'],
    isFeatured: false,
    stock: 20,
  },
];

const MOCK_HERO_SLIDES: HeroSlide[] = [
  { id: 'h1', title: "¡Ayudadón!<br/><span class='text-base sm:text-lg md:text-3xl lg:text-4xl font-semibold mt-2 md:mt-4 inline-block drop-shadow-md text-white'>¿Necesitas vender algo? Nosotros te podemos ayudar.</span>", imageUrl: '/images/PNG_Don.png', hasButton: true, buttonText: '¡Ver productos ahora!', buttonHref: '/productos', order: 1 },
  { id: 'h2', title: "¡Ayudadón!<br/><span class='text-base sm:text-lg md:text-3xl lg:text-4xl font-semibold mt-2 md:mt-4 inline-block drop-shadow-md text-white'>Compras seguras, apoyo local.</span>", imageUrl: '/images/PNG_Don.png', hasButton: false, order: 2 },
  { id: 'h3', title: "¡Ayudadón!<br/><span class='text-base sm:text-lg md:text-3xl lg:text-4xl font-semibold mt-2 md:mt-4 inline-block drop-shadow-md text-white'>La conexión directa con emprendimientos.</span>", imageUrl: '/images/PNG_Don.png', hasButton: false, order: 3 },
  { id: 'h4', title: "¡Ayudadón!<br/><span class='text-base sm:text-lg md:text-3xl lg:text-4xl font-semibold mt-2 md:mt-4 inline-block drop-shadow-md text-white'>Talento y buenas ideas en un mismo lugar.</span>", imageUrl: '/images/PNG_Don.png', hasButton: false, order: 4 },
  { id: 'h5', title: "¡Ayudadón!<br/><span class='text-base sm:text-lg md:text-3xl lg:text-4xl font-semibold mt-2 md:mt-4 inline-block drop-shadow-md text-white'>Conoce nuevos vendedores y productos nacionales.</span>", imageUrl: '/images/PNG_Don.png', hasButton: false, order: 5 },
];