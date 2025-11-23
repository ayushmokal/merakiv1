'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { useState, useEffect, useRef, useCallback } from 'react';
import LeadCaptureModal from '@/components/LeadCaptureModal';
import { triggerLeadPopup, hasSeenPopup } from '@/lib/popup-trigger';

export default function Navbar() {
  const pathname = usePathname();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHeroPinned, setIsHeroPinned] = useState(true);
  const navRef = useRef<HTMLDivElement>(null);
  const [navOffset, setNavOffset] = useState<number | null>(null);
  const heroBoundaryRef = useRef<number | null>(null);

  const handleScroll = useCallback(() => {
    const scrollY = window.scrollY;
    setIsScrolled(scrollY > 10);

    const navHeight = navRef.current?.offsetHeight ?? 0;
    const heroBoundary = heroBoundaryRef.current;

    if (typeof heroBoundary === 'number') {
      setIsHeroPinned(scrollY + navHeight <= heroBoundary);
    } else {
      setIsHeroPinned(true);
    }
  }, []);

  const updateHeroBoundary = useCallback(() => {
    const hero = document.querySelector<HTMLElement>('[data-nav-hero]');

    if (!hero) {
      heroBoundaryRef.current = null;
      return;
    }

    const rect = hero.getBoundingClientRect();
    heroBoundaryRef.current = rect.top + window.scrollY + rect.height;
  }, []);

  useEffect(() => {
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const updateNavOffset = useCallback(() => {
    if (!navRef.current) return;
    const rect = navRef.current.getBoundingClientRect();
    setNavOffset(Math.ceil(rect.bottom));
  }, []);

  useEffect(() => {
    updateNavOffset();
  }, [updateNavOffset, isScrolled, isMobileMenuOpen, isHeroPinned]);

  useEffect(() => {
    window.addEventListener('resize', updateNavOffset);
    return () => window.removeEventListener('resize', updateNavOffset);
  }, [updateNavOffset]);

  useEffect(() => {
    const runUpdates = () => {
      updateHeroBoundary();
      handleScroll();
    };

    runUpdates();

    const heroElement = document.querySelector<HTMLElement>('[data-nav-hero]');
    let resizeObserver: ResizeObserver | null = null;

    if (heroElement && typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(runUpdates);
      resizeObserver.observe(heroElement);
    }

    window.addEventListener('resize', runUpdates);

    const rafId = requestAnimationFrame(runUpdates);
    const timeoutId = window.setTimeout(runUpdates, 400);

    return () => {
      window.removeEventListener('resize', runUpdates);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      cancelAnimationFrame(rafId);
      window.clearTimeout(timeoutId);
    };
  }, [pathname, updateHeroBoundary, handleScroll]);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/projects', label: 'Property' },
    { href: '/work', label: 'Our Work' },
    { href: '/services', label: 'Our Services' },
  ];

  return (
    <>
      <div 
        ref={navRef} 
        className={`navbar-shell z-50 px-3 sm:px-6 pt-3 ${
          isHeroPinned 
            ? 'fixed top-0 left-0 right-0' 
            : 'absolute top-0 left-0 right-0'
        }`}
      >
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-2 md:flex-row md:items-center md:justify-between md:gap-6">
          <Link
            href="/"
            className={`inline-flex w-[18.5rem] items-center justify-center self-center rounded-[1.15rem] border border-white/80 bg-white px-6 shadow-[0_24px_55px_-24px_rgba(15,23,42,0.55)] transition-transform duration-300 md:w-[20.5rem] lg:w-[22.5rem] h-[4.6rem] sm:h-[4.85rem] ${
              isScrolled
                ? 'md:h-[4.4rem] lg:h-[4.6rem]'
                : 'md:h-[4.9rem] lg:h-[5.1rem]'
            }`}
          >
            <Image
              src="/logo.png"
              alt="Meraki Logo"
              width={360}
              height={160}
              priority
              quality={100}
              sizes="(max-width: 768px) 288px, 352px"
              style={{ width: '100%', height: '100%', maxHeight: '100%' }}
              className="object-contain transition-transform duration-300 hover:scale-[1.02]"
            />
          </Link>

          <div className={`w-full md:flex-1 md:max-w-[720px] xl:max-w-[780px] transition-all duration-300 ${isScrolled ? 'md:pl-6' : 'md:pl-8'}`}>
            <nav
              aria-label="Main navigation"
              className="flex items-center gap-4"
            >
              <div className="hidden md:flex flex-1 justify-center">
                <ul className="flex items-center gap-5 lg:gap-7">
                  {navLinks.map((link) => {
                    const active = pathname === link.href;
                    // Only trigger popup for properties, not for services and work
                    const shouldTriggerPopup = link.href === '/projects';
                    
                    return (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className={`relative text-sm font-semibold tracking-wide transition-colors duration-200 ${
                            active
                              ? isScrolled
                                ? 'text-blue-600'
                                : 'text-blue-300 drop-shadow-[0_2px_12px_rgba(0,0,0,0.65)]'
                              : isScrolled
                                ? 'text-slate-800 hover:text-slate-600'
                                : 'text-white hover:text-slate-100 drop-shadow-[0_2px_12px_rgba(0,0,0,0.65)]'
                          }`}
                          onClick={(e) => {
                            if (shouldTriggerPopup && !hasSeenPopup()) {
                              e.preventDefault();
                              triggerLeadPopup(link.href);
                            }
                          }}
                        >
                          {link.label}
                          {active && (
                            <span
                              className={`absolute -bottom-1 left-0 right-0 h-[2px] rounded-full ${
                                isScrolled ? 'bg-blue-600' : 'bg-blue-300'
                              }`}
                            />
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
                  className={`rounded-full px-6 py-2 text-sm font-semibold shadow-md bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 text-white transition-all duration-200 ${
                    isScrolled ? '' : 'drop-shadow-[0_2px_18px_rgba(15,23,42,0.45)]'
                  }`}
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
                // Only trigger popup for properties, not for services and work
                const shouldTriggerPopup = link.href === '/projects';
                
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`block px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                        active ? 'text-blue-600 bg-blue-50' : 'text-slate-700 hover:text-blue-600 hover:bg-slate-50'
                      }`}
                      onClick={(e) => {
                        setIsMobileMenuOpen(false);
                        if (shouldTriggerPopup && !hasSeenPopup()) {
                          e.preventDefault();
                          triggerLeadPopup(link.href);
                        }
                      }}
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

      <div style={{ height: navOffset ?? (isScrolled ? 150 : 180) }} aria-hidden />
      
      <LeadCaptureModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
} 
