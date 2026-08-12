import React from 'react';
import { notFound } from 'next/navigation';
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
import { resolveReferralCode } from '@/services/referralService';

const BUSINESS_SIGNUP_URL = 'https://go.ventalink.app/business-registration';

interface ReferralLandingPageProps {
  params: Promise<{ code: string }>;
}

export default async function ReferralLandingPage({ params }: ReferralLandingPageProps) {
  const { code } = await params;

  // wa_resolve_referral_code es la única fuente de verdad: nunca se arma una
  // invitación a partir del propio segmento de URL sin validarlo server-side.
  // Un código inválido y un error de resolución se tratan igual (404): no
  // hay forma segura de mostrar una invitación cuando no pudimos confirmarla.
  let resolution;
  try {
    resolution = await resolveReferralCode(code);
  } catch (err) {
    console.error('[ReferralLandingPage] resolveReferralCode failed:', err);
    notFound();
  }

  if (!resolution.valid) {
    notFound();
  }

  const signupUrl = `${BUSINESS_SIGNUP_URL}?ref=${encodeURIComponent(code)}`;

  return (
    <div className="min-h-screen bg-background">
      <ReferralNav affiliateCode={code} affiliateName={resolution.referrerName} signupUrl={signupUrl} />
      <ReferralHero affiliateCode={code} affiliateName={resolution.referrerName} signupUrl={signupUrl} />
      <WhatIsWalinka />
      <BenefitsSection />
      <ProductDemo affiliateCode={code} />
      <SocialProof />
      <ReferralTestimonials />
      <ReferralFAQ />
      <ReferralCTA affiliateCode={code} affiliateName={resolution.referrerName} signupUrl={signupUrl} />
      <ReferralFooter affiliateCode={code} />
    </div>
  );
}
