'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building2, Calendar, MapPin, ArrowRight, Filter, Loader2 } from 'lucide-react';
import LeadCaptureModal from '@/components/LeadCaptureModal';
import EnquiryModal from '@/components/EnquiryModal';

// Update interface to match sheet structure
interface Project {
  srNo: number;
  configuration: string;
  carpetSize: number;
  builtUp: number;
  node: string;
  price: string;
}

interface ProjectsData {
  resellProjects: Project[];
  underConstructionProjects: Project[];
}

const SHEET_API_URL = "https://script.google.com/macros/s/AKfycbxkXVCYek1QHVV65D851aCdrZIbbNSfNnN4KPrLL7hhLqjRXMlvvB3XVI5YBxaqY4WZ/exec";

export default function ProjectsPage() {
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSection, setSelectedSection] = useState<'resell' | 'under-construction'>('resell');
  const [projectsData, setProjectsData] = useState<ProjectsData>({
    resellProjects: [],
    underConstructionProjects: []
  });

  useEffect(() => {
    // Check if user should see lead modal
    const hasSeenModal = localStorage.getItem('leadModalSeen');
    const modalTimestamp = localStorage.getItem('leadModalTimestamp');
    
    if (!hasSeenModal || (modalTimestamp && Date.now() - parseInt(modalTimestamp) > 30 * 24 * 60 * 60 * 1000)) {
      setShowLeadModal(true);
    }

    if (!SHEET_API_URL) {
      console.error("Projects API URL not configured.");
      setLoading(false);
      return;
    }
    
    // Fetch projects from Google Sheets
    fetch(SHEET_API_URL)
      .then(res => res.json())
      .then(response => {
        if (response.status === 'success') {
          setProjectsData(response.data);
        } else {
          console.error('Error from Google Script:', response.message);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching projects:', error);
        setLoading(false);
      });
  }, []);

  const handleEnquiryClick = (project: Project) => {
    setSelectedProject(project);
    setShowEnquiryModal(true);
  };

  // Modern, creative card with Enquire Now button
  const ProjectCard = ({ project, type }: { project: Project; type: 'resell' | 'under-construction' }) => (
    <Card className="rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 bg-white flex flex-col justify-between min-h-[220px] p-0">
      <CardContent className="p-6 flex flex-col h-full">
        {/* Card Header: Configuration & Price */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-lg font-bold text-gray-900">{project.configuration}</span>
          <span className="text-lg font-bold text-primary">₹{project.price}</span>
        </div>
        <div className="border-b mb-4" />
        {/* Details Section */}
        <div className="space-y-2 text-sm text-gray-700 mb-6">
          <div className="flex justify-between">
            <span className="font-medium text-gray-500">S R NO</span>
            <span>{project.srNo}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-500">Carpet Size</span>
            <span>{project.carpetSize}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-500">Built up</span>
            <span>{project.builtUp}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-500">Node</span>
            <span>{project.node}</span>
          </div>
        </div>
        <Button 
          className="w-full mt-auto font-semibold rounded-lg bg-primary text-white hover:bg-primary/90 transition" 
          size="lg"
          onClick={() => handleEnquiryClick(project)}
        >
          Enquire Now
        </Button>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">Our Projects</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Explore our portfolio of exceptional architectural and property development projects
              that showcase our commitment to excellence and innovation.
            </p>
          </div>
          {/* Toggle Button Group */}
          <div className="flex justify-center mb-10">
            <div className="inline-flex rounded-lg shadow-sm border border-gray-200 bg-white overflow-hidden">
                <button
                  className={`px-6 py-2 font-semibold text-base transition-colors duration-200 focus:outline-none bg-primary text-white`}
                >
                  Resell Projects
                </button>
                <button
                  className={`px-6 py-2 font-semibold text-base transition-colors duration-200 focus:outline-none bg-white text-gray-700 hover:bg-gray-100`}
                >
                  Under Construction Projects
                </button>
            </div>
          </div>
          <div className="flex justify-center items-center h-64">
            <div className="flex items-center space-x-3 text-xl text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span>Loading projects...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">Our Projects</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore our portfolio of exceptional architectural and property development projects 
            that showcase our commitment to excellence and innovation.
          </p>
        </div>

        {/* Toggle Button Group */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex rounded-lg shadow-sm border border-gray-200 bg-white overflow-hidden">
            <button
              className={`px-6 py-2 font-semibold text-base transition-colors duration-200 focus:outline-none ${selectedSection === 'resell' ? 'bg-primary text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
              onClick={() => setSelectedSection('resell')}
            >
              Resell Projects
            </button>
            <button
              className={`px-6 py-2 font-semibold text-base transition-colors duration-200 focus:outline-none ${selectedSection === 'under-construction' ? 'bg-primary text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
              onClick={() => setSelectedSection('under-construction')}
            >
              Under Construction Projects
            </button>
          </div>
        </div>

        {/* Projects Grid */}
        {!loading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {selectedSection === 'resell' 
              ? projectsData.resellProjects.map((project, index) => (
                  <ProjectCard 
                    key={`resell-${project.srNo}-${index}`} 
                    project={project} 
                    type="resell"
                  />
                ))
              : projectsData.underConstructionProjects.map((project, index) => (
                  <ProjectCard 
                    key={`under-construction-${project.srNo}-${index}`} 
                    project={project}
                    type="under-construction"
                  />
                ))
            }
          </div>
        )}

        {/* Empty State */}
        {!loading && selectedSection === 'resell' && projectsData.resellProjects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No resell projects found.</p>
          </div>
        )}
        {!loading && selectedSection === 'under-construction' && projectsData.underConstructionProjects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No under construction projects found.</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="animate-pulse space-y-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-muted rounded-lg h-64"></div>
              ))}
            </div>
          </div>
        )}

        {/* CTA Section */}
        <div className="text-center mt-16 p-8 bg-primary/5 rounded-2xl">
          <h3 className="text-2xl font-semibold mb-4">Have a Project in Mind?</h3>
          <p className="text-muted-foreground mb-6">
            Let's discuss how we can bring your vision to life with our expertise and innovation.
          </p>
          <Button size="lg" asChild>
            <Link href="/contact">Start Your Project</Link>
          </Button>
        </div>
      </div>

      {/* Modals */}
      <LeadCaptureModal 
        isOpen={showLeadModal} 
        onClose={() => setShowLeadModal(false)} 
      />
      
      {selectedProject && (
        <EnquiryModal
          isOpen={showEnquiryModal}
          onClose={() => setShowEnquiryModal(false)}
          project={selectedProject}
        />
      )}
    </div>
  );
} 