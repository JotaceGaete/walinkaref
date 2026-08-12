'use client';
import React from 'react';
import { ArrowRight, ChevronRight } from 'lucide-react';

interface ReferralHeroProps {
  affiliateCode: string;
  affiliateName?: string;
  signupUrl: string;
}

export default function ReferralHero({ affiliateCode, affiliateName, signupUrl }: ReferralHeroProps) {
  const invitationText = affiliateName
    ? `${affiliateName} te invitó a conocer Walinka`
    : 'Te recomendaron Walinka para hacer crecer tu negocio';

  return (
    <section className="relative py-20 lg:py-28 overflow-hidden">
      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #7C3AED 0%, transparent 70%)' }}
        />
        <div
          className="absolute -bottom-20 -left-20 w-[400px] h-[400px] rounded-full opacity-8"
          style={{ background: 'radial-gradient(circle, #EC4899 0%, transparent 70%)' }}
        />
      </div>

      <div className="max-w-screen-xl mx-auto px-6 lg:px-10 relative">
        <div className="max-w-3xl mx-auto text-center">

          {/* Invitation badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-violet-200 bg-violet-50 text-sm mb-8">
            <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse-soft" />
            <span className="text-xs font-600 text-violet-700">
              Invitación de un afiliado Walinka
            </span>
            <span className="text-xs text-violet-400 font-tabular">
              ref.walinka.com/{affiliateCode}
            </span>
          </div>

          {/* Main headline */}
          <h1 className="text-4xl lg:text-5xl xl:text-6xl font-800 text-foreground leading-[1.1] tracking-tight mb-5">
            {invitationText.split('Walinka')[0]}
            <span
              style={{
                background: 'linear-gradient(135deg, #7C3AED 0%, #EC4899 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Walinka
            </span>
            {invitationText.split('Walinka')[1]}
          </h1>

          <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed mb-10 max-w-2xl mx-auto">
            Crea tu catálogo, recibe pedidos por WhatsApp y administra tus clientes desde un solo lugar.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              id="crear-negocio"
              href={signupUrl}
              className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-700 text-white transition-all hover:-translate-y-0.5"
              style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #EC4899 100%)', boxShadow: '0 4px 24px rgba(124,58,237,0.35)' }}
            >
              Crear mi negocio gratis
              <ArrowRight size={18} />
            </a>
            <a
              href="#que-es-walinka"
              className="btn-outline flex items-center justify-center gap-2 px-8 py-4 text-base"
            >
              Conocer Walinka
              <ChevronRight size={16} />
            </a>
          </div>

          <p className="text-xs text-muted-foreground mt-5">
            Prueba gratuita · Sin tarjeta de crédito · Configuración en 10 minutos
          </p>
        </div>

        {/* Product mockup */}
        <div className="mt-16 max-w-2xl mx-auto">
          <div className="rounded-2xl border border-border shadow-hero overflow-hidden bg-card">
            {/* Browser bar */}
            <div className="flex items-center gap-2 px-4 py-3 bg-muted border-b border-border">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-danger/40" />
                <div className="w-3 h-3 rounded-full bg-warning/40" />
                <div className="w-3 h-3 rounded-full bg-positive/40" />
              </div>
              <div className="flex-1 mx-3 px-3 py-1 bg-card rounded-md text-xs text-muted-foreground font-tabular border border-border">
                walinka.com/mi-tienda
              </div>
            </div>
            {/* Mock catalog */}
            <div className="p-5 bg-background">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-700 text-foreground">Mi Tienda</p>
                  <p className="text-xs text-muted-foreground">12 productos disponibles</p>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-600 text-white" style={{ background: 'linear-gradient(135deg, #7C3AED, #EC4899)' }}>
                  Pedir por WhatsApp
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { name: 'Producto A', price: '$25', color: 'bg-violet-100' },
                  { name: 'Producto B', price: '$18', color: 'bg-pink-100' },
                  { name: 'Producto C', price: '$32', color: 'bg-indigo-100' },
                ].map((item, i) => (
                  <div key={`mock-product-${i}`} className="rounded-xl border border-border bg-card overflow-hidden">
                    <div className={`h-16 ${item.color} flex items-center justify-center`}>
                      <div className="w-8 h-8 rounded-lg bg-white/60" />
                    </div>
                    <div className="p-2">
                      <p className="text-xs font-600 text-foreground truncate">{item.name}</p>
                      <p className="text-xs font-700 text-violet-600">{item.price}</p>
                    </div>
                  </div>
                ))}
              </div>
              {/* Incoming order notification */}
              <div className="mt-4 flex items-center gap-3 p-3 rounded-xl bg-positive/5 border border-positive/20">
                <div className="w-8 h-8 rounded-full bg-positive/15 flex items-center justify-center shrink-0">
                  <span className="text-sm">📦</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-700 text-foreground">Nuevo pedido recibido</p>
                  <p className="text-xs text-muted-foreground truncate">Cliente #A3F2 · 3 productos · $75</p>
                </div>
                <span className="text-xs text-positive font-600 shrink-0">Ahora</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
