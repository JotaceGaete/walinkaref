import React from 'react';
import ReferralNav from './components/ReferralNav';
import ReferralHero from './components/ReferralHero';
import WhatIsWalinka from './components/WhatIsWalinka';
import BenefitsSection from './components/BenefitsSection';
import ProductDemo from './components/ProductDemo';
import SocialProof from './components/SocialProof';
import ReferralTestimonials from './components/ReferralTestimonials';
import ReferralFAQ from './components/ReferralFAQ';
import ReferralCTA from './components/ReferralCTA';
import ReferralFooter from './components/ReferralFooter';

// This page is shown to prospects who click an affiliate link
// e.g. ref.walinka.com/juan-f92ee
// affiliateCode and affiliateName will be injected from URL params in production
const affiliateCode = 'juan-f92ee';
const affiliateName = 'Juan';

export default function ReferralLandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <ReferralNav affiliateCode={affiliateCode} affiliateName={affiliateName} />
      <ReferralHero affiliateCode={affiliateCode} affiliateName={affiliateName} />
      <WhatIsWalinka />
      <BenefitsSection />
      <ProductDemo affiliateCode={affiliateCode} />
      <SocialProof />
      <ReferralTestimonials />
      <ReferralFAQ />
      <ReferralCTA affiliateCode={affiliateCode} affiliateName={affiliateName} />
      <ReferralFooter affiliateCode={affiliateCode} />
    </div>
  );
}