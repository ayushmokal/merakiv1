'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Building2,
  Crown,
  Home,
  Key,
  MapPin,
  Palette,
  Phone,
  Search,
} from 'lucide-react';

const categories = [
  {
    id: 'buy',
    title: 'Buy',
    description: 'Purchase properties with confidence',
    icon: Home,
    accent: 'from-blue-500/10 via-blue-400/5 to-transparent',
    href: '/projects',
  },
  {
    id: 'lease',
    title: 'Lease',
    description: 'Discover premium rental spaces',
    icon: Key,
    accent: 'from-emerald-500/10 via-emerald-400/5 to-transparent',
    href: '/projects',
  },
  {
    id: 'commercial',
    title: 'Commercial',
    description: 'Strategic business destinations',
    icon: Building2,
    accent: 'from-purple-500/10 via-purple-400/5 to-transparent',
    href: '/projects',
  },
  {
    id: 'bungalow',
    title: 'Bungalow',
    description: 'Handpicked luxury villas',
    icon: Crown,
    accent: 'from-orange-500/10 via-orange-400/5 to-transparent',
    href: '/projects',
  },
  {
    id: 'interior',
    title: 'Interior',
    description: 'Bespoke interior experiences',
    icon: Palette,
    accent: 'from-pink-500/10 via-pink-400/5 to-transparent',
    href: '/services',
  },
];

function useAnimatedCounter(end: number, duration = 2200, delay = 400) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let frameId: number | null = null;
    let startTime: number | null = null;

    const animate = (timestamp: number) => {
      if (startTime === null) {
        startTime = timestamp;
      }

      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(end * progress));

      if (progress < 1) {
        frameId = requestAnimationFrame(animate);
      }
    };

    const timeoutId = window.setTimeout(() => {
      frameId = requestAnimationFrame(animate);
    }, delay);

    return () => {
      window.clearTimeout(timeoutId);
      if (frameId) {
        cancelAnimationFrame(frameId);
      }
    };
  }, [delay, duration, end]);

  return count;
}

type Particle = {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
};

function createParticles(count = 18): Particle[] {
  return Array.from({ length: count }, (_, index) => ({
    id: index,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 2,
    duration: Math.random() * 18 + 12,
    delay: Math.random() * 6,
  }));
}

function FloatingParticles() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    setParticles(createParticles());
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden>
      {particles.map((particle) => (
        <motion.span
          key={particle.id}
          className="absolute rounded-full bg-sky-300/20"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.25, 0.65, 0.25],
            scale: [1, 1.25, 1],
          }}
          transition={{
            duration: particle.duration,
            ease: 'easeInOut',
            repeat: Infinity,
            delay: particle.delay,
          }}
        />
      ))}
    </div>
  );
}

