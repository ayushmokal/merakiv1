'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Building2, 
  Users, 
  Award, 
  Home, 
  ArrowRight,
  MapPin,
  Calendar,
  Ruler,
  Eye,
  CheckCircle
} from 'lucide-react';
import Image from 'next/image';
import LeadCaptureModal from '@/components/LeadCaptureModal';

const projects = [
  {
    id: 1,
    title: 'Luxury Residential Villa',
    category: 'Residential',
    location: 'Navi Mumbai',
    area: '4,500 sq ft',
    year: '2023',
    status: 'Completed',
    description: 'Modern luxury villa with contemporary design and premium amenities.',
    services: ['Architecture', 'Interior Design', 'Project Management'],
    image: '/images/Picture1.jpg',
    gallery: ['/images/Picture1.jpg', '/images/Picture2.jpg', '/images/Picture3.jpg']
  },
  {
    id: 2,
    title: 'Commercial Office Complex',
    category: 'Commercial',
    location: 'Mumbai',
    area: '15,000 sq ft',
    year: '2023',
    status: 'Completed',
    description: 'State-of-the-art office complex with modern workspace solutions.',
    services: ['RCC Consultancy', 'Structural Design', 'Project Management'],
    image: '/images/Picture4.jpg',
    gallery: ['/images/Picture4.jpg', '/images/Picture5.jpg', '/images/Picture6.jpg']
  },
  {
    id: 3,
    title: 'Residential Apartment Complex',
    category: 'Residential',
    location: 'Pune',
    area: '25,000 sq ft',
    year: '2022',
    status: 'Completed',
    description: 'Multi-story residential complex with modern amenities and green spaces.',
    services: ['Architecture', 'RCC Consultancy', 'Property Management'],
    image: '/images/Picture7.jpg',
    gallery: ['/images/Picture7.jpg', '/images/Picture8.jpg', '/images/Picture9.jpg']
  },
  {
    id: 4,
    title: 'Premium Interior Design',
    category: 'Interior',
    location: 'Mumbai',
    area: '3,200 sq ft',
    year: '2023',
    status: 'Completed',
    description: 'Elegant interior design for premium residential space with custom furniture.',
    services: ['Interior Design', '3D Visualization', 'Custom Furniture'],
    image: '/images/Picture10.jpg',
    gallery: ['/images/Picture10.jpg', '/images/Picture11.jpg', '/images/Picture12.jpg']
  },
  {
    id: 5,
    title: 'Villa Management Project',
    category: 'Management',
    location: 'Lonavala',
    area: '5,000 sq ft',
    year: '2023',
    status: 'Ongoing',
    description: 'Complete villa management services including maintenance and rental optimization.',
    services: ['Villa Management', 'Property Management', 'Rental Services'],
    image: '/images/Picture13.png',
    gallery: ['/images/Picture13.png', '/images/Picture14.jpg', '/images/Picture15.jpg']
  },
  {
    id: 6,
    title: 'Commercial Interior Fitout',
    category: 'Commercial',
    location: 'Navi Mumbai',
    area: '8,000 sq ft',
    year: '2022',
    status: 'Completed',
    description: 'Modern office interior fitout with collaborative workspaces and meeting rooms.',
    services: ['Interior Design', 'Space Planning', 'Project Management'],
    image: '/images/Picture16.jpg',
    gallery: ['/images/Picture16.jpg', '/images/Picture17.jpg', '/images/Picture18.jpg']
  }
];

const stats = [
  { number: '50+', label: 'Projects Completed' },
  { number: '2.5 Lac+', label: 'Sq. Ft. Delivered' },
  { number: '100+', label: 'Happy Clients' },
  { number: '6+', label: 'Years Experience' }
];

const categories = ['All', 'Residential', 'Commercial', 'Interior', 'Management'];

