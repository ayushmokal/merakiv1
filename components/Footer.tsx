import Link from 'next/link';
import Image from 'next/image';
import { Building2, Phone, Mail, MapPin, Clock, MessageCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 py-12">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Image src="/logo.png" alt="Meraki Logo" width={120} height={32} className="brightness-0 invert" />
            </div>
            <p className="text-gray-400 text-sm">
              Meraki Square Foots - Where Dreams Become Reality. Established in 2017, we are Navi Mumbai&apos;s trusted consultancy firm providing professional property consultancy services throughout Mumbai, Pune and Navi Mumbai.
            </p>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Our Services</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link href="/services" className="hover:text-white transition-colors">RCC Consultancy</Link></li>
              <li><Link href="/services" className="hover:text-white transition-colors">Property Consultancy</Link></li>
              <li><Link href="/services" className="hover:text-white transition-colors">Interior Designing</Link></li>
              <li><Link href="/services" className="hover:text-white transition-colors">Villa Management</Link></li>
              <li><Link href="/services" className="hover:text-white transition-colors">Property Management & Registration</Link></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/projects" className="hover:text-white transition-colors">Property</Link></li>
              <li><Link href="/work" className="hover:text-white transition-colors">Our Work</Link></li>
              <li><Link href="/services" className="hover:text-white transition-colors">Our Services</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Us</h3>
            <div className="space-y-3 text-gray-400 text-sm">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-gray-300 mt-0.5" />
                <div>
                  <p>Shop no.11, Rahul Apartment CHS,</p>
                  <p>Plot E125, sector 12, Kharghar 410210</p>
                  <p className="text-xs text-gray-500 mt-1">Navi Mumbai, Maharashtra</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-gray-300" />
                <a href="tel:+919930910004" className="hover:text-white transition-colors">
                  9930910004 / 9820274467
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-gray-300" />
                <a href="mailto:merakisquarefootsllp@gmail.com" className="hover:text-white transition-colors">
                  merakisquarefootsllp@gmail.com
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <MessageCircle className="h-5 w-5 text-green-400" />
                <a href="https://wa.me/919930910004" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  WhatsApp: 9930910004 / 9820274467
                </a>
              </div>
              <div className="flex items-start space-x-3">
                <Clock className="h-5 w-5 text-gray-300 mt-0.5" />
                <div>
                  <p>Mon - Sat: 9:00 AM - 6:00 PM</p>
                  <p>Sunday: By Appointment</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <p>&copy; 2025 Meraki Square Foots. All rights reserved.</p>
            <p>Trusted Since 2017 | Professional Excellence</p>
          </div>
        </div>
      </div>
    </footer>
  );
} 