'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import InteractiveConsole from '@/components/InteractiveConsole';
import FeaturesGrid from '@/components/FeaturesGrid';
import EcosystemLogos from '@/components/EcosystemLogos';
import ComplianceSection from '@/components/ComplianceSection';
import ToolDirectory from '@/components/ToolDirectory';
import Footer from '@/components/Footer';
import StructuredData from '@/components/StructuredData';

export default function Home() {
  const [currentView, setCurrentView] = useState<'home' | 'directory'>('home');

  const handleWaitlistClick = () => {
    setCurrentView('home');
    setTimeout(() => {
      const waitlistForm = document.getElementById('waitlist-form');
      if (waitlistForm) {
        waitlistForm.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  useEffect(() => {
    if (currentView === 'home') {
      window.scrollTo(0, 0);
    }
  }, [currentView]);

  return (
    <>
      <StructuredData />
      <div className="min-h-screen flex flex-col relative overflow-x-hidden">
        <div className="fixed inset-0 z-0 bg-grid pointer-events-none"></div>
        
        <Navbar onViewChange={setCurrentView} onWaitlistClick={handleWaitlistClick} />

      {currentView === 'home' ? (
        <div className="transition-opacity duration-300">
          <HeroSection />
          <InteractiveConsole />
          <FeaturesGrid />
          <ComplianceSection />
        </div>
      ) : (
        <div className="transition-opacity duration-300">
          <ToolDirectory />
        </div>
      )}

      <EcosystemLogos />
      <Footer />
      
        {/* Watermark */}
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-10 pointer-events-none">
          <p className="text-xs md:text-sm text-red-400/30 font-medium tracking-wide">
            Create by Vibe, Share the Joy
          </p>
        </div>
      </div>
    </>
  );
}
