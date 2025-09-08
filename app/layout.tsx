import './globals.css';
import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PopupBlocker from '@/components/PopupBlocker';
import MobileWrapper from '@/components/MobileWrapper';
import { Toaster } from '@/components/ui/toaster';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Meraki Square Foots - Building Dreams, Creating Futures',
  description: 'Comprehensive property solutions including RCC consultancy, property advisory, and interior design.',
  icons: {
    // Point to the actual favicon that exists in public/
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full m-0 p-0 font-sans" suppressHydrationWarning>
        <Navbar />
        <main className="relative mb-20 md:mb-0">
          {children}
        </main>
        <Footer />
        <PopupBlocker />
        
        {/* Mobile Navigation and Modals */}
        <MobileWrapper />
        
        <Toaster />
        {/* IntersectionObserver to reveal .fade-up elements */}
        <Script id="reveal-on-scroll" strategy="afterInteractive">
          {`
            (function(){
              try {
                const els = Array.from(document.querySelectorAll('.fade-up'));
                if (!('IntersectionObserver' in window) || els.length === 0) return;
                const io = new IntersectionObserver((entries) => {
                  entries.forEach((e) => {
                    if (e.isIntersecting) {
                      e.target.classList.add('in-view');
                      // Unobserve to avoid re-triggering
                      io.unobserve(e.target);
                    }
                  });
                }, { rootMargin: '0px 0px -10% 0px', threshold: 0.15 });
                els.forEach((el) => io.observe(el));
              } catch (err) {}
            })();
          `}
        </Script>
      </body>
    </html>
  );
}
