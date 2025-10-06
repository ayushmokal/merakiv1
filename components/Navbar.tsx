'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import LeadCaptureModal from '@/components/LeadCaptureModal';

export default function Navbar() {
  const pathname = usePathname();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/projects', label: 'Property' },
    { href: '/work', label: 'Our Work' },
    { href: '/services', label: 'Our Services' },
  ];

  return (
    <>
      <div className="fixed top-3 sm:top-4 left-0 right-0 z-50 px-3 sm:px-6">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-3 md:flex-row md:items-center md:justify-center md:gap-6">
          <Link
            href="/"
            className={`inline-flex w-[14.5rem] items-center justify-center self-center rounded-[1.85rem] border border-white/80 bg-white/95 px-7 shadow-[0_24px_55px_-24px_rgba(15,23,42,0.55)] backdrop-blur-xl transition-all duration-300 md:w-[17.5rem] lg:w-[19rem] ${
              isScrolled
                ? 'h-[3.4rem] sm:h-[3.6rem] md:h-[3.8rem]'
                : 'h-[3.8rem] sm:h-[4.1rem] md:h-[4.3rem]'
            }`}
          >
            <Image
              src="/logo.png"
              alt="Meraki Logo"
              width={360}
              height={160}
              priority
              style={{ width: '100%', height: '100%' }}
              className="object-contain transition-transform duration-300 hover:scale-[1.02]"
            />
          </Link>

          <div
            className={`w-full md:flex-1 md:max-w-[680px] lg:max-w-[720px] xl:max-w-[760px] md:self-auto rounded-[1.9rem] border border-white/65 bg-white/70 backdrop-blur-2xl shadow-[0_30px_55px_-24px_rgba(15,23,42,0.35)] transition-all duration-300 ${
              isScrolled ? 'px-4 py-2.5 sm:px-5' : 'px-5 py-3 sm:px-6 sm:py-3.5'
            }`}
          >
            <nav
              aria-label="Main navigation"
              className="flex items-center gap-4"
            >
              <div className="hidden md:flex flex-1 justify-center">
                <ul className="flex items-center gap-5 lg:gap-7">
                  {navLinks.map((link) => {
                    const active = pathname === link.href;
                    return (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className={`relative text-sm font-semibold tracking-wide transition-colors duration-200 ${
                            active ? 'text-blue-600' : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          {link.label}
                          {active && (
                            <span className="absolute -bottom-1 left-0 right-0 h-[2px] rounded-full bg-blue-600" />
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className="hidden md:flex items-center">
                <Button
                  onClick={() => setIsModalOpen(true)}
                  size="sm"
                  className="rounded-full px-6 py-2 text-sm font-semibold shadow-md bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 text-white transition-all duration-200"
                >
                  Get Quote
                </Button>
              </div>

              <div className="flex w-full items-center justify-between md:hidden">
                <span className="text-sm font-semibold text-slate-600">Menu</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="h-10 w-10 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
                  aria-label="Toggle menu"
                  aria-expanded={isMobileMenuOpen}
                >
                  {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
              </div>
            </nav>
          </div>

          <div
            className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out rounded-3xl border border-white/60 bg-white text-slate-800 shadow-lg ${
              isMobileMenuOpen ? 'max-h-96 opacity-100 pb-4' : 'max-h-0 opacity-0'
            }`}
          >
            <ul className="py-2 px-4">
              {navLinks.map((link) => {
                const active = pathname === link.href;
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`block px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                        active ? 'text-blue-600 bg-blue-50' : 'text-slate-700 hover:text-blue-600 hover:bg-slate-50'
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
              <li className="pt-2 px-4">
                <Button
                  onClick={() => {
                    setIsModalOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 text-white"
                >
                  Get Quote
                </Button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className={isScrolled ? 'h-[150px]' : 'h-[180px]'}></div>
      
      <LeadCaptureModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
} 
