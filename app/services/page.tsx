'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Building2, 
  Users, 
  Award, 
  Home, 
  FileText, 
  CheckCircle, 
  ArrowRight,
  Phone, 
  Mail, 
  MapPin, 
  Star
} from 'lucide-react';
import LeadCaptureModal from '@/components/LeadCaptureModal';
import { useToast } from '@/hooks/use-toast';
import MediaCarousel from '@/components/MediaCarousel';

const services = [
  {
    id: 'rcc-consultancy',
    title: 'RCC Consultancy',
    description: 'Expert structural engineering and RCC design solutions for residential and commercial projects with focus on safety, durability, and cost-effectiveness.',
    icon: Building2,
    features: [
      'Advanced Structural Analysis',
      'Cost-Optimized Foundation Design',
      'Earthquake-Resistant Engineering',
      'Comprehensive Quality Assurance'
    ],
    benefits: [
      'Maximum safety & reliability',
      'Reduced construction costs',
      'Compliant with building codes',
      'Extended building lifespan'
    ],
    process: [
      'Site Assessment',
      'Structural Analysis',
      'Design Development',
      'Documentation',
      'Construction Support'
    ],
    pricing: 'Starting from ₹50,000',
    duration: '2-8 weeks'
  },
  {
    id: 'property-consultancy',
    title: 'Property Consultancy',
    description: 'Comprehensive property advisory services from market analysis to investment guidance, helping you make informed real estate decisions.',
    icon: Users,
    features: [
      'In-Depth Market Research',
      'Strategic Investment Planning',
      'Thorough Property Inspection',
      'Accurate Property Pricing'
    ],
    benefits: [
      'Data-driven investment choices',
      'Maximized investment returns',
      'Risk-free property purchase',
      'Fair market value deals'
    ],
    process: [
      'Requirement Analysis',
      'Market Research',
      'Property Evaluation',
      'Advisory Report',
      'Implementation Support'
    ],
    pricing: 'Starting from ₹25,000',
    duration: '1-4 weeks'
  },
  {
    id: 'interior-designing',
    title: 'Interior Designing',
    description: 'Transform your spaces with innovative and functional interior design solutions that reflect your personality and lifestyle.',
    icon: Award,
    features: [
      'Smart Space Optimization',
      'Realistic 3D Previews',
      'Bespoke Furniture Creation',
      'Premium Material Curation'
    ],
    benefits: [
      'Every inch utilized efficiently',
      'See before you invest',
      'Unique personalized interiors',
      'Luxury finishes & durability'
    ],
    process: [
      'Consultation & Brief',
      'Concept Development',
      '3D Visualization',
      'Design Finalization',
      'Implementation'
    ],
    pricing: 'Starting from ₹1,50,000',
    duration: '4-12 weeks'
  },
  {
    id: 'villa-management',
    title: 'Villa Management',
    description: 'Complete villa management services ensuring your property is well-maintained, secure, and generating optimal returns.',
    icon: Home,
    features: [
      'Proactive Property Upkeep',
      '24/7 Security Monitoring',
      'Professional Tenant Screening',
      'Dynamic Rental Pricing'
    ],
    benefits: [
      'Zero maintenance worries',
      'Complete property protection',
      'Quality tenants guaranteed',
      'Optimal rental income'
    ],
    process: [
      'Property Assessment',
      'Management Plan',
      'Service Implementation',
      'Regular Monitoring',
      'Performance Review'
    ],
    pricing: '3-5% of rental income',
    duration: 'Ongoing service'
  },
  {
    id: 'property-management',
    title: 'Property Management & Registration',
    description: 'End-to-end property management and registration services ensuring legal compliance and smooth property transactions.',
    icon: FileText,
    features: [
      'Seamless Property Registration',
      'Complete Legal Documentation',
      'Verified Title Clearance',
      'All NOC Procurement'
    ],
    benefits: [
      'Fully legal property ownership',
      'Zero documentation hassles',
      'Clear & disputed-free titles',
      'All approvals secured'
    ],
    process: [
      'Document Review',
      'Legal Verification',
      'Registration Process',
      'Compliance Check',
      'Handover'
    ],
    pricing: 'Starting from ₹15,000',
    duration: '2-6 weeks'
  }
];

