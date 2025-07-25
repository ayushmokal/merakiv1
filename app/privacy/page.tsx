import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Building2, ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
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
            <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
            <p className="text-muted-foreground mb-8">
              Last updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>

            <div className="prose prose-slate max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
                <p className="mb-4">
                  We collect information you provide directly to us, such as when you:
                </p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li>Fill out contact forms or request quotes</li>
                  <li>Subscribe to our newsletter or updates</li>
                  <li>Communicate with us via email, phone, or chat</li>
                  <li>Participate in surveys or feedback forms</li>
                </ul>
                <p>
                  This information may include your name, email address, phone number, 
                  project details, and any other information you choose to provide.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
                <p className="mb-4">We use the information we collect to:</p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li>Provide and improve our services</li>
                  <li>Respond to your inquiries and requests</li>
                  <li>Send you updates about our services and projects</li>
                  <li>Analyze usage patterns to improve our website</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">3. Information Sharing</h2>
                <p className="mb-4">
                  We do not sell, trade, or otherwise transfer your personal information 
                  to third parties without your consent, except in the following circumstances:
                </p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li>With service providers who assist us in operating our website and conducting business</li>
                  <li>When required by law or to protect our rights</li>
                  <li>In connection with a business transfer or merger</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">4. Data Security</h2>
                <p>
                  We implement appropriate security measures to protect your personal information 
                  against unauthorized access, alteration, disclosure, or destruction. However, 
                  no method of transmission over the internet is 100% secure.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">5. Cookies and Tracking</h2>
                <p className="mb-4">
                  We use cookies and similar tracking technologies to enhance your experience 
                  on our website. You can control cookie settings through your browser preferences.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">6. Your Rights</h2>
                <p className="mb-4">You have the right to:</p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li>Access and update your personal information</li>
                  <li>Request deletion of your personal information</li>
                  <li>Opt-out of marketing communications</li>
                  <li>Request a copy of your personal information</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">7. Third-Party Links</h2>
                <p>
                  Our website may contain links to third-party websites. We are not responsible 
                  for the privacy practices of these external sites. We encourage you to review 
                  their privacy policies.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">8. Changes to This Policy</h2>
                <p>
                  We may update this privacy policy from time to time. We will notify you of 
                  any changes by posting the new policy on this page and updating the 
                  "Last updated" date.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">9. Contact Us</h2>
                <p className="mb-4">
                  If you have any questions about this privacy policy or our data practices, 
                  please contact us:
                </p>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <p><strong>Email:</strong> merakisquarefootsllp@gmail.com</p>
                  <p><strong>Phone:</strong> 9930910004 / 9820274467</p>
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