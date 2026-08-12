import React from 'react';
import { ArrowRight, Shield, Clock, MessageCircle } from 'lucide-react';

interface ReferralCTAProps {
  affiliateCode: string;
  affiliateName?: string;
  signupUrl: string;
}

export default function ReferralCTA({ affiliateCode, affiliateName, signupUrl }: ReferralCTAProps) {
  const invitationNote = affiliateName
    ? `${affiliateName} te recomendó Walinka. Tu registro conservará su código de invitación.`
    : 'Llegaste aquí por recomendación. Tu registro conservará el código de invitación.';

  return (
    <section className="py-20 lg:py-28 bg-card border-t border-border">
      <div className="max-w-screen-xl mx-auto px-6 lg:px-10">
        <div
          className="rounded-3xl p-10 lg:p-16 text-center relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #4C1D95 0%, #7C3AED 40%, #BE185D 100%)', boxShadow: '0 20px 60px rgba(124,58,237,0.35)' }}
        >
          {/* Decorative */}
          <div
            className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10 pointer-events-none"
            style={{ background: 'radial-gradient(circle, #EC4899, transparent 70%)', transform: 'translate(30%, -30%)' }}
          />
          <div
            className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-10 pointer-events-none"
            style={{ background: 'radial-gradient(circle, white, transparent 70%)', transform: 'translate(-30%, 30%)' }}
          />

          {/* Affiliate code badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-white/60" />
            <span className="text-white/80 text-xs">{invitationNote}</span>
          </div>

          <h2 className="text-3xl lg:text-5xl font-800 text-white leading-tight mb-6 max-w-2xl mx-auto">
            Empieza a vender mejor desde hoy.
          </h2>
          <p className="text-white/80 text-lg max-w-xl mx-auto mb-10">
            Crea tu catálogo, recibe pedidos por WhatsApp y administra tus clientes — todo gratis para empezar.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
            <a
              href={signupUrl}
              className="flex items-center justify-center gap-2 px-8 py-4 bg-white rounded-xl text-base font-700 hover:bg-white/95 transition-all hover:shadow-lg hover:-translate-y-0.5"
              style={{ color: '#7C3AED' }}
            >
              Crear mi negocio gratis
              <ArrowRight size={18} />
            </a>
            <a
              href="#que-es-walinka"
              className="flex items-center justify-center gap-2 px-8 py-4 bg-white/10 text-white border border-white/20 rounded-xl text-base font-600 hover:bg-white/20 transition-all"
            >
              Conocer Walinka
            </a>
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            {[
              { id: 'cta-t1', icon: Shield, text: 'Sin compromiso de permanencia' },
              { id: 'cta-t2', icon: Clock, text: 'Configuración en 10 minutos' },
              { id: 'cta-t3', icon: MessageCircle, text: 'Soporte en español incluido' },
            ]?.map((item) => {
              const Icon = item?.icon;
              return (
                <div key={item?.id} className="flex items-center gap-2">
                  <Icon size={14} className="text-white/60" />
                  <span className="text-white/70 text-sm">{item?.text}</span>
                </div>
              );
            })}
          </div>

          {/* Affiliate code trace */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <p className="text-white/40 text-xs font-tabular">
              ref.walinka.com/{affiliateCode} → registro → tu negocio
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
