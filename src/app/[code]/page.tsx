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
import { supabaseUrl } from '@/lib/supabase';

const BUSINESS_SIGNUP_URL = 'https://go.ventalink.app/business-registration';

interface ReferralLandingPageProps {
  params: Promise<{ code: string }>;
}

/**
 * DIAGNÓSTICO TEMPORAL: separa "código inválido" (404 real) de "no pudimos
 * verificarlo" (error de RPC/conexión/configuración). Loguea únicamente
 * datos no sensibles -- nunca la anon key -- para poder identificar la causa
 * de un 404 en producción sin exponer nada en el cliente.
 */
function logReferralResolutionError(code: string, err: unknown) {
  const supabaseHost = (() => {
    try {
      return new URL(supabaseUrl).host;
    } catch {
      return supabaseUrl ? 'invalid-url' : 'empty';
    }
  })();
  const isDummySupabaseUrl = supabaseUrl.includes('dummy.supabase.co');
  const errorMessage = err instanceof Error ? err.message : String(err);
  const errorCode = (err as { code?: unknown })?.code;

  console.error('[ReferralLandingPage] wa_resolve_referral_code falló (no es un código inválido)', {
    code,
    supabaseHost,
    isDummySupabaseUrl,
    errorMessage,
    errorCode,
  });
}

export default async function ReferralLandingPage({ params }: ReferralLandingPageProps) {
  const { code } = await params;

  // wa_resolve_referral_code es la única fuente de verdad: nunca se arma una
  // invitación a partir del propio segmento de URL sin validarlo server-side.
  //
  // "Código inválido" (valid:false) y "no pudimos verificar el código"
  // (la RPC lanza -- red/config/runtime) ya NO se tratan igual: solo el
  // primero es un 404 real. El segundo no es culpa del visitante ni del
  // código, así que se deja propagar como error de servidor (visible en
  // logs y en el error boundary de este segmento) en vez de disfrazarse de
  // "este enlace no existe".
  let resolution;
  try {
    resolution = await resolveReferralCode(code);
  } catch (err) {
    logReferralResolutionError(code, err);
    throw err;
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
