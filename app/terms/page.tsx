import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Building2, ArrowLeft } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>

        <Card>
          <CardContent className="p-8">
            <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
            <p className="text-muted-foreground mb-8">
              Last updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>

            <div className="prose prose-slate max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
                <p>
                  By accessing and using Meraki Square Foots' website and services, you accept and agree 
                  to be bound by the terms and provision of this agreement. If you do not agree 
                  to abide by the above, please do not use this service.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">2. Services Description</h2>
                <p className="mb-4">
                  Meraki Square Foots provides architecture and property services including but not limited to:
                </p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li>RCC Consultancy and structural engineering</li>
                  <li>Property consultancy and advisory services</li>
                  <li>Interior design and space planning</li>
                  <li>Villa and property management</li>
                  <li>Property registration and legal services</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">3. Client Responsibilities</h2>
                <p className="mb-4">As a client, you agree to:</p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li>Provide accurate and complete information about your project requirements</li>
                  <li>Make timely payments as per agreed terms</li>
                  <li>Provide necessary access to project sites and documentation</li>
                  <li>Comply with all applicable laws and regulations</li>
                  <li>Communicate changes or concerns promptly</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">4. Payment Terms</h2>
                <p className="mb-4">
                  Payment terms will be specified in individual service agreements. Generally:
                </p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li>Consultation fees are due upon completion of consultation</li>
                  <li>Project fees may be structured in milestones</li>
                  <li>Late payment may incur additional charges</li>
                  <li>Refunds are subject to the terms of individual agreements</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">5. Intellectual Property</h2>
                <p>
                  All designs, plans, and documentation created by Meraki Square Foots remain our intellectual 
                  property until full payment is received. Upon full payment, clients receive 
                  usage rights as specified in the service agreement.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">6. Limitation of Liability</h2>
                <p className="mb-4">
                  Meraki Square Foots' liability is limited to the amount paid for services. We are not 
                  liable for:
                </p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li>Indirect, incidental, or consequential damages</li>
                  <li>Delays caused by factors beyond our control</li>
                  <li>Changes in regulations or approval processes</li>
                  <li>Third-party contractor performance</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">7. Project Changes</h2>
                <p>
                  Changes to project scope, timeline, or specifications may result in additional 
                  charges. All changes must be agreed upon in writing before implementation.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">8. Confidentiality</h2>
                <p>
                  We maintain strict confidentiality regarding all client information and project 
                  details. We may use project images and general descriptions for marketing 
                  purposes unless specifically restricted by the client.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">9. Termination</h2>
                <p>
                  Either party may terminate services with written notice. Termination terms, 
                  including payment for completed work, will be as specified in individual 
                  service agreements.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">10. Dispute Resolution</h2>
                <p>
                  Any disputes arising from our services will be resolved through mediation 
                  and, if necessary, arbitration in Mumbai, Maharashtra, under Indian law.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">11. Force Majeure</h2>
                <p>
                  Meraki Square Foots is not liable for delays or failures due to circumstances beyond 
                  our reasonable control, including natural disasters, government actions, 
                  or other force majeure events.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">12. Modifications</h2>
                <p>
                  We reserve the right to modify these terms at any time. Changes will be 
                  effective immediately upon posting on our website. Continued use of our 
                  services constitutes acceptance of modified terms.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">13. Contact Information</h2>
                <p className="mb-4">
                  For questions about these terms or our services, please contact us:
                </p>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <p><strong>Email:</strong> legal@merakisquarefoots.com</p>
                  <p><strong>Phone:</strong> +91 98765 43210</p>
                  <p><strong>Address:</strong> Mumbai, Maharashtra, India</p>
                </div>
              </section>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}