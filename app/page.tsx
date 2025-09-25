'use client';

// Removed useState and useEffect - no longer needed for popup logic
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import HeroSection from '@/components/HeroSection';
import { Building2, Users, Award, Star, Home as HomeIcon, Palette } from 'lucide-react';
// Removed LeadCaptureModal import - now using PopupBlocker from layout
import Image from 'next/image';

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

const logoImages = [
  '/images/Picture1.jpg', '/images/Picture2.jpg', '/images/Picture3.jpg', '/images/Picture4.jpg', '/images/Picture5.jpg', '/images/Picture6.jpg', '/images/Picture7.jpg', '/images/Picture8.jpg', '/images/Picture9.jpg', '/images/Picture10.jpg', '/images/Picture11.jpg', '/images/Picture12.jpg', '/images/Picture13.png', '/images/Picture14.jpg', '/images/Picture15.jpg', '/images/Picture16.jpg', '/images/Picture17.jpg', '/images/Picture18.jpg', '/images/Picture19.jpg', '/images/Picture20.jpg', '/images/Picture21.jpg', '/images/Picture22.jpg', '/images/Picture23.jpg', '/images/Picture24.jpg', '/images/Picture25.jpg', '/images/Picture26.jpg', '/images/Picture27.jpg', '/images/Picture28.jpg', '/images/Picture29.jpg', '/images/Picture30.png', '/images/Picture31.png', '/images/Picture32.jpg', '/images/Picture33.jpg', '/images/Picture34.jpg', '/images/Picture35.jpg', '/images/Picture36.jpg', '/images/Picture37.jpg', '/images/Picture38.jpg', '/images/Picture39.jpg', '/images/Picture40.jpg'
];

export default function Home() {
  // Removed duplicate popup logic - now using PopupBlocker from layout

  return (
    <div className="min-h-screen bg-background">
      <HeroSection />

      {/* Marquee Logos Section */}
      <section className="py-12 marquee-section-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <div className="text-center">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2">
              Brands We Worked With
            </h2>
            <p className="text-gray-600">
              Trusted by leading companies and organizations
            </p>
          </div>
        </div>
        <div className="overflow-hidden">
          {/* Row 1: Right to Left */}
          <div className="marquee-row marquee-row-rtl flex items-center space-x-8 py-4">
            {[...logoImages, ...logoImages].map((src, idx) => (
              <div key={`rtl-${src}-${idx}`} className="flex-shrink-0 marquee-logo-img">
                <Image src={src} alt="Logo" width={250} height={250} className="object-contain hover:scale-105 transition duration-300" />
              </div>
            ))}
          </div>
          {/* Row 2: Left to Right */}
          <div className="marquee-row marquee-row-ltr flex items-center space-x-8 py-4">
            {[...logoImages, ...logoImages].map((src, idx) => (
              <div key={`ltr-${src}-${idx}`} className="flex-shrink-0 marquee-logo-img">
                <Image src={src} alt="Logo" width={250} height={250} className="object-contain hover:scale-105 transition duration-300" />
              </div>
            ))}
          </div>
        </div>
      </section>

  {/* Mission Section */}
  <section className="py-20 section-blend">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">Our Mission</Badge>
            <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-white">
              Putting Soul, Creativity & Purpose into Our Profession
            </h2>
            <p className="text-xl text-white max-w-4xl mx-auto">
              We are on a mission to provide reliable real estate solutions with ethical and socially conscious practices, 
              offering one-stop solutions for all your real estate requirements.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Honest & Transparent</h3>
                <p className="text-muted-foreground">
                  We provide honest, transparent, and personalized real estate solutions that help clients make informed property decisions.
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Innovation & Excellence</h3>
                <p className="text-muted-foreground">
                  We drive growth through innovative real estate practices, market expertise, and a commitment to excellence in service delivery.
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building2 className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Integrated Approach</h3>
                <p className="text-muted-foreground">
                  Our integrated team approach ensures client needs are dealt with quickly and efficiently across all services.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

  {/* Services Section */}
  <section className="py-20 section-blend-alt">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">Core Competencies</Badge>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-white">
              Comprehensive Service Portfolio
            </h2>
            <p className="text-xl text-white">
              From architecture to property management, we offer tailor-made services for all types of property transactions.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <Card key={`service-${service.title}-${index}`} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <service.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                  <p className="text-muted-foreground mb-4">{service.description}</p>
                  <ul className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <li key={`feature-${service.title}-${featureIndex}`} className="text-sm text-muted-foreground flex items-center">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

  {/* Team Section */}
  <section className="py-20 section-blend">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">Leadership</Badge>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-white">
              Meet Our Founders
            </h2>
            <p className="text-xl text-white">
              Seven years of excellence under visionary leadership
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-12">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="h-16 w-16 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Amisha Khanna</h3>
                <p className="text-primary font-semibold mb-4">Founder & Partner</p>
                <p className="text-muted-foreground leading-relaxed">
                  The esteemed founder and Partner of Meraki Squarefoots and Interiors, Amisha has expertly steered the company for seven years, 
                  excelling in both property deals and interior projects. Her astute leadership has established Meraki as a trusted name, 
                  known for seamless integration of real estate transactions and exquisite interior designs. With a remarkable track record, 
                  Amisha continues to redefine standards in property and interior industries with her innovative approach.
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Award className="h-16 w-16 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Aditya Narang</h3>
                <p className="text-primary font-semibold mb-4">Founder & CEO</p>
                <p className="text-muted-foreground leading-relaxed">
                  The visionary founder and CEO of Meraki Squarefoots and Interiors, Aditya has been at the helm of the company for the past seven years, 
                  adeptly managing property deals and interior projects. With a keen eye for detail and a passion for excellence, 
                  Aditya has positioned Meraki as a leader in both the real estate and interior design sectors. Under his leadership, 
                  the company continues to thrive, delivering exceptional results in every endeavor.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

  {/* Testimonials Section */}
  <section className="py-20 section-blend-alt">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">Success Stories</Badge>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-white">
              Our Major Achievements
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={`testimonial-${testimonial.name}-${index}`} className="border-0 shadow-lg">
                <CardContent className="p-8">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={`star-${testimonial.name}-${i}`} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-6 italic">&ldquo;{testimonial.content}&rdquo;</p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Ready to Start Your Real Estate Journey?
          </h2>
          <p className="text-xl mb-8 text-primary-foreground/90">
            Let&apos;s discuss how we can help you find the perfect property or bring your interior design dreams to life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild className="text-lg px-8">
              <Link href="/services">Our Services</Link>
            </Button>
            <Button size="lg" variant="secondary" asChild className="text-lg px-8">
              <Link href="/work">Our Work</Link>
            </Button>
          </div>
        </div>
      </section>




    </div>
  );
}
