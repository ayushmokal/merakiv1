'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Building2, Users, Award, MapPin, Phone, Mail, Star } from 'lucide-react';
import LeadCaptureModal from '@/components/LeadCaptureModal';

const services = [
  {
    title: 'RCC Consultancy',
    description: 'Expert structural engineering and RCC design solutions for residential and commercial projects.',
    icon: Building2,
    features: ['Structural Analysis', 'Foundation Design', 'Seismic Assessment', 'Quality Control']
  },
  {
    title: 'Property Consultancy',
    description: 'Comprehensive property advisory services from acquisition to development.',
    icon: Users,
    features: ['Market Analysis', 'Investment Advisory', 'Due Diligence', 'Valuation Services']
  },
  {
    title: 'Interior Designing',
    description: 'Transform spaces with our innovative and functional interior design solutions.',
    icon: Award,
    features: ['Space Planning', '3D Visualization', 'Custom Furniture', 'Project Management']
  }
];

const stats = [
  { number: '150+', label: 'Projects Completed' },
  { number: '12+', label: 'Years Experience' },
  { number: '98%', label: 'Client Satisfaction' },
  { number: '50+', label: 'Expert Team' }
];

const testimonials = [
  {
    name: 'Rajesh Kumar',
    role: 'Property Developer',
    content: 'Exceptional service and attention to detail. They transformed our vision into reality.',
    rating: 5
  },
  {
    name: 'Priya Sharma',
    role: 'Homeowner',
    content: 'Professional team with innovative solutions. Highly recommend their interior design services.',
    rating: 5
  },
  {
    name: 'Amit Patel',
    role: 'Architect',
    content: 'Outstanding RCC consultancy services. Their expertise saved us time and costs.',
    rating: 5
  }
];

export default function Home() {
  const [showLeadModal, setShowLeadModal] = useState(false);

  useEffect(() => {
    const hasSeenModal = localStorage.getItem('leadModalSeen');
    const modalTimestamp = localStorage.getItem('leadModalTimestamp');
    
    if (!hasSeenModal || (modalTimestamp && Date.now() - parseInt(modalTimestamp) > 30 * 24 * 60 * 60 * 1000)) {
      const timer = setTimeout(() => {
        setShowLeadModal(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-black text-white">
        <div className="absolute inset-0">
            <img
                src="/hero.png"
                alt="Modern architecture"
                className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/20" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="min-h-[80vh] flex flex-col justify-center py-20">
              <div className="max-w-2xl space-y-8">
                <div className="space-y-4">
                  <Badge variant="secondary" className="w-fit bg-white/10 border-white/20 text-white">
                    Premium Architecture & Property Services
                  </Badge>
                  <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                    Building Dreams,
                    <br />
                    <span className="text-white/90"> Creating Futures</span>
                  </h1>
                  <p className="text-xl text-white/80 leading-relaxed">
                    From architectural design to property management, we provide comprehensive solutions 
                    that transform your vision into exceptional reality.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" asChild className="text-lg px-8">
                    <Link href="/projects">
                      View Our Work <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild className="text-lg px-8 border-white text-white hover:bg-white hover:text-primary">
                    <Link href="/services">Our Services</Link>
                  </Button>
                </div>
                <div className="pt-8">
                    <div className="inline-flex bg-white/10 backdrop-blur-sm p-4 rounded-2xl shadow-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                            <Award className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <p className="font-semibold">Award Winning</p>
                            <p className="text-sm text-white/70">Design Excellence</p>
                          </div>
                        </div>
                    </div>
                </div>
              </div>
            </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl lg:text-5xl font-bold mb-2">{stat.number}</div>
                <div className="text-primary-foreground/80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">Client Stories</Badge>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              What Our Clients Say
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-8">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-6 italic">"{testimonial.content}"</p>
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
            Ready to Start Your Project?
          </h2>
          <p className="text-xl mb-8 text-primary-foreground/90">
            Let's discuss how we can bring your architectural and property dreams to life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild className="text-lg px-8">
              <Link href="/contact">Get Free Consultation</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-lg px-8 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
              <Link href="/projects">View Portfolio</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Building2 className="h-8 w-8" />
                <span className="text-xl font-bold">ArchProp</span>
              </div>
              <p className="text-slate-300">
                Building exceptional spaces and creating lasting value through innovative 
                architecture and property solutions.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-slate-300">
                <li><Link href="/services" className="hover:text-white transition-colors">RCC Consultancy</Link></li>
                <li><Link href="/services" className="hover:text-white transition-colors">Property Consultancy</Link></li>
                <li><Link href="/services" className="hover:text-white transition-colors">Interior Design</Link></li>
                <li><Link href="/services" className="hover:text-white transition-colors">Villa Management</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-slate-300">
                <li><Link href="/projects" className="hover:text-white transition-colors">Projects</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <div className="space-y-3 text-slate-300">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span>Mumbai, Maharashtra</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <span>+91 98765 43210</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>info@archprop.com</span>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-12 pt-8 text-center text-slate-400">
            <p>&copy; 2024 ArchProp. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <LeadCaptureModal 
        isOpen={showLeadModal} 
        onClose={() => setShowLeadModal(false)} 
      />
    </div>
  );
}