export default function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const leaseCount = useAnimatedCounter(150000);
  const soldCount = useAnimatedCounter(100000, 2200, 550);
  const clientsCount = useAnimatedCounter(30, 2000, 700);
  const experienceCount = useAnimatedCounter(7, 2000, 850);

  return (
    <section
      data-nav-hero
      className="relative -mt-[160px] pt-[160px] sm:-mt-[180px] sm:pt-[180px] lg:-mt-[210px] lg:pt-[210px] overflow-hidden bg-slate-950 text-white"
    >
      <div className="absolute inset-0">
        <Image
          src="/hero.png"
          alt="Mumbai skyline inspiring Meraki Square Foots"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/80 via-slate-900/60 to-slate-900/72" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/78 via-slate-900/35 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(56,189,248,0.14),_transparent_64%)]" />
      </div>

      <FloatingParticles />

      <div className="relative max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 py-20 lg:py-28">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_minmax(260px,1fr)] lg:items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-6"
            >
              <Badge className="bg-white/10 border-white/20 text-white backdrop-blur">Trusted Since 2017</Badge>
              <motion.h1
                className="text-4xl sm:text-5xl lg:text-6xl font-semibold leading-tight text-white"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.35 }}
              >
                Meraki Square Foots LLP
                <span className="mt-3 block text-lg sm:text-xl font-normal text-sky-200/90">
                  The official merakisquarefootsllp hub for RCC consultancy, property advisory, interior design, and
                  property management across Navi Mumbai, Mumbai, and Pune.
                </span>
              </motion.h1>

              <motion.p
                className="text-lg md:text-xl text-white/80 max-w-2xl"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.5 }}
              >
                Professional property consultants for Navi Mumbai, Mumbai, and Pune. We blend architecture, interiors, and real estate expertise to craft inspiring spaces and lasting partnerships.
              </motion.p>

              <motion.div
                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: { staggerChildren: 0.12, delayChildren: 0.9 },
                  },
                }}
              >
                {categories.map((category, index) => {
                  const Icon = category.icon;
                  return (
                    <motion.div
                      key={category.id}
                      variants={{
                        hidden: { opacity: 0, y: 40, rotateX: -20 },
                        visible: {
                          opacity: 1,
                          y: 0,
                          rotateX: 0,
                          transition: { type: 'spring', stiffness: 160, damping: 18 },
                        },
                      }}
                      whileHover={{ y: -6, scale: 1.04 }}
                      whileTap={{ scale: 0.97 }}
                      className="relative"
                    >
                      <Link href={category.href} className="block h-full">
                        <Card className="relative group overflow-hidden border border-white/10 bg-slate-900/70 backdrop-blur-sm p-4 text-center h-full flex flex-col items-center justify-center gap-3">
                          <span className={`absolute inset-0 bg-gradient-to-br ${category.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                          <span className="relative flex h-12 w-12 items-center justify-center rounded-full bg-white/5 border border-white/10">
                            <Icon className="h-5 w-5 text-white" />
                          </span>
                          <div className="relative">
                            <p className="font-semibold text-white text-sm sm:text-base">{category.title}</p>
                            <p className="text-xs text-white/70 mt-1">{category.description}</p>
                          </div>
                        </Card>
                      </Link>
                    </motion.div>
                  );
                })}
              </motion.div>

              <motion.div
                className="flex flex-col sm:flex-row gap-4 pt-1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.1 }}
              >
                <Button
                  size="lg"
                  asChild
                  className="group relative overflow-hidden bg-sky-500 hover:bg-sky-600"
                >
                  <Link href="/projects" className="relative flex items-center justify-center gap-2 font-medium">
                    <span className="pointer-events-none absolute inset-0 bg-gradient-to-r from-sky-400 via-purple-400 to-pink-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <span className="relative z-10 flex items-center">
                      <Home className="h-5 w-5" />
                      <span className="ml-2">Browse Properties</span>
                    </span>
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="border-white/80 bg-white/90 text-slate-900 hover:bg-white hover:text-slate-900"
                >
                  <Link href="/services" className="relative flex items-center justify-center gap-2 font-medium">
                    <Search className="h-5 w-5" />
                    <span>Book Consultation</span>
                  </Link>
                </Button>
              </motion.div>
            </motion.div>

            <motion.div
              className="mt-12 grid grid-cols-2 gap-8 sm:gap-10 md:grid-cols-4 text-center"
              initial="hidden"
              animate={isVisible ? 'visible' : 'hidden'}
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.15, delayChildren: 1.1 },
                },
              }}
            >
              <motion.div
                variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
                className="group"
              >
                <p className="text-3xl md:text-4xl font-semibold">
                  {isVisible ? leaseCount.toLocaleString('en-IN') : '0'}
                </p>
                <p className="text-sm text-white/70">sq.ft+ on Lease</p>
              </motion.div>
              <motion.div
                variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
                className="group"
              >
                <p className="text-3xl md:text-4xl font-semibold">
                  {isVisible ? soldCount.toLocaleString('en-IN') : '0'}
                </p>
                <p className="text-sm text-white/70">sq.ft+ Sold</p>
              </motion.div>
              <motion.div
                variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
                className="group"
              >
                <p className="text-3xl md:text-4xl font-semibold">
                  {isVisible ? `${clientsCount}+` : '0'}
                </p>
                <p className="text-sm text-white/70">Happy Clients</p>
              </motion.div>
              <motion.div
                variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
                className="group"
              >
                <p className="text-3xl md:text-4xl font-semibold">
                  {isVisible ? `${experienceCount}+` : '0'}
                </p>
                <p className="text-sm text-white/70">Years Experience</p>
              </motion.div>
            </motion.div>
          </div>

          
        </div>
      </div>
    </section>
  );
}
