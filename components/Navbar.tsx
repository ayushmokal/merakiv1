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
      <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ${
        isScrolled ? 'w-[95%] max-w-6xl' : 'w-[98%] max-w-7xl'
      }`}>
        <nav className={`relative bg-white/80 backdrop-blur-md border border-gray-200/50 rounded-2xl shadow-lg transition-all duration-300 ${
          isScrolled ? 'shadow-xl' : 'shadow-md'
        }`}>
          {/* Background elements */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/95 to-white/90 rounded-2xl"></div>
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-2xl"></div>
          
          <div className="relative px-4 sm:px-6 lg:px-8">
            <div className="flex items-center h-16 lg:h-18">
              {/* Logo */}
              <div className="flex items-center lg:w-1/4">
                <Link href="/" className="flex items-center">
                  <Image 
                    src="/logo.png" 
                    alt="Meraki Logo" 
                    width={140} 
                    height={35}
                    className="h-7 w-auto sm:h-8 lg:h-9 object-contain"
                  />
                </Link>
              </div>

              {/* Desktop Navigation - Centered */}
              <div className="hidden lg:flex items-center justify-center flex-1 space-x-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg hover:bg-gray-50/50 ${
                      pathname === link.href
                        ? 'text-primary bg-primary/5'
                        : 'text-gray-700 hover:text-primary'
                    }`}
                  >
                    {link.label}
                    {pathname === link.href && (
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full"></div>
                    )}
                  </Link>
                ))}
              </div>

              {/* Mobile Menu Button */}
              <div className="lg:hidden ml-auto">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="h-10 w-10 rounded-lg hover:bg-gray-50/50"
                >
                  {isMobileMenuOpen ? (
                    <X className="h-5 w-5" />
                  ) : (
                    <Menu className="h-5 w-5" />
                  )}
                </Button>
              </div>

              {/* Spacer for desktop to balance layout */}
              <div className="hidden lg:block lg:w-1/4"></div>
            </div>

            {/* Mobile Navigation Menu */}
            {isMobileMenuOpen && (
              <div className="lg:hidden border-t border-gray-200/50 mt-2">
                <div className="py-4 space-y-1">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`block px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                        pathname === link.href
                          ? 'text-primary bg-primary/5'
                          : 'text-gray-700 hover:text-primary hover:bg-gray-50/50'
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </nav>
      </div>
      
      {/* Spacer to prevent content from hiding behind fixed navbar */}
      <div className="h-20 lg:h-24"></div>
      
      <LeadCaptureModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
} 