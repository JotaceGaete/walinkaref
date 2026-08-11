import React from 'react';
import { Check, ArrowRight, Zap } from 'lucide-react';

const plans = [
  {
    id: 'plan-starter',
    name: 'Starter',
    price: 'Gratis',
    period: 'para siempre',
    description: 'Para negocios que están empezando a digitalizar sus ventas.',
    features: [
      { id: 'sf-1', text: 'Hasta 20 productos en catálogo' },
      { id: 'sf-2', text: 'Pedidos ilimitados' },
      { id: 'sf-3', text: 'Enlace de catálogo compartible' },
      { id: 'sf-4', text: 'Soporte por email' },
    ],
    cta: 'Comenzar gratis',
    highlight: false,
    badge: null,
  },
  {
    id: 'plan-pro',
    name: 'Pro',
    price: 'US$19',
    period: 'por mes',
    description: 'Para negocios que quieren crecer con herramientas completas.',
    features: [
      { id: 'pf-1', text: 'Productos ilimitados' },
      { id: 'pf-2', text: 'Integración con WhatsApp Business' },
      { id: 'pf-3', text: 'CRM completo de clientes' },
      { id: 'pf-4', text: 'Control de stock en tiempo real' },
      { id: 'pf-5', text: 'Reportes de ventas' },
      { id: 'pf-6', text: 'Soporte prioritario' },
    ],
    cta: 'Empezar prueba gratis',
    highlight: true,
    badge: 'Más popular',
  },
  {
    id: 'plan-business',
    name: 'Business',
    price: 'US$49',
    period: 'por mes',
    description: 'Para equipos y negocios con múltiples puntos de venta.',
    features: [
      { id: 'bf-1', text: 'Todo lo del plan Pro' },
      { id: 'bf-2', text: 'Hasta 5 usuarios del equipo' },
      { id: 'bf-3', text: 'Múltiples catálogos' },
      { id: 'bf-4', text: 'API de integración' },
      { id: 'bf-5', text: 'Gerente de cuenta dedicado' },
    ],
    cta: 'Hablar con ventas',
    highlight: false,
    badge: null,
  },
];

export default function PricingSection() {
  return (
    <section id="pricing" className="py-16 lg:py-24 bg-background">
      <div className="max-w-screen-xl mx-auto px-6 lg:px-10">
        <div className="text-center mb-12">
          <p className="text-xs font-600 uppercase tracking-widest text-primary mb-3">
            Precios
          </p>
          <h2 className="text-3xl lg:text-4xl font-800 text-foreground mb-4">
            Planes para cada etapa
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Empieza gratis. Crece cuando tu negocio lo necesite. Sin permanencia, cancela cuando quieras.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {plans?.map((plan) => (
            <div
              key={plan?.id}
              className={`relative rounded-2xl p-7 flex flex-col gap-5 transition-all duration-200 ${
                plan?.highlight
                  ? 'gradient-hero text-white shadow-hero scale-[1.02]'
                  : 'bg-card border border-border shadow-card hover:shadow-card-hover hover:-translate-y-0.5'
              }`}
            >
              {plan?.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="px-4 py-1 bg-accent text-white text-xs font-700 rounded-full flex items-center gap-1">
                    <Zap size={11} fill="white" />
                    {plan?.badge}
                  </span>
                </div>
              )}

              <div>
                <p className={`text-xs font-700 uppercase tracking-widest mb-2 ${plan?.highlight ? 'text-white/70' : 'text-muted-foreground'}`}>
                  {plan?.name}
                </p>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className={`text-4xl font-800 font-tabular ${plan?.highlight ? 'text-white' : 'text-foreground'}`}>
                    {plan?.price}
                  </span>
                  {plan?.period !== 'para siempre' && (
                    <span className={`text-sm ${plan?.highlight ? 'text-white/70' : 'text-muted-foreground'}`}>
                      /{plan?.period}
                    </span>
                  )}
                </div>
                <p className={`text-sm leading-relaxed ${plan?.highlight ? 'text-white/80' : 'text-muted-foreground'}`}>
                  {plan?.description}
                </p>
              </div>

              <div className="flex flex-col gap-2.5 flex-1">
                {plan?.features?.map((feat) => (
                  <div key={feat?.id} className="flex items-center gap-2.5">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                      plan?.highlight ? 'bg-white/20' : 'bg-accent/10'
                    }`}>
                      <Check size={10} className={plan?.highlight ? 'text-white' : 'text-accent'} />
                    </div>
                    <span className={`text-sm ${plan?.highlight ? 'text-white/90' : 'text-foreground'}`}>
                      {feat?.text}
                    </span>
                  </div>
                ))}
              </div>

              <button
                className={`flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-700 transition-all duration-150 ${
                  plan?.highlight
                    ? 'bg-white text-primary hover:bg-white/90' :'btn-primary'
                }`}
              >
                {plan?.cta}
                <ArrowRight size={15} />
              </button>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-8">
          Todos los planes incluyen prueba gratuita de 14 días · Sin tarjeta de crédito
        </p>
      </div>
    </section>
  );
}