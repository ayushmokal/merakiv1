'use client';

// Removed useState and useEffect - no longer needed for popup logic
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import HeroSection from '@/components/HeroSection';
import { Building2, Users, Award, Star, Quote, Home as HomeIcon, Palette, Sparkle, ShieldCheck } from 'lucide-react';
// Removed LeadCaptureModal import - now using PopupBlocker from layout
import Image from 'next/image';

const missionPillars = [
  {
    title: 'Honest & Transparent',
    description:
      'We provide honest, transparent, and personalised property guidance so clients can take confident decisions.',
    icon: ShieldCheck,
    accent: 'from-sky-500/30 via-blue-400/10 to-transparent',
  },
  {
    title: 'Innovation & Excellence',
    description:
      'We combine modern real estate practices with design thinking to unlock smarter, future-ready outcomes.',
    icon: Sparkle,
    accent: 'from-violet-500/30 via-purple-400/10 to-transparent',
  },
  {
    title: 'Integrated Approach',
    description:
      'Our integrated team brings architecture, interiors, and advisory together for seamless end-to-end delivery.',
    icon: Building2,
    accent: 'from-emerald-500/30 via-emerald-400/10 to-transparent',
  },
];

const services = [
  {
    title: 'Architecture/RCC Work',
    description: 'Professional architectural design and RCC construction services for commercial and residential projects.',
    icon: Building2,
    features: ['Structural Design', 'RCC Construction', 'Project Management', 'Quality Assurance']
  },
  {
    title: 'Real Estate Consultation',
    description: 'Comprehensive property advisory services with market expertise and personalized solutions.',
    icon: Users,
    features: ['Market Analysis', 'Investment Advisory', 'Due Diligence', 'Valuation Services']
  },
  {
    title: 'Interior Designing',
    description: 'Creating special paradises that define the exact desires of individuals with thoughtful craftsmanship.',
    icon: Palette,
    features: ['Commercial Spaces', 'Villa Design', 'Custom Interiors', '3D Visualization']
  },
  {
    title: 'Property Management',
    description: 'Professional property management services ensuring integrity, professionalism and peace of mind.',
    icon: HomeIcon,
    features: ['Residential Management', 'Commercial Leasing', 'Lease Management', 'Maintenance Services']
  }
];

const testimonials = [
  {
    name: 'Podar International School',
    role: 'Educational Institution',
    content: 'Successfully delivered over 1 Lac sqft space across Navi Mumbai & Pune locations with exceptional service.',
    rating: 5
  },
  {
    name: 'Aamby Valley City',
    role: 'Luxury Development',
    content: 'Professional handling of 75,000 sqft land parcel sale and 61,000 sqft residential leasing with outstanding results.',
    rating: 5
  },
  {
    name: 'Meraki Life',
    role: 'Residential Project',
    content: 'Efficient completion of 10,000 sqft land sale transaction with seamless service and client satisfaction.',
    rating: 5
  }
];

const associations = [
  {
    title: 'Associated Schools',
    description: 'Educational institutions that trust our real estate expertise',
    logos: [
      '/images/Picture1.jpg',
      '/images/Picture2.jpg',
      '/images/Picture3.jpg',
      '/images/Picture4.jpg'
    ]
  },
  {
    title: 'Associated Banks',
    description: 'Financial institutions supporting our projects',
    logos: ['/images/Picture5.jpg', '/images/Picture6.jpg']
  },
  {
    title: 'Associated Diagnostic Centres',
    description: 'Healthcare and diagnostic partners',
    logos: [
      '/images/Picture7.jpg',
      '/images/Picture8.jpg',
      '/images/Picture9.jpg',
      '/images/Picture10.jpg',
      '/images/Picture11.jpg'
    ]
  },
  {
    title: 'Associated Developers',
    description: 'Real estate developers and builders we collaborate with',
    logos: [
      '/images/Picture12.jpg',
      '/images/Picture13.png',
      '/images/Picture14.jpg',
      '/images/Picture15.jpg',
      '/images/Picture16.jpg',
      '/images/Picture17.jpg',
      '/images/Picture18.jpg',
      '/images/Picture19.jpg',
      '/images/Picture20.jpg',
      '/images/Picture21.jpg',
      '/images/Picture22.jpg',
      '/images/Picture23.jpg',
      '/images/Picture24.jpg'
    ]
  },
  {
    title: 'Associated F&B Brands',
    description: 'Food & beverage brands that rely on us for space solutions',
    logos: [
      '/images/Picture25.jpg',
      '/images/Picture26.jpg',
      '/images/Picture27.jpg',
      '/images/Picture28.jpg',
      '/images/Picture29.jpg'
    ]
  },
  {
    title: 'Other Associations',
    description: 'Additional corporate partners across industries',
    logos: [
      '/images/Picture30.png',
      '/images/Picture31.png',
      '/images/Picture32.jpg',
      '/images/Picture33.jpg',
      '/images/Picture34.jpg',
      '/images/Picture35.jpg',
      '/images/Picture36.jpg',
      '/images/Picture37.jpg',
      '/images/Picture38.jpg',
      '/images/Picture39.jpg',
      '/images/Picture40.jpg'
    ]
  }
];

