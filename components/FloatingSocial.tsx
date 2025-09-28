'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Instagram, ArrowUp } from 'lucide-react';

const links = [
  {
    href: 'https://wa.me/919930910004',
    label: 'Chat on WhatsApp',
    iconImage: '/wp.png',
    ring: 'from-[#25d366] to-[#128c7e]',
  },
  {
    href: 'https://www.instagram.com/merakisquarefoots?igsh=eXpnNzh1OWR2bTUw&utm_source=qr',
    label: 'View on Instagram',
    icon: Instagram,
    ring: 'from-[#f58529] via-[#dd2a7b] to-[#515bd4]',
    iconColor: '#d62976',
  },
];

export default function FloatingSocial() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowTop(window.scrollY > 300);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollToTop = () => {
    try {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      window.scrollTo(0, 0);
    }
  };

  return (
    <>
      {/* Desktop / tablet floating rail */}
      <div className="hidden md:flex fixed right-4 top-1/2 -translate-y-1/2 z-40">
        <div className="flex flex-col items-center gap-3 rounded-full bg-white/90 dark:bg-neutral-900/80 backdrop-blur-lg shadow-[0_12px_30px_-15px_rgba(15,23,42,0.7)] border border-white/60 dark:border-white/10 px-3 py-4">
          {links.map(({ href, icon: Icon, iconImage, label, ring, iconColor }) => (
            <Link
              key={href}
              href={href}
              target="_blank"
              rel="noreferrer"
              aria-label={label}
              className="group relative flex h-10 w-10 items-center justify-center rounded-full transition-transform duration-300 hover:-translate-y-0.5"
            >
              <span
                className={`absolute inset-0 rounded-full bg-gradient-to-br ${ring} opacity-80 transition-opacity duration-300 group-hover:opacity-100`}
              />
              <span className="absolute inset-[1.5px] rounded-full bg-white dark:bg-neutral-900" />
              {Icon ? (
                <Icon className="relative z-10 h-5 w-5" style={{ color: iconColor }} />
              ) : iconImage ? (
                <Image
                  src={iconImage}
                  alt={label}
                  width={20}
                  height={20}
                  className="relative z-10 h-5 w-5 object-contain"
                />
              ) : null}
            </Link>
          ))}
          <button
            type="button"
            aria-label="Scroll to top"
            onClick={handleScrollToTop}
            className={`group relative flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 ${
              showTop ? 'opacity-100 translate-y-0' : 'opacity-0 pointer-events-none translate-y-2'
            }`}
          >
            <span className="absolute inset-0 rounded-full bg-gradient-to-br from-sky-400 to-indigo-500 opacity-85 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="absolute inset-[1.5px] rounded-full bg-white dark:bg-neutral-900" />
            <ArrowUp className="relative z-10 h-5 w-5 text-slate-800 dark:text-slate-100" />
          </button>
        </div>
      </div>

      {/* Mobile quick links */}
      <div className="fixed bottom-24 right-4 z-40 flex md:hidden">
        <div className="flex items-center gap-3 rounded-full bg-white/90 dark:bg-neutral-900/80 backdrop-blur-lg shadow-[0_12px_30px_-15px_rgba(15,23,42,0.7)] border border-white/60 dark:border-white/10 px-4 py-2">
          {links.map(({ href, icon: Icon, iconImage, label, ring, iconColor }) => (
            <Link
              key={href}
              href={href}
              target="_blank"
              rel="noreferrer"
              aria-label={label}
              className="group relative flex h-10 w-10 items-center justify-center rounded-full transition-transform duration-300 hover:-translate-y-0.5"
            >
              <span
                className={`absolute inset-0 rounded-full bg-gradient-to-br ${ring} opacity-80 transition-opacity duration-300 group-hover:opacity-100`}
              />
              <span className="absolute inset-[1.5px] rounded-full bg-white dark:bg-neutral-900" />
              {Icon ? (
                <Icon className="relative z-10 h-5 w-5" style={{ color: iconColor }} />
              ) : iconImage ? (
                <Image
                  src={iconImage}
                  alt={label}
                  width={20}
                  height={20}
                  className="relative z-10 h-5 w-5 object-contain"
                />
              ) : null}
            </Link>
          ))}
          <button
            type="button"
            aria-label="Scroll to top"
            onClick={handleScrollToTop}
            className={`group relative flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 ${
              showTop ? 'opacity-100 translate-y-0' : 'opacity-0 pointer-events-none translate-y-2'
            }`}
          >
            <span className="absolute inset-0 rounded-full bg-gradient-to-br from-sky-400 to-indigo-500 opacity-85 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="absolute inset-[1.5px] rounded-full bg-white dark:bg-neutral-900" />
            <ArrowUp className="relative z-10 h-5 w-5 text-slate-800 dark:text-slate-100" />
          </button>
        </div>
      </div>
    </>
  );
}
