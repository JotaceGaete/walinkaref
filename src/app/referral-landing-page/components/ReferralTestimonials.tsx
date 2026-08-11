import React from 'react';
import { Star } from 'lucide-react';

const testimonials = [
  {
    id: 'rt-1',
    name: 'Valeria Moreno',
    business: 'Tienda de ropa · Guadalajara',
    text: 'Antes mis pedidos de WhatsApp eran un caos. Ahora todo llega organizado y mis clientes pueden ver el catálogo actualizado en cualquier momento.',
    stars: 5,
    initials: 'VM',
    color: 'bg-rose-400',
  },
  {
    id: 'rt-2',
    name: 'Andrés Castillo',
    business: 'Distribuidora de alimentos · Bogotá',
    text: 'Lo que más me gustó fue que no necesité saber de tecnología. En un día tenía mi catálogo listo y mis clientes ya lo estaban usando.',
    stars: 5,
    initials: 'AC',
    color: 'bg-violet-400',
  },
  {
    id: 'rt-3',
    name: 'Luciana Paredes',
    business: 'Cosméticos artesanales · Lima',
    text: 'El control de stock me salvó varias veces. Ya no vendo lo que no tengo. Mis clientes confían más en mí porque siempre sé qué hay disponible.',
    stars: 5,
    initials: 'LP',
    color: 'bg-pink-400',
  },
];

export default function ReferralTestimonials() {
  return (
    <section className="py-16 lg:py-24 bg-card border-y border-border">
      <div className="max-w-screen-xl mx-auto px-6 lg:px-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-800 text-foreground mb-4">
            Lo que dicen los negocios que ya lo usan
          </h2>
          <p className="text-muted-foreground text-base max-w-xl mx-auto">
            Testimonios de clientes activos de Walinka. Los resultados individuales varían.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {testimonials?.map((t) => (
            <div
              key={t?.id}
              className="bg-background rounded-2xl border border-border p-6 shadow-card hover:shadow-card-hover transition-all hover:-translate-y-0.5"
            >
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: t?.stars }, (_, i) => (
                  <Star key={`rt-star-${t?.id}-${i}`} size={14} className="text-warning fill-warning" />
                ))}
              </div>
              <p className="text-sm text-foreground leading-relaxed mb-5 italic">
                &ldquo;{t?.text}&rdquo;
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-border">
                <div className={`w-9 h-9 rounded-full ${t?.color} flex items-center justify-center text-white text-xs font-800`}>
                  {t?.initials}
                </div>
                <div>
                  <p className="text-sm font-700 text-foreground">{t?.name}</p>
                  <p className="text-xs text-muted-foreground">{t?.business}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}