const marqueeLogoItems = associations.flatMap((group) =>
  group.logos.map((logo) => ({ logo, title: group.title.replace(/s$/, '') }))
);

export default function Home() {
  // Removed duplicate popup logic - now using PopupBlocker from layout

  return (
    <div className="min-h-screen bg-background">
      <HeroSection />

      {/* Associations Section */}
      <section className="py-16 marquee-section-bg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge
              variant="secondary"
              className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-blue-700"
            >
              Our Associations
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900">
              Affiliated Brands & Partners
            </h2>
            <p className="mt-3 text-slate-600 max-w-2xl mx-auto">
              A glimpse at the institutions and companies that collaborate with us across sectors.
            </p>
          </div>

          <div className="space-y-10">
            <div className="pt-4">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {associations.map((group) => (
                  <div
                    key={group.title}
                    className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/60"
                  >
                    <h4 className="text-lg font-semibold text-slate-900">{group.title}</h4>
                    <p className="mt-1 text-xs text-slate-500 leading-relaxed">{group.description}</p>
                    <div className="mt-4 flex flex-wrap gap-3">
                      {group.logos.map((logo, idx) => (
                        <div
                          key={`${group.title}-grid-${idx}`}
                          className="association-logo-pill"
                        >
                          <Image
                            src={logo}
                            alt={`${group.title} logo ${idx + 1}`}
                            width={140}
                            height={140}
                            className="object-contain"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="overflow-hidden rounded-3xl border border-white/60 bg-white/80 shadow-[0_18px_45px_-28px_rgba(15,23,42,0.35)]">
              <div className="marquee-row marquee-row-rtl items-center gap-6 py-6">
                {[...marqueeLogoItems, ...marqueeLogoItems].map((item, idx) => (
                  <div
                    key={`marquee-${item.logo}-${idx}`}
                    className="marquee-logo-card"
                  >
                    <div className="marquee-logo-img h-24 w-28 sm:h-28 sm:w-36 lg:h-32 lg:w-40">
                      <Image
                        src={item.logo}
                        alt={`${item.title} logo ${idx % marqueeLogoItems.length + 1}`}
                        width={220}
                        height={220}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <span className="mt-2 text-[0.65rem] font-medium uppercase tracking-wide text-slate-500">
                      {item.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

  {/* Mission Section */}
  <section className="relative py-24 section-blend">
        <div className="absolute inset-0 pointer-events-none opacity-70 mix-blend-screen bg-[radial-gradient(circle_at_top,_rgba(14,116,144,0.14),_transparent_55%)]" aria-hidden />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-6">
            <Badge
              variant="secondary"
              className="mb-2 inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-sky-700"
            >
              Our Mission
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900">
              Putting Soul, Creativity & Purpose into Our Profession
            </h2>
            <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto">
              We craft dependable real estate outcomes with empathy, innovation, and collaboration—aligning every project to the ambitions of the people behind it.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {missionPillars.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.title}
                  className="group relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-8 shadow-xl shadow-slate-200/40 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_32px_60px_-28px_rgba(15,23,42,0.25)]"
                >
                  <span
                    className={`pointer-events-none absolute inset-x-10 -top-28 h-48 rounded-full bg-gradient-to-br ${pillar.accent} opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100`}
                    aria-hidden
                  />
                  <div className="relative flex items-center justify-between">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-100 bg-slate-50 text-sky-700 shadow-inner shadow-sky-200/60">
                      <Icon className="h-7 w-7" />
                    </div>
                    <span className="text-xs uppercase tracking-[0.28em] text-slate-400">Pillar</span>
                  </div>
                  <div className="relative mt-6 space-y-4">
                    <h3 className="text-xl font-semibold text-slate-900">{pillar.title}</h3>
                    <p className="text-sm leading-relaxed text-slate-600">
                      {pillar.description}
                    </p>
                  </div>
                  <div className="relative mt-8 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
                    <span className="h-px w-10 bg-gradient-to-r from-transparent via-slate-300 to-slate-500" />
                    Aligned Outcomes
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

  {/* Services Section */}
  <section className="py-20 section-blend-alt">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <Badge
              variant="secondary"
              className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-indigo-700"
            >
              Core Competencies
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-slate-900">
              Comprehensive Service Portfolio
            </h2>
            <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto">
              From architecture to property management, we partner with you through every milestone—shaping spaces, strategies, and experiences that perform.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {services.map((service, index) => {
              const Icon = service.icon;
              const accentGradients = [
                'from-sky-500/35 via-blue-400/15 to-transparent',
                'from-purple-500/35 via-fuchsia-400/15 to-transparent',
                'from-emerald-500/35 via-teal-400/15 to-transparent',
                'from-amber-500/35 via-orange-400/15 to-transparent',
              ];
              const accent = accentGradients[index % accentGradients.length];

              return (
                <div
                  key={`service-${service.title}-${index}`}
                  className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white p-8 shadow-xl shadow-slate-200/40 transition-transform duration-500 hover:-translate-y-3 hover:shadow-[0_36px_80px_-30px_rgba(15,23,42,0.28)]"
                >
                  <span
                    className={`pointer-events-none absolute -top-32 inset-x-8 h-56 rounded-full bg-gradient-to-br ${accent} opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100`}
                    aria-hidden
                  />
                  <div className="relative flex items-center justify-between pb-6">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-100 bg-slate-50 text-indigo-700 shadow-inner shadow-indigo-200/60">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="text-xs font-medium uppercase tracking-[0.24em] text-slate-400">
                      0{index + 1}
                    </span>
                  </div>
                  <div className="relative space-y-4">
                    <h3 className="text-xl font-semibold text-slate-900">{service.title}</h3>
                    <p className="text-sm leading-relaxed text-slate-600">{service.description}</p>
                  </div>
                  <ul className="relative mt-6 flex flex-col gap-2 text-sm text-slate-600">
                    {service.features.map((feature, featureIndex) => (
                      <li
                        key={`feature-${service.title}-${featureIndex}`}
                        className="flex items-center gap-3 rounded-full border border-slate-100 bg-slate-50/80 px-4 py-2 backdrop-blur-sm transition-colors duration-300 group-hover:border-indigo-200 group-hover:bg-white"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-indigo-500/80" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <div className="relative mt-6 h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
                  <p className="relative mt-4 text-xs uppercase tracking-[0.3em] text-slate-400">
                    Bespoke Support
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

  {/* Team Section */}
  <section className="py-20 section-blend">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <Badge
              variant="secondary"
              className="mb-4 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-700"
            >
              Leadership
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-slate-900">
              Meet Our Founders
            </h2>
            <p className="text-lg sm:text-xl text-slate-600">
              Seven years of excellence under visionary leadership
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-12">
            <Card className="border border-slate-200/70 bg-white/95 shadow-xl shadow-slate-200/40">
              <CardContent className="p-12 text-center space-y-8">
                <div className="mx-auto h-36 w-36 overflow-hidden rounded-[2.5rem] border border-sky-200/80 shadow-xl shadow-sky-200/40">
                  <Image
                    src="/founder1.png"
                    alt="Amisha Khanna"
                    width={144}
                    height={144}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="space-y-1">
                  <h3 className="text-2xl font-bold text-slate-900">Amisha Khanna</h3>
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-600">Founder & Partner</p>
                </div>
                <p className="text-base leading-relaxed text-slate-600">
                  The esteemed founder and Partner of Meraki Squarefoot and Interiors, Amisha has expertly steered the company for seven years, excelling in both property deals and interior projects. Her astute leadership has established Meraki as a trusted name, known for seamless integration of real estate transactions and exquisite interior designs. With a remarkable track record, Amisha continues to redefine standards with her innovative approach.
                </p>
              </CardContent>
            </Card>
            <Card className="border border-slate-200/70 bg-white/95 shadow-xl shadow-slate-200/40">
              <CardContent className="p-12 text-center space-y-8">
                <div className="mx-auto h-36 w-36 overflow-hidden rounded-[2.5rem] border border-violet-200/80 shadow-xl shadow-violet-200/40">
                  <Image
                    src="/founder2.png"
                    alt="Aditya Narang"
                    width={144}
                    height={144}
                    className="h-full w-full object-cover object-top"
                  />
                </div>
                <div className="space-y-1">
                  <h3 className="text-2xl font-bold text-slate-900">Aditya Narang</h3>
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-600">Founder & CEO</p>
                </div>
                <p className="text-base leading-relaxed text-slate-600">
                  The visionary founder and CEO of Meraki Squarefoot and Interiors, Aditya has been at the helm of the company for seven years, adeptly managing property deals and interior projects. With a keen eye for detail and a passion for excellence, Aditya has positioned Meraki as a leader in both the real estate and interior design sectors. Under his leadership, the company continues to thrive, delivering exceptional results in every endeavor.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

  {/* Testimonials Section */}
  <section className="py-20 section-blend-alt">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <Badge
              variant="secondary"
              className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-amber-600"
            >
              Success Stories
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900">
              Our Major Achievements
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              A glimpse into the partnerships we cherish and the measurable impact we deliver across landmark transactions.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <div
                key={`testimonial-${testimonial.name}-${index}`}
                className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white p-8 shadow-xl shadow-slate-200/40 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_70px_-35px_rgba(15,23,42,0.28)]"
              >
                <span className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gradient-to-br from-sky-300/40 via-indigo-300/20 to-transparent opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" aria-hidden />
                <div className="relative mb-6 flex items-center justify-between">
                  <Quote className="h-8 w-8 text-slate-300" />
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={`star-${testimonial.name}-${i}`} className="h-4 w-4 fill-current drop-shadow-[0_0_8px_rgba(250,204,21,0.45)]" />
                    ))}
                  </div>
                </div>
                <p className="relative mb-6 text-sm leading-relaxed text-slate-600">
                  &ldquo;{testimonial.content}&rdquo;
                </p>
                <div className="relative mt-auto pt-4 border-t border-slate-200">
                  <p className="text-base font-semibold text-slate-900">{testimonial.name}</p>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600" aria-hidden />
        <div className="absolute inset-0 opacity-35 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.25),_transparent_55%)]" aria-hidden />
        <div className="absolute inset-y-0 left-1/2 hidden w-[640px] -translate-x-1/2 bg-white/10 blur-3xl sm:block" aria-hidden />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <Badge
            variant="secondary"
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/20 px-5 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-white/90"
          >
            Let&apos;s Collaborate
          </Badge>
          <h2 className="text-3xl lg:text-4xl font-bold mb-5 drop-shadow-[0_10px_30px_rgba(15,23,42,0.35)]">
            Ready to Start Your Real Estate Journey?
          </h2>
          <p className="text-lg sm:text-xl mb-10 text-white/90 max-w-3xl mx-auto">
            Let&apos;s discuss how we can help you find the perfect property or bring your interior design dreams to life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              asChild
              className="text-lg px-9 rounded-full bg-white text-slate-900 hover:bg-slate-100 shadow-[0_18px_40px_-25px_rgba(255,255,255,0.95)]"
            >
              <Link href="/services">Our Services</Link>
            </Button>
            <Button
              size="lg"
              asChild
              className="text-lg px-9 rounded-full bg-white text-slate-900 hover:bg-slate-100 shadow-[0_18px_40px_-25px_rgba(255,255,255,0.95)]"
            >
              <Link href="/work">Our Work</Link>
            </Button>
          </div>
        </div>
      </section>




    </div>
  );
}
