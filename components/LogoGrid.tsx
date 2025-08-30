"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

type Logo = {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
};

interface LogoGridProps {
  title?: string;
  subtitle?: string;
  logos?: Logo[];
  className?: string;
}

// Simple, responsive logo grid with comfortable spacing
export default function LogoGrid({
  title = "Trusted by leading clients",
  subtitle = "A glimpse of brands we’ve worked with",
  logos,
  className,
}: LogoGridProps) {
  const items: Logo[] =
    logos && logos.length > 0
      ? logos
      : Array.from({ length: 12 }).map(() => ({
          src: "/logo.png",
          alt: "Meraki",
          width: 120,
          height: 48,
        }));

  return (
    <section className={cn("py-10 sm:py-12 md:py-14 bg-slate-50/60", className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-10">
          <p className="text-xs uppercase tracking-wide text-slate-500">{subtitle}</p>
          <h3 className="mt-2 text-xl sm:text-2xl font-semibold text-slate-800">{title}</h3>
        </div>

        <div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-8 gap-y-10 items-center justify-items-center"
          aria-label="Logo grid"
        >
          {items.map((logo, idx) => (
            <div key={`logo-${idx}`} className="opacity-80 hover:opacity-100 transition-opacity">
              <Image
                src={logo.src}
                alt={logo.alt || "Client logo"}
                width={logo.width ?? 120}
                height={logo.height ?? 48}
                className="object-contain grayscale hover:grayscale-0 duration-200"
                priority={idx < 6}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

