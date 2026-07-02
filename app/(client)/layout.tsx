import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TrustBanner from '@/components/TrustBanner';

/**
 * Layout del grupo (client).
 * Todas las páginas dentro de app/(client)/ heredan Header + TrustBanner + Footer.
 * Las páginas de (auth) y admin NO lo heredan.
 */
export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <TrustBanner />
      <Footer />
    </div>
  );
}