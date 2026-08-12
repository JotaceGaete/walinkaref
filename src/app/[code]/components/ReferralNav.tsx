'use client';
import React from 'react';
import AppLogo from '@/components/ui/AppLogo';
import { Users } from 'lucide-react';

interface ReferralNavProps {
  affiliateCode: string;
  affiliateName?: string;
}

export default function ReferralNav({ affiliateCode, affiliateName }: ReferralNavProps) {
  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border">
      <div className="max-w-screen-xl mx-auto px-6 lg:px-10 flex items-center justify-between h-16">
        <div className="flex items-center gap-2.5">
          <AppLogo size={28} />
          <span className="font-bold text-base text-foreground">Walinka</span>
        </div>

        {/* Affiliate badge */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border border-violet-200 bg-violet-50">
          <Users size={12} className="text-violet-600" />
          <span className="text-xs font-600 text-violet-700">
            Invitación de un afiliado Walinka
          </span>
          <span className="text-xs font-700 text-violet-500 font-tabular">
            /{affiliateCode}
          </span>
        </div>

        <a
          href="#crear-negocio"
          className="btn-accent px-5 py-2.5 text-sm"
        >
          Crear mi negocio gratis
        </a>
      </div>
    </header>
  );
}