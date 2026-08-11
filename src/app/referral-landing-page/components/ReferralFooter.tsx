import React from 'react';
import AppLogo from '@/components/ui/AppLogo';

interface ReferralFooterProps {
  affiliateCode: string;
}

export default function ReferralFooter({ affiliateCode }: ReferralFooterProps) {
  return (
    <footer className="bg-card border-t border-border py-10">
      <div className="max-w-screen-xl mx-auto px-6 lg:px-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <AppLogo size={24} />
            <span className="font-bold text-sm text-foreground">Walinka</span>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 rounded-xl border border-violet-100 bg-violet-50">
            <span className="text-xs text-muted-foreground">
              Llegaste aquí a través de una invitación de afiliado
            </span>
            <span className="text-xs font-700 font-tabular" style={{ color: '#7C3AED' }}>
              /{affiliateCode}
            </span>
          </div>

          <div className="flex items-center gap-4">
            {['Términos', 'Privacidad', 'Ayuda'].map((item) => (
              <a
                key={`rf-footer-${item}`}
                href="#"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
        <div className="mt-6 pt-6 border-t border-border text-center">
          <p className="text-xs text-muted-foreground">
            © 2026 Walinka. Todos los derechos reservados. · walinka.com
          </p>
        </div>
      </div>
    </footer>
  );
}