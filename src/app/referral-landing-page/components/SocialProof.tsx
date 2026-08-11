import React from 'react';

const metrics = [
  { id: 'sp-1', value: '2,400+', label: 'negocios activos', color: 'text-violet-600' },
  { id: 'sp-2', value: '8', label: 'países en Latinoamérica', color: 'text-pink-600' },
  { id: 'sp-3', value: '98%', label: 'de satisfacción', color: 'text-emerald-600' },
  { id: 'sp-4', value: '10 min', label: 'para empezar', color: 'text-indigo-600' },
];

const categories = [
  { id: 'cat-1', emoji: '👗', label: 'Ropa y moda' },
  { id: 'cat-2', emoji: '🍕', label: 'Alimentos' },
  { id: 'cat-3', emoji: '💄', label: 'Cosméticos' },
  { id: 'cat-4', emoji: '🌿', label: 'Plantas y jardín' },
  { id: 'cat-5', emoji: '📱', label: 'Accesorios tech' },
  { id: 'cat-6', emoji: '🎁', label: 'Regalos' },
  { id: 'cat-7', emoji: '🧴', label: 'Cuidado personal' },
  { id: 'cat-8', emoji: '🏠', label: 'Hogar y deco' },
];

export default function SocialProof() {
  return (
    <section className="py-16 lg:py-20 bg-background">
      <div className="max-w-screen-xl mx-auto px-6 lg:px-10">
        <div className="text-center mb-12">
          <p className="text-xs font-600 uppercase tracking-widest mb-3" style={{ color: '#7C3AED' }}>
            Por qué otros negocios usan Walinka
          </p>
          <h2 className="text-3xl lg:text-4xl font-800 text-foreground mb-4">
            Negocios reales en toda Latinoamérica
          </h2>
          <p className="text-muted-foreground text-base max-w-xl mx-auto">
            Desde tiendas de ropa hasta distribuidoras de alimentos. Walinka funciona para cualquier negocio que venda productos.
          </p>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12 max-w-3xl mx-auto">
          {metrics?.map((m) => (
            <div key={m?.id} className="text-center p-5 rounded-2xl bg-card border border-border shadow-card">
              <p className={`text-3xl font-800 font-tabular mb-1 ${m?.color}`}>{m?.value}</p>
              <p className="text-xs text-muted-foreground leading-tight">{m?.label}</p>
            </div>
          ))}
        </div>

        {/* Business categories */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-5">Negocios que ya usan Walinka:</p>
          <div className="flex flex-wrap justify-center gap-2.5">
            {categories?.map((cat) => (
              <div
                key={cat?.id}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border shadow-sm text-sm font-500 text-foreground"
              >
                <span>{cat?.emoji}</span>
                <span>{cat?.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Countries placeholder */}
        <div className="mt-10 p-6 rounded-2xl bg-card border border-border shadow-card max-w-2xl mx-auto text-center">
          <p className="text-sm font-600 text-foreground mb-2">Disponible en</p>
          <div className="flex flex-wrap justify-center gap-3">
            {['🇲🇽 México', '🇨🇴 Colombia', '🇵🇪 Perú', '🇦🇷 Argentina', '🇨🇱 Chile', '🇪🇨 Ecuador', '🇻🇪 Venezuela', '🇧🇴 Bolivia']?.map((country) => (
              <span key={`country-${country}`} className="text-sm text-muted-foreground">{country}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