const testimonials = [
  {
    name: 'Rajesh Kumar',
    role: 'Property Developer',
    service: 'RCC Consultancy',
    content: 'Their structural engineering expertise saved us significant costs while ensuring top-notch safety standards.',
    rating: 5
  },
  {
    name: 'Priya Sharma',
    role: 'Homeowner',
    service: 'Interior Design',
    content: 'Transformed our home beautifully. The 3D visualization helped us see the final result before implementation.',
    rating: 5
  },
  {
    name: 'Amit Patel',
    role: 'Investor',
    service: 'Property Consultancy',
    content: 'Excellent market insights and advisory. Their guidance helped me make profitable investment decisions.',
    rating: 5
  }
];

export default function ServicesPage() {
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [selectedService, setSelectedService] = useState<string>('');
  const [enquiryForm, setEnquiryForm] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: '',
    budget_range: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleEnquiry = (serviceId: string) => {
    setSelectedService(serviceId);
    setEnquiryForm(prev => ({ ...prev, service: serviceId }));
  };

  const handleEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!enquiryForm.name || !enquiryForm.email || !enquiryForm.service) {
      toast({
        title: "Required fields missing",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...enquiryForm,
          interest: enquiryForm.service,
          name: enquiryForm.name,
          email: enquiryForm.email,
          phone: enquiryForm.phone,
          message: enquiryForm.message,
          budget_range: enquiryForm.budget_range
        }),
      });

      if (response.ok) {
        toast({
          title: "Enquiry submitted!",
          description: "We'll get back to you within 24 hours.",
        });
        
        setEnquiryForm({
          name: '',
          email: '',
          phone: '',
          service: '',
          message: '',
          budget_range: ''
        });
        setSelectedService('');
      } else {
        throw new Error('Failed to submit');
      }
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "Please try again or contact us directly.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToService = (serviceId: string) => {
    const element = document.getElementById(serviceId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Spotlight images for Interior Designing
  const interiorImages: string[] = [
    '/images/interior_images/WhatsApp Image 2025-07-17 at 14.51.51.jpeg',
    '/images/interior_images/WhatsApp Image 2025-07-17 at 14.51.51 (1).jpeg',
    '/images/interior_images/WhatsApp Image 2025-07-17 at 14.51.52.jpeg',
    '/images/interior_images/WhatsApp Image 2025-07-17 at 14.51.52 (1).jpeg',
    '/images/interior_images/WhatsApp Image 2025-07-17 at 14.51.52 (2).jpeg',
    '/images/interior_images/WhatsApp Image 2025-07-17 at 14.51.53.jpeg',
    '/images/interior_images/WhatsApp Image 2025-07-17 at 14.51.53 (1).jpeg',
    '/images/interior_images/WhatsApp Image 2025-07-17 at 14.51.53 (2).jpeg',
    '/images/interior_images/WhatsApp Image 2025-07-17 at 14.51.53 (3).jpeg',
    '/images/interior_images/WhatsApp Image 2025-07-17 at 14.51.54.jpeg',
    '/images/interior_images/WhatsApp Image 2025-07-17 at 14.51.54 (1).jpeg',
    '/images/interior_images/WhatsApp Image 2025-07-17 at 14.51.54 (2).jpeg',
    '/images/interior_images/WhatsApp Image 2025-07-17 at 14.51.55.jpeg',
    '/images/interior_images/WhatsApp Image 2025-07-17 at 14.51.55 (1).jpeg',
    '/images/interior_images/WhatsApp Image 2025-07-17 at 14.51.55 (2).jpeg',
    '/images/interior_images/WhatsApp Image 2025-07-17 at 14.51.56.jpeg',
    '/images/interior_images/WhatsApp Image 2025-07-17 at 14.51.56 (1).jpeg',
    '/images/interior_images/WhatsApp Image 2025-07-17 at 14.51.56 (2).jpeg',
  ];

  return (
    <div className="min-h-screen bg-background services-page-bg">
      {/* Hero Section - extends behind navbar */}
      <section className="relative bg-black text-white -mt-[80px] lg:-mt-[88px] pt-[80px] lg:pt-[88px]">
        <div className="absolute inset-0">
            <Image
                src="/hero.png"
                alt="Modern architecture"
                fill
                className="object-cover"
                priority
            />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="min-h-[80vh] flex flex-col justify-center py-20">
              <div className="max-w-2xl space-y-8">
                <div className="space-y-4">
                  <Badge variant="secondary" className="w-fit bg-white/10 border-white/20 text-white">
                    Our Services
                  </Badge>
                  <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                    Comprehensive Property
                    <br />
                    <span className="text-white/90">Solutions</span>
                  </h1>
                  <p className="text-xl text-white/80 leading-relaxed">
                    From architectural design to property management, we provide end-to-end services 
                    that transform your vision into exceptional reality with uncompromising professionalism.
                  </p>
                </div>
                
                {/* Service Navigation */}
                <div className="flex flex-wrap gap-4">
                  {services.map((service) => (
                    <Button
                      key={service.id}
                      variant="secondary"
                      onClick={() => scrollToService(service.id)}
                      className="text-sm"
                    >
                      {service.title}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
        </div>
      </section>

      {/* Interior Designing Spotlight */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div className="w-full h-[320px] sm:h-[420px] rounded-xl overflow-hidden shadow-lg bg-white">
              <MediaCarousel
                media={interiorImages.map((p) => encodeURI(p))}
                title="Interior Designing"
                className="h-[320px] sm:h-[420px]"
              />
            </div>
            <div>
              <Badge variant="secondary" className="mb-3">Spotlight</Badge>
              <h2 className="text-3xl lg:text-4xl font-bold mb-3">Interior Designing</h2>
              <p className="text-muted-foreground mb-6">
                Elevate your spaces with premium finishes, custom furniture, and functional layouts. Explore a glimpse of our recent interior work and get a tailored quote today.
              </p>
              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                <div className="space-y-2">
                  <div className="flex items-center text-sm"><CheckCircle className="h-4 w-4 text-green-600 mr-2"/>3D visualizations</div>
                  <div className="flex items-center text-sm"><CheckCircle className="h-4 w-4 text-green-600 mr-2"/>Material curation</div>
                  <div className="flex items-center text-sm"><CheckCircle className="h-4 w-4 text-green-600 mr-2"/>Space optimization</div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center text-sm"><CheckCircle className="h-4 w-4 text-green-600 mr-2"/>Custom furniture</div>
                  <div className="flex items-center text-sm"><CheckCircle className="h-4 w-4 text-green-600 mr-2"/>On-site execution</div>
                  <div className="flex items-center text-sm"><CheckCircle className="h-4 w-4 text-green-600 mr-2"/>Budget-friendly options</div>
                </div>
              </div>

              <Dialog>
                <DialogTrigger asChild>
                  <Button size="lg" onClick={() => handleEnquiry('interior-designing')}>
                    Get Quote <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Get Quote for Interior Designing</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleEnquirySubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Name *</Label>
                        <Input
                          id="name"
                          value={enquiryForm.name}
                          onChange={(e) => setEnquiryForm({ ...enquiryForm, name: e.target.value })}
                          placeholder="Your name"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={enquiryForm.email}
                          onChange={(e) => setEnquiryForm({ ...enquiryForm, email: e.target.value })}
                          placeholder="your@email.com"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={enquiryForm.phone}
                        onChange={(e) => setEnquiryForm({ ...enquiryForm, phone: e.target.value })}
                        placeholder="9930910004 / 9820274467"
                      />
                    </div>

                    <div>
                      <Label htmlFor="budget">Budget Range</Label>
                      <Select value={enquiryForm.budget_range} onValueChange={(value) => setEnquiryForm({ ...enquiryForm, budget_range: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select budget range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="under-5l">Under ₹5 Lakhs</SelectItem>
                          <SelectItem value="5l-15l">₹5 - 15 Lakhs</SelectItem>
                          <SelectItem value="15l-50l">₹15 - 50 Lakhs</SelectItem>
                          <SelectItem value="50l-1cr">₹50 Lakhs - 1 Crore</SelectItem>
                          <SelectItem value="above-1cr">Above ₹1 Crore</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        value={enquiryForm.message}
                        onChange={(e) => setEnquiryForm({ ...enquiryForm, message: e.target.value })}
                        placeholder="Tell us about your requirements..."
                        rows={3}
                      />
                    </div>

                    <Button type="submit" disabled={isSubmitting} className="w-full">
                      {isSubmitting ? 'Submitting...' : 'Submit Enquiry'}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </section>

      {/* Divider between spotlight and services */}
      <div className="section-divider" />

      {/* Services Sections */}
      <div className="container-rhythm section-y">
        {services.map((service, index) => (
          <section key={service.id} id={service.id} className="service-section-bg">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Content */}
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                    <service.icon className="h-6 w-6 text-primary" />
                  </div>
                  <Badge variant="secondary">{service.title}</Badge>
                </div>
                
                <h2 className="text-3xl lg:text-4xl font-bold mb-4">{service.title}</h2>
                <p className="text-lg text-muted-foreground mb-6">{service.description}</p>
                
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <h4 className="font-semibold mb-3">Key Features</h4>
                    <ul className="space-y-2">
                      {service.features.slice(0, 4).map((feature, idx) => (
                        <li key={idx} className="flex items-center text-sm">
                          <CheckCircle className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
        </div>

                  <div>
                    <h4 className="font-semibold mb-3">Benefits</h4>
                    <ul className="space-y-2">
                      {service.benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-center text-sm">
                          <div className="w-2 h-2 bg-primary rounded-full mr-3 flex-shrink-0"></div>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="lg" onClick={() => handleEnquiry(service.id)}>
                        Enquire Now <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Enquire about {service.title}</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleEnquirySubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                    <div>
                            <Label htmlFor="name">Name *</Label>
                      <Input
                        id="name"
                              value={enquiryForm.name}
                              onChange={(e) => setEnquiryForm({ ...enquiryForm, name: e.target.value })}
                              placeholder="Your name"
                        required
                      />
                    </div>
                    <div>
                            <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                              value={enquiryForm.email}
                              onChange={(e) => setEnquiryForm({ ...enquiryForm, email: e.target.value })}
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                  </div>

                    <div>
                          <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                            value={enquiryForm.phone}
                            onChange={(e) => setEnquiryForm({ ...enquiryForm, phone: e.target.value })}
                        placeholder="9930910004 / 9820274467"
                      />
                  </div>

                  <div>
                    <Label htmlFor="budget">Budget Range</Label>
                          <Select value={enquiryForm.budget_range} onValueChange={(value) => setEnquiryForm({ ...enquiryForm, budget_range: value })}>
                      <SelectTrigger>
                              <SelectValue placeholder="Select budget range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="under-5l">Under ₹5 Lakhs</SelectItem>
                        <SelectItem value="5l-15l">₹5 - 15 Lakhs</SelectItem>
                        <SelectItem value="15l-50l">₹15 - 50 Lakhs</SelectItem>
                        <SelectItem value="50l-1cr">₹50 Lakhs - 1 Crore</SelectItem>
                        <SelectItem value="above-1cr">Above ₹1 Crore</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                          <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                            value={enquiryForm.message}
                            onChange={(e) => setEnquiryForm({ ...enquiryForm, message: e.target.value })}
                            placeholder="Tell us about your requirements..."
                            rows={3}
                    />
                  </div>

                        <Button type="submit" disabled={isSubmitting} className="w-full">
                          {isSubmitting ? 'Submitting...' : 'Submit Enquiry'}
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                    </div>
                  </div>
                  
              {/* Service Details Card */}
              <div>
                <Card className="card-soft">
                  <CardContent className="p-8">
                    <div className="space-y-6">
                    <div>
                        <h4 className="font-semibold mb-3">Our Process</h4>
                        <div className="space-y-3">
                          {service.process.map((step, idx) => (
                            <div key={idx} className="flex items-center space-x-3">
                              <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-xs font-medium text-primary">
                                {idx + 1}
                              </div>
                              <span className="text-sm">{step}</span>
                            </div>
                          ))}
                    </div>
                  </div>
                  
                      <div className="pt-4 border-t">
                        <h5 className="font-medium mb-2">All Features Include:</h5>
                        <div className="grid grid-cols-1 gap-1">
                          {service.features.map((feature, idx) => (
                            <div key={idx} className="flex items-center text-xs">
                              <CheckCircle className="h-3 w-3 text-green-600 mr-2 flex-shrink-0" />
                              {feature}
                            </div>
                          ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
              </div>
            </div>
          </section>
        ))}
      </div>

      {/* Testimonials */}
      <section className="section-y bg-slate-50">
        <div className="container-rhythm">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">Client Testimonials</Badge>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              What Our Clients Say
            </h2>
            <p className="text-xl text-muted-foreground">
              Real feedback from clients who have experienced our services.
            </p>
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
                  <p className="text-muted-foreground mb-4 italic">&ldquo;{testimonial.content}&rdquo;</p>
                  <div className="mb-2">
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
                  <Badge variant="outline" className="text-xs">
                    {testimonial.service}
                  </Badge>
              </CardContent>
            </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-y bg-primary text-primary-foreground">
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

      <LeadCaptureModal 
        isOpen={showLeadModal} 
        onClose={() => setShowLeadModal(false)} 
      />
    </div>
  );
}
