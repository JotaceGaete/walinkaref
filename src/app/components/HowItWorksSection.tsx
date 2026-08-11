import React from 'react';
import { UserPlus, Link2, Share2, BarChart2, DollarSign } from 'lucide-react';
import Icon from '@/components/ui/AppIcon';


const steps = [
  {
    id: 'step-1',
    number: '01',
    icon: UserPlus,
    title: 'Crea tu cuenta',
    description:
      'Regístrate gratis en ref.walinka.com. Solo necesitas tu email y en menos de 2 minutos tienes acceso a tu panel.',
  },
  {
    id: 'step-2',
    number: '02',
    icon: Link2,
    title: 'Obtén tu enlace personal',
    description:
      'Tu enlace único se genera automáticamente. Úsalo en WhatsApp, Instagram, email o donde conectes con negocios.',
  },
  {
    id: 'step-3',
    number: '03',
    icon: Share2,
    title: 'Comparte Walinka',
    description:
      'Recomienda Walinka a dueños de pequeños negocios. Tenemos materiales listos para que sea fácil explicarlo.',
  },
  {
    id: 'step-4',
    number: '04',
    icon: BarChart2,
    title: 'Sigue tus referidos',
    description:
      'Desde tu dashboard ves quién se registró y en qué etapa van. Cada referido muestra su progreso de 0/2 a 2/2 meses pagos.',
  },
  {
    id: 'step-5',
    number: '05',
    icon: DollarSign,
    title: 'Recibe tu recompensa',
    description:
      'Cuando un referido completa 2 meses pagos, US$5 se acreditan a tu saldo disponible para retirar.',
  },
];

export default function HowItWorksSection() {
  return (
    <section id="como-funciona" className="py-20 lg:py-28 bg-card border-y border-border">
      <div className="max-w-screen-xl mx-auto px-6 lg:px-10">
        <div className="text-center mb-14">
          <p className="text-xs font-600 uppercase tracking-widest text-primary mb-3">
            Proceso
          </p>
          <h2 className="text-3xl lg:text-4xl font-800 text-foreground mb-4">
            Cómo funciona
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Un proceso simple y transparente. Sin tecnicismos, sin sorpresas.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-4">
          {steps?.map((step, index) => {
            const Icon = step?.icon;
            return (
              <div key={step?.id} className="relative flex flex-col items-center text-center group">
                {/* Connector line */}
                {index < steps?.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-[calc(50%+32px)] right-0 h-px bg-gradient-to-r from-border to-transparent" />
                )}
                <div className="relative mb-4">
                  <div className="w-16 h-16 rounded-2xl gradient-hero flex items-center justify-center shadow-card group-hover:shadow-card-hover transition-all duration-200 group-hover:-translate-y-1">
                    <Icon size={24} className="text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-accent flex items-center justify-center">
                    <span className="text-[9px] font-800 text-white">{step?.number}</span>
                  </div>
                </div>
                <h3 className="text-base font-700 text-foreground mb-2">{step?.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step?.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}