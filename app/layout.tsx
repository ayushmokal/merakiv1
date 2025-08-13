import './globals.css';
import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PopupBlocker from '@/components/PopupBlocker';
import { Toaster } from '@/components/ui/toaster';

export const metadata: Metadata = {
  title: 'Meraki Square Foots - Building Dreams, Creating Futures',
  description: 'Comprehensive property solutions including RCC consultancy, property advisory, and interior design.',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
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
        <main className="relative">
          {children}
        </main>
        <Footer />
        <PopupBlocker />
        <Toaster />
      </body>
    </html>
  );
}
