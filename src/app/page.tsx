import React from 'react';
import PublicNav from '@/components/PublicNav';
import HeroSection from './components/HeroSection';
import HowItWorksSection from './components/HowItWorksSection';
import EarningsCalculator from './components/EarningsCalculator';
import ProductFeaturesSection from './components/ProductFeaturesSection';
import TrustSection from './components/TrustSection';
import PublicFooter from './components/PublicFooter';

export default function PublicAffiliateLandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <PublicNav />
      <HeroSection />
      <HowItWorksSection />
      <EarningsCalculator />
      <ProductFeaturesSection />
      <TrustSection />
      <PublicFooter />
    </div>
  );
}