import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PopupBlocker from '@/components/PopupBlocker';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Meraki Square Foots - Building Dreams, Creating Futures',
  description: 'Comprehensive property solutions including RCC consultancy, property advisory, and interior design.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <main className="pt-16">
          {children}
        </main>
        <Footer />
        <PopupBlocker />
        <Toaster />
      </body>
    </html>
  );
}
