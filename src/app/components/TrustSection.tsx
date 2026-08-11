import React from 'react';
import { MapPin, Star, Users, ShoppingBag, Globe } from 'lucide-react';
import Icon from '@/components/ui/AppIcon';


const metrics = [
  { id: 'metric-negocios', value: '2,400+', label: 'negocios activos', icon: ShoppingBag },
  { id: 'metric-paises', value: '6', label: 'países de Latinoamérica', icon: Globe },
  { id: 'metric-pedidos', value: '180K+', label: 'pedidos procesados', icon: Users },
  { id: 'metric-afiliados', value: '320+', label: 'afiliados activos', icon: Star },
];

const countries = [
  { id: 'country-mx', code: 'MX', name: 'México' },
  { id: 'country-co', code: 'CO', name: 'Colombia' },
  { id: 'country-pe', code: 'PE', name: 'Perú' },
  { id: 'country-ar', code: 'AR', name: 'Argentina' },
  { id: 'country-cl', code: 'CL', name: 'Chile' },
  { id: 'country-ec', code: 'EC', name: 'Ecuador' },
];

const testimonials = [
  {
    id: 'test-1',
    name: 'Camila Rodríguez',
    role: 'Consultora de negocios · Bogotá',
    text: 'Empecé a recomendar Walinka a mis clientes de mentoría. En el primer mes tuve 4 calificados. El proceso es transparente y el panel es muy fácil de entender.',
    qualified: 4,
  },
  {
    id: 'test-2',
    name: 'Marco Villanueva',
    role: 'Agencia digital · Lima',
    text: 'Mis clientes de redes sociales son exactamente el perfil de Walinka. Compartir el enlace fue natural y los resultados llegaron solos.',
    qualified: 9,
  },
  {
    id: 'test-3',
    name: 'Sofía Méndez',
    role: 'Freelance community manager · CDMX',
    text: 'Lo que más valoro es que los datos son reales. Ves exactamente en qué mes va cada referido. No hay caja negra.',
    qualified: 6,
  },
];

export default function TrustSection() {
  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="max-w-screen-xl mx-auto px-6 lg:px-10">
        {/* Platform metrics */}
        <div className="text-center mb-14">
          <p className="text-xs font-600 uppercase tracking-widest text-primary mb-3">
            Plataforma
          </p>
          <h2 className="text-3xl lg:text-4xl font-800 text-foreground mb-4">
            Una plataforma real, con negocios reales
          </h2>
          <p className="text-muted-foreground text-base max-w-xl mx-auto">
            Walinka opera en producción. Estos son indicadores públicos de referencia — no proyecciones.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {metrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <div
                key={metric.id}
                className="bg-card shadow-card rounded-2xl p-6 border border-border text-center"
              >
                <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center mx-auto mb-3">
                  <Icon size={18} className="text-primary" />
                </div>
                <p className="text-2xl lg:text-3xl font-800 text-foreground font-tabular mb-1">
                  {metric.value}
                </p>
                <p className="text-sm text-muted-foreground">{metric.label}</p>
              </div>
            );
          })}
        </div>

        {/* Countries */}
        <div className="bg-card shadow-card rounded-2xl border border-border p-8 mb-16">
          <div className="flex items-center gap-2 mb-6">
            <MapPin size={18} className="text-primary" />
            <h3 className="text-lg font-700 text-foreground">Disponible en</h3>
          </div>
          <div className="flex flex-wrap gap-3">
            {countries.map((country) => (
              <div
                key={country.id}
                className="flex items-center gap-2 px-4 py-2.5 bg-background rounded-xl border border-border"
              >
                <span className="text-lg">{getFlagEmoji(country.code)}</span>
                <span className="text-sm font-600 text-foreground">{country.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div>
          <div className="text-center mb-10">
            <h3 className="text-2xl font-800 text-foreground mb-2">
              Lo que dicen nuestros afiliados
            </h3>
            <p className="text-muted-foreground text-sm">
              Testimonios de afiliados reales. Resultados individuales varían.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {testimonials.map((t) => (
              <div
                key={t.id}
                className="bg-card shadow-card rounded-2xl border border-border p-6"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={`star-${t.id}-${star}`}
                      size={14}
                      className="text-warning fill-warning"
                    />
                  ))}
                </div>
                <p className="text-sm text-foreground leading-relaxed mb-5 italic">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div>
                    <p className="text-sm font-700 text-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-800 text-accent font-tabular">{t.qualified}</p>
                    <p className="text-[10px] text-muted-foreground">calificados</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function getFlagEmoji(countryCode: string): string {
  const flags: Record<string, string> = {
    MX: '🇲🇽',
    CO: '🇨🇴',
    PE: '🇵🇪',
    AR: '🇦🇷',
    CL: '🇨🇱',
    EC: '🇪🇨',
  };
  return flags[countryCode] ?? '🌐';
}