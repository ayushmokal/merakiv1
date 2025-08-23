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
      {/* Wrapper with gradient ring + glass background for a more "designed" feel */}
      <div
        className={`fixed top-3 left-1/2 -translate-x-1/2 z-50 transition-[width] duration-300 ${
          isScrolled ? 'w-[95%] max-w-6xl' : 'w-[98%] max-w-7xl'
        }`}
      >
        <div className={`relative rounded-2xl bg-transparent ${
          isScrolled ? 'shadow-[0_6px_18px_-8px_rgba(0,0,0,0.25)]' : 'shadow-[0_4px_14px_-10px_rgba(0,0,0,0.2)]'
        }`}>
          <nav
            aria-label="Main navigation"
            className={`relative flex items-center h-16 lg:h-18 rounded-[1.1rem] px-4 sm:px-6 lg:px-8
            bg-sky-50/90 dark:bg-neutral-900/70 backdrop-blur-xl
            border border-sky-100 dark:border-white/10
            transition-colors duration-500`}
          >
            {/* Logo */}
            <div className="relative flex items-center">
              <Link href="/" className="flex items-center group relative">
                <Image
                  src="/logo.png"
                  alt="Meraki Logo"
                  width={140}
                  height={38}
                  priority
                  className="h-9 w-auto sm:h-10 lg:h-12 object-contain transition-transform duration-300 group-hover:scale-[1.035]"
                />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center justify-center flex-1 ml-6">
              <ul className="flex items-center gap-1">
                {navLinks.map((link) => {
                  const active = pathname === link.href;
                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className={`group relative block px-4 py-2 text-sm font-medium tracking-wide rounded-lg
                        transition-colors duration-300
                        ${active ? 'text-slate-900 dark:text-white' : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'}`}
                      >
                        <span className="relative z-10">
                          {link.label}
                        </span>
                        {/* Soft hover background */}
                        <span
                          className={`absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300
                          bg-gradient-to-br from-slate-100/90 via-white/60 to-slate-100/80 dark:from-white/5 dark:via-white/0 dark:to-white/5 backdrop-blur-sm`}
                        />
                        {/* Underline (solid color) */}
                        <span
                          className={`pointer-events-none absolute left-4 right-4 -bottom-0.5 h-[2px] origin-center rounded-full
                          bg-blue-600 transition-all duration-300 ease-out
                          ${active ? 'opacity-100 scale-100' : 'opacity-0 scale-50 group-hover:opacity-60 group-hover:scale-100'}`}
                        />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Right actions */}
            <div className="ml-auto hidden md:flex items-center gap-3">
              <Button
                onClick={() => setIsModalOpen(true)}
                size="sm"
                className="relative overflow-hidden rounded-lg bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:via-indigo-500 hover:to-violet-500 shadow-md hover:shadow-lg transition-all duration-300 border border-white/20 text-white"
              >
                <span className="relative z-10">Get Quote</span>
                <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.35),transparent_60%)]" />
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden ml-auto">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="h-10 w-10 rounded-xl hover:bg-white/60 dark:hover:bg-white/10"
                aria-label="Toggle menu"
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </nav>

          {/* Mobile menu panel */}
          <div
            className={`md:hidden overflow-hidden transition-[max-height,opacity] duration-400 ease-in-out rounded-b-2xl
            bg-sky-50/95 dark:bg-neutral-900/80 backdrop-blur-xl border border-t-0 border-sky-100 dark:border-white/10 shadow-md
            ${isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
          >
            <ul className="py-3 px-2 divide-y divide-white/40 dark:divide-white/5">
              {navLinks.map((link) => {
                const active = pathname === link.href;
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors
                      ${active ? 'text-slate-900 dark:text-white bg-white/70 dark:bg-white/10' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-white/5'}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
              <li className="pt-3 px-4">
                <Button
                  onClick={() => {
                    setIsModalOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:via-indigo-500 hover:to-violet-500 text-white"
                >
                  Get Quote
                </Button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Spacer to offset fixed navbar height */}
      <div className="h-[82px] lg:h-[90px]"></div>
      
      <LeadCaptureModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
} 