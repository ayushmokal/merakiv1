import './globals.css';
import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PopupBlocker from '@/components/PopupBlocker';
import MobileWrapper from '@/components/MobileWrapper';
import { Toaster } from '@/components/ui/toaster';
import Script from 'next/script';
import FloatingSocial from '@/components/FloatingSocial';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/react';
import { BUSINESS_INFO, KEYWORDS, OPENING_HOURS, SITE_URL, SOCIAL_LINKS } from '@/lib/seo';

const openingHoursStructured = OPENING_HOURS.map((hours) => ({
  '@type': 'OpeningHoursSpecification',
  dayOfWeek: hours.dayOfWeek,
  opens: hours.opens,
  closes: hours.closes,
  ...(hours.description ? { description: hours.description } : {}),
}));

const contactPoints = BUSINESS_INFO.phones.map((telephone, index) => ({
  '@type': 'ContactPoint',
  telephone,
  contactType: index === 0 ? 'sales' : 'customer service',
  areaServed: 'IN',
  availableLanguage: ['English', 'Hindi', 'Marathi'],
}));

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'RealEstateAgent',
  '@id': `${SITE_URL}#organization`,
  name: BUSINESS_INFO.name,
  legalName: BUSINESS_INFO.legalName,
  url: SITE_URL,
  description: BUSINESS_INFO.description,
  slogan: BUSINESS_INFO.tagline,
  email: BUSINESS_INFO.email,
  telephone: BUSINESS_INFO.phones[0],
  image: `${SITE_URL}/logo_withbg.png`,
  logo: `${SITE_URL}/logo_withbg.png`,
  sameAs: SOCIAL_LINKS,
  areaServed: BUSINESS_INFO.serviceAreas.map((area) => ({
    '@type': 'AdministrativeArea',
    name: area,
  })),
  address: {
    '@type': 'PostalAddress',
    streetAddress: BUSINESS_INFO.address.streetAddress,
    addressLocality: BUSINESS_INFO.address.addressLocality,
    addressRegion: BUSINESS_INFO.address.addressRegion,
    postalCode: BUSINESS_INFO.address.postalCode,
    addressCountry: BUSINESS_INFO.address.addressCountry,
  },
  openingHoursSpecification: openingHoursStructured,
  contactPoint: contactPoints,
  foundingDate: `${BUSINESS_INFO.foundingYear}-01-01`,
  priceRange: 'INR',
  serviceType: ['RCC consultancy', 'Property advisory', 'Interior design', 'Property management'],
  knowsAbout: ['Luxury villas', 'Commercial leasing', 'Navi Mumbai real estate'],
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}#website`,
  url: SITE_URL,
  name: BUSINESS_INFO.name,
  description: BUSINESS_INFO.description,
  inLanguage: 'en',
  publisher: {
    '@id': `${SITE_URL}#organization`,
  },
  potentialAction: {
    '@type': 'SearchAction',
    target: `${SITE_URL}/projects?q={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
};

const structuredData = [organizationSchema, websiteSchema];

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${BUSINESS_INFO.name} | ${BUSINESS_INFO.tagline}`,
    template: `%s | ${BUSINESS_INFO.name}`,
  },
  description: BUSINESS_INFO.description,
  applicationName: BUSINESS_INFO.name,
  keywords: KEYWORDS,
  authors: [{ name: BUSINESS_INFO.name, url: SITE_URL }],
  creator: BUSINESS_INFO.name,
  publisher: BUSINESS_INFO.name,
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    url: SITE_URL,
    title: `${BUSINESS_INFO.name} | ${BUSINESS_INFO.tagline}`,
    description: BUSINESS_INFO.description,
    siteName: BUSINESS_INFO.name,
    locale: 'en_IN',
    images: [
      {
        url: '/logo_withbg.png',
        width: 1200,
        height: 630,
        alt: `${BUSINESS_INFO.name} branding`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${BUSINESS_INFO.name} | ${BUSINESS_INFO.tagline}`,
    description: BUSINESS_INFO.description,
    images: ['/logo_withbg.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  category: 'Real Estate',
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
      <body className="h-full m-0 p-0 font-sans bg-[#0b1629] text-slate-900" suppressHydrationWarning>
        <Navbar />
        <FloatingSocial />
        <main className="relative mb-20 md:mb-0">
          {children}
        </main>
        <Footer />
        <PopupBlocker />
        
        {/* Mobile Navigation and Modals */}
        <MobileWrapper />
        
        <Toaster />
        <Analytics />
        <SpeedInsights />
        <Script id="structured-data" type="application/ld+json" strategy="afterInteractive">
          {JSON.stringify(structuredData)}
        </Script>
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
