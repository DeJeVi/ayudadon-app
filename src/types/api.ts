/**
 * ============================================================
 * TIPOS DE DATOS — CONTRATO CON EL BACKEND
 * ============================================================
 *
 * Este archivo define la "forma" exacta que debe tener la información
 * que venga de la API/base de datos. El encargado del backend debe
 * asegurarse de que sus endpoints devuelvan objetos que cumplan
 * EXACTAMENTE estas interfaces.
 *
 * Si el backend cambia algún nombre de campo, hay que actualizar
 * este archivo Y los componentes que lo usan al mismo tiempo.
 */

// ─────────────────────────────────────────────────────────────
// MARCA / NEGOCIO ASOCIADO
// ─────────────────────────────────────────────────────────────
export interface Marca {
  /** ID único de la marca en la base de datos (UUID o autoincremental) */
  id: string;

  /** Slug usado en la URL: /marca/[slug] — debe ser único, sin espacios ni mayúsculas */
  slug: string;

  /** Nombre comercial que se muestra en la tarjeta */
  name: string;

  /**
   * URL completa de la imagen del logo.
   * Puede venir de:
   *   - Almacenamiento propio del backend (ej. /uploads/marcas/xxx.png)
   *   - Un CDN externo (ej. Cloudinary, S3, Supabase Storage)
   * El frontend NO transforma esta URL, la usa tal cual llega.
   * Si es null o el campo no existe, el frontend muestra un fallback
   * con la primera letra del nombre (ya implementado en BrandCard).
   */
  logoUrl: string | null;

  /** Descripción corta que aparece debajo del nombre en la tarjeta (máx. ~60 caracteres recomendado) */
  description: string;

  /** Categoría opcional, útil si luego se agregan filtros (ej. "Alimentos", "Tecnología", "Arte") */
  category?: string;

  /** Si la marca está activa/visible en el sitio. El backend debe filtrar esto, pero el frontend también lo valida por seguridad */
  isActive?: boolean;

  /** Orden de aparición manual (opcional). Si no viene, se usa el orden que entregue el array */
  displayOrder?: number;
}

// ─────────────────────────────────────────────────────────────
// PRODUCTO
// ─────────────────────────────────────────────────────────────
export interface Producto {
  id: string;
  slug: string;
  name: string;

  /** URL de la imagen principal del producto */
  imageUrl: string | null;

  /** Galería de imágenes adicionales, usada en la vista de detalle del producto */
  gallery?: string[];

  /** Precio en MXN, como número (no string). Ej: 800.50, no "800.50" ni "$800.50" */
  price: number;

  /** ID de la marca a la que pertenece este producto (relación) */
  marcaId: string;

  /** Descripción larga, usada en la vista de detalle del producto */
  description?: string;

  /** Variantes disponibles, si aplica (ej. tamaños de botella, tallas de ropa) */
  sizes?: string[];

  /** Variantes de color, si aplica */
  colors?: string[];

  /** Si el producto está destacado en el home */
  isFeatured?: boolean;

  /** Cantidad disponible en inventario, si aplica */
  stock?: number;
}

// ─────────────────────────────────────────────────────────────
// SLIDE DEL HERO (carrusel principal)
// ─────────────────────────────────────────────────────────────
export interface HeroSlide {
  id: string;

  /** Título principal, puede incluir HTML simple como <span> para el subtítulo */
  title: string;

  /** URL de la imagen de la mascota/ilustración para este slide */
  imageUrl: string;

  /** Si este slide debe mostrar un botón de acción */
  hasButton: boolean;

  /** Texto del botón, solo se usa si hasButton es true */
  buttonText?: string;

  /** URL a la que debe llevar el botón, si hasButton es true */
  buttonHref?: string;

  /** Orden de aparición en el carrusel */
  order: number;
}

// ─────────────────────────────────────────────────────────────
// CARRITO
// ─────────────────────────────────────────────────────────────
export interface CartItem {
  id: string;

  /** Referencia al producto real */
  productoId: string;

  /** Datos desnormalizados para no tener que volver a pedir el producto completo en cada vista del checkout */
  name: string;
  price: number;
  imageUrl: string | null;
  quantity: number;
}

export interface DireccionEnvio {
  nombreCompleto: string;
  calle: string;
  colonia: string;
  ciudad: string;
  codigoPostal: string;
  telefono: string;
  guardarParaElFuturo?: boolean;
}

/** Respuesta esperada de GET /api/carrito */
export interface CarritoResponse {
  items: CartItem[];
  subtotal: number;
  envio: number;
  total: number;
}

// ─────────────────────────────────────────────────────────────
// RESPUESTAS DE API — wrappers estándar
// ─────────────────────────────────────────────────────────────

/** Respuesta esperada de GET /api/marcas */
export interface MarcasResponse {
  marcas: Marca[];
  total: number;
}

/** Respuesta esperada de GET /api/productos?featured=true */
export interface ProductosResponse {
  productos: Producto[];
  total: number;
}

/** Respuesta esperada de GET /api/hero-slides */
export interface HeroSlidesResponse {
  slides: HeroSlide[];
}