import React from 'react';
import { Check } from 'lucide-react';

const benefits = [
  {
    id: 'ben-1',
    emoji: '🛍️',
    title: 'Tu catálogo siempre disponible',
    description: 'Crea tu tienda digital en minutos. Tus clientes ven tus productos, fotos y precios desde cualquier dispositivo, sin descargar ninguna app.',
    highlight: false,
  },
  {
    id: 'ben-2',
    emoji: '📲',
    title: 'Pedidos que llegan solos a WhatsApp',
    description: 'Cuando un cliente elige algo, el pedido llega organizado a tu WhatsApp con todos los datos: qué quiere, cuánto y cómo contactarlo.',
    highlight: true,
  },
  {
    id: 'ben-3',
    emoji: '👥',
    title: 'Conoce a tus clientes de verdad',
    description: 'Walinka registra automáticamente cada cliente que te compra. Historial de pedidos, frecuencia y preferencias en un solo lugar.',
    highlight: false,
  },
  {
    id: 'ben-4',
    emoji: '📦',
    title: 'Nunca más vendas lo que no tienes',
    description: 'Control de stock en tiempo real. Recibe alertas cuando un producto está por agotarse y evita compromisos que no puedes cumplir.',
    highlight: false,
  },
];

export default function BenefitsSection() {
  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="max-w-screen-xl mx-auto px-6 lg:px-10">
        <div className="text-center mb-12">
          <p className="text-xs font-600 uppercase tracking-widest mb-3" style={{ color: '#7C3AED' }}>
            Para tu negocio
          </p>
          <h2 className="text-3xl lg:text-4xl font-800 text-foreground mb-4">
            4 razones para empezar hoy
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Diseñado para negocios reales que venden en Latinoamérica.
          </p>
        </div>

        {/* Asymmetric bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {/* Large card */}
          <div
            className="lg:col-span-2 rounded-2xl p-8 text-white relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #EC4899 100%)', boxShadow: '0 8px 32px rgba(124,58,237,0.3)' }}
          >
            <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-10 pointer-events-none" style={{ background: 'radial-gradient(circle, white, transparent 70%)', transform: 'translate(30%, -30%)' }} />
            <span className="text-3xl mb-4 block">{benefits?.[1]?.emoji}</span>
            <h3 className="text-xl font-800 text-white mb-3">{benefits?.[1]?.title}</h3>
            <p className="text-white/80 text-sm leading-relaxed">{benefits?.[1]?.description}</p>
            <div className="mt-6 flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                <Check size={11} className="text-white" />
              </div>
              <span className="text-white/70 text-xs">Sin configuración técnica</span>
            </div>
          </div>

          {/* Small card */}
          <div className="rounded-2xl p-6 bg-card border border-border shadow-card hover:shadow-card-hover transition-all hover:-translate-y-0.5">
            <span className="text-3xl mb-4 block">{benefits?.[0]?.emoji}</span>
            <h3 className="text-base font-700 text-foreground mb-2">{benefits?.[0]?.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{benefits?.[0]?.description}</p>
          </div>

          {/* Small card */}
          <div className="rounded-2xl p-6 bg-card border border-border shadow-card hover:shadow-card-hover transition-all hover:-translate-y-0.5">
            <span className="text-3xl mb-4 block">{benefits?.[2]?.emoji}</span>
            <h3 className="text-base font-700 text-foreground mb-2">{benefits?.[2]?.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{benefits?.[2]?.description}</p>
          </div>

          {/* Wide card */}
          <div className="md:col-span-2 lg:col-span-2 rounded-2xl p-6 bg-violet-50 border border-violet-100 hover:shadow-card-hover transition-all hover:-translate-y-0.5">
            <span className="text-3xl mb-4 block">{benefits?.[3]?.emoji}</span>
            <h3 className="text-base font-700 text-foreground mb-2">{benefits?.[3]?.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-lg">{benefits?.[3]?.description}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
