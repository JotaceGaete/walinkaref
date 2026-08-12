import React from 'react';
import { Play } from 'lucide-react';

interface ProductDemoProps {
  affiliateCode: string;
}

export default function ProductDemo({ affiliateCode }: ProductDemoProps) {
  return (
    <section id="demo" className="py-16 lg:py-24 bg-card border-y border-border">
      <div className="max-w-screen-xl mx-auto px-6 lg:px-10">
        <div className="text-center mb-12">
          <p className="text-xs font-600 uppercase tracking-widest mb-3" style={{ color: '#7C3AED' }}>
            Míralo en acción
          </p>
          <h2 className="text-3xl lg:text-4xl font-800 text-foreground mb-4">
            Así funciona Walinka para tu negocio
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            En menos de 2 minutos entenderás por qué más de 2,400 negocios ya lo usan.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {/* Video placeholder */}
          <div
            className="relative rounded-2xl overflow-hidden aspect-video flex items-center justify-center cursor-pointer group"
            style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #4c1d95 50%, #831843 100%)' }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-white/15 flex items-center justify-center group-hover:bg-white/25 transition-all group-hover:scale-110 duration-200">
                <Play size={32} className="text-white ml-1" fill="white" />
              </div>
            </div>
            <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
              <div>
                <p className="text-white font-700 text-base">Walinka en 2 minutos</p>
                <p className="text-white/60 text-sm">Demo completa del producto</p>
              </div>
              <div className="px-3 py-1.5 rounded-full bg-white/10 border border-white/20">
                <span className="text-white/80 text-xs font-600">2:14</span>
              </div>
            </div>
            {/* Placeholder label */}
            <div className="absolute top-4 right-4 px-2 py-1 rounded-md bg-black/30 border border-white/10">
              <span className="text-white/50 text-xs">Video próximamente</span>
            </div>
          </div>

          {/* Steps below video */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { step: '01', title: 'Crea tu catálogo', desc: 'Agrega productos con fotos y precios en minutos' },
              { step: '02', title: 'Comparte tu enlace', desc: 'Tus clientes ven tu tienda desde cualquier dispositivo' },
              { step: '03', title: 'Recibe pedidos', desc: 'Llegan organizados directo a tu WhatsApp' },
            ].map((item) => (
              <div key={`step-${item.step}`} className="flex items-start gap-3 p-4 rounded-xl bg-background border border-border">
                <span className="text-xs font-800 font-tabular shrink-0 mt-0.5" style={{ color: '#7C3AED' }}>{item.step}</span>
                <div>
                  <p className="text-sm font-700 text-foreground mb-0.5">{item.title}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Affiliate code note */}
          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <span>Tu registro conservará el código de invitación</span>
            <span className="font-700 font-tabular" style={{ color: '#7C3AED' }}>/{affiliateCode}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