export default function WorkPage() {
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [showProjectModal, setShowProjectModal] = useState(false);

  const filteredProjects = selectedCategory === 'All' 
    ? projects 
    : projects.filter(project => project.category === selectedCategory);

  const handleProjectClick = (project: any) => {
    setSelectedProject(project);
    setShowProjectModal(true);
  };

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
                    Our Work
                  </Badge>
                  <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                    Portfolio of
                    <br />
                    <span className="text-white/90">Excellence</span>
                  </h1>
                  <p className="text-xl text-white/80 leading-relaxed">
                    Explore our portfolio of exceptional projects that showcase our commitment to quality, 
                    innovation, and client satisfaction across residential and commercial spaces.
                  </p>
                </div>
                
                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
                  {stats.map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className="text-2xl lg:text-3xl font-bold text-white mb-2">
                        {stat.number}
                      </div>
                      <div className="text-sm text-white/70">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className="px-6 py-2"
              >
                {category}
              </Button>
            ))}
                  </div>
                  
          {/* Projects Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <Card key={project.id} className="group cursor-pointer hover:shadow-xl transition-all duration-300">
                <CardContent className="p-0">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <Image
                      src={project.image}
                      alt={project.title}
                      width={400}
                      height={300}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleProjectClick(project)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                          </div>
                    <Badge 
                      variant={project.status === 'Completed' ? 'default' : 'secondary'}
                      className="absolute top-4 right-4"
                    >
                      {project.status}
                    </Badge>
                        </div>
                  
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="text-xs">
                        {project.category}
                      </Badge>
                      <span className="text-sm text-muted-foreground">{project.year}</span>
              </div>
              
                    <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                    <p className="text-muted-foreground text-sm mb-4">{project.description}</p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 mr-2" />
                        {project.location}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Ruler className="h-4 w-4 mr-2" />
                        {project.area}
                      </div>
                      </div>
                      
                    <div className="flex flex-wrap gap-1">
                      {project.services.slice(0, 2).map((service, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {service}
                        </Badge>
                      ))}
                      {project.services.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{project.services.length - 2} more
                        </Badge>
                      )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
            ))}
              </div>
            </div>
          </section>

      {/* Process Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">Our Process</Badge>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              How We Work
            </h2>
            <p className="text-xl text-muted-foreground">
              Our systematic approach ensures every project meets the highest standards of quality and excellence.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Consultation', description: 'Understanding your vision and requirements' },
              { step: '02', title: 'Planning', description: 'Detailed planning and design development' },
              { step: '03', title: 'Execution', description: 'Professional implementation with quality control' },
              { step: '04', title: 'Delivery', description: 'Final handover and ongoing support' }
            ].map((item, index) => (
              <Card key={index} className="text-center p-6">
                <CardContent className="p-0">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>



      {/* Project Details Modal */}
      <Dialog open={showProjectModal} onOpenChange={setShowProjectModal}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedProject?.title}</DialogTitle>
          </DialogHeader>
          
          {selectedProject && (
            <div className="space-y-6">
              <div className="relative">
                <Image
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  width={600}
                  height={400}
                  className="w-full h-64 object-cover rounded-lg"
                />
                <Badge 
                  variant={selectedProject.status === 'Completed' ? 'default' : 'secondary'}
                  className="absolute top-4 right-4"
                >
                  {selectedProject.status}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Location</p>
                  <p className="font-semibold">{selectedProject.location}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Area</p>
                  <p className="font-semibold">{selectedProject.area}</p>
            </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Year</p>
                  <p className="font-semibold">{selectedProject.year}</p>
            </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Category</p>
                  <p className="font-semibold">{selectedProject.category}</p>
            </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Description</p>
                <p className="text-muted-foreground">{selectedProject.description}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Services Provided</p>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.services.map((service: string, idx: number) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {service}
                    </Badge>
                  ))}
          </div>
        </div>
              
              <div className="flex gap-4 pt-4">
                <Button onClick={() => setShowLeadModal(true)} className="flex-1">
                  Start Similar Project
                </Button>
                <Button variant="outline" onClick={() => setShowProjectModal(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Ready to Start Your Real Estate Journey?
          </h2>
          <p className="text-xl mb-8 text-primary-foreground/90">
            Let's discuss how we can help you find the perfect property or bring your interior design dreams to life.
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