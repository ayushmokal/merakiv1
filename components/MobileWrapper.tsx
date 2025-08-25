'use client';

import { useState } from 'react';
import MobileNavigationBar from '@/components/mobile/MobileNavigationBar';
import LeadCaptureModal from '@/components/LeadCaptureModal';

export default function MobileWrapper() {
  const [showContactModal, setShowContactModal] = useState(false);

  return (
    <>
      {/* Mobile Navigation Bar */}
      <MobileNavigationBar 
        onContactUs={() => setShowContactModal(true)}
      />
      
      {/* Modals */}
      <LeadCaptureModal 
        isOpen={showContactModal} 
        onClose={() => setShowContactModal(false)} 
      />
    </>
  );
}