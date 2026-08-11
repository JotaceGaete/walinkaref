import React from 'react';
import { X, Check } from 'lucide-react';

const problems = [
  { id: 'prob-1', text: 'Anotas pedidos en papel o en un chat de WhatsApp desordenado' },
  { id: 'prob-2', text: 'Tus clientes no saben qué tienes disponible ni a qué precio' },
  { id: 'prob-3', text: 'Pierdes ventas porque no respondes a tiempo' },
  { id: 'prob-4', text: 'No sabes cuánto vendiste ni qué productos se agotan primero' },
];

const solutions = [
  { id: 'sol-1', text: 'Catálogo digital con tus productos, fotos y precios actualizados' },
  { id: 'sol-2', text: 'Pedidos que llegan organizados con los datos del cliente' },
  { id: 'sol-3', text: 'Notificaciones automáticas por WhatsApp al instante' },
  { id: 'sol-4', text: 'Reportes de ventas y stock en tiempo real' },
];

export default function ProblemSection() {
  return (
    <section className="py-16 lg:py-24 bg-card border-y border-border">
      <div className="max-w-screen-xl mx-auto px-6 lg:px-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-800 text-foreground mb-4">
            ¿Te suena familiar?
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            La mayoría de los negocios pequeños tienen el mismo problema. Walinka lo resuelve.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Problems */}
          <div className="bg-danger/5 border border-danger/15 rounded-2xl p-6">
            <p className="text-sm font-700 text-danger uppercase tracking-wider mb-4">
              Sin Walinka
            </p>
            <div className="flex flex-col gap-3">
              {problems?.map((p) => (
                <div key={p?.id} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-danger/10 flex items-center justify-center mt-0.5 shrink-0">
                    <X size={11} className="text-danger" />
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">{p?.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Solutions */}
          <div className="bg-positive/5 border border-positive/15 rounded-2xl p-6">
            <p className="text-sm font-700 text-positive uppercase tracking-wider mb-4">
              Con Walinka
            </p>
            <div className="flex flex-col gap-3">
              {solutions?.map((s) => (
                <div key={s?.id} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-positive/10 flex items-center justify-center mt-0.5 shrink-0">
                    <Check size={11} className="text-positive" />
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">{s?.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}