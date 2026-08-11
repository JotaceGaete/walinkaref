import React from 'react';
import { BookOpen, MessageCircle, Users, Package, ShoppingBag, Zap } from 'lucide-react';
import Icon from '@/components/ui/AppIcon';


const features = [
  {
    id: 'rf-catalog',
    icon: BookOpen,
    title: 'Catálogo digital',
    description:
      'Crea tu catálogo con fotos, descripciones y precios. Tus clientes lo ven desde cualquier dispositivo, sin descargar nada.',
    color: 'bg-primary/10 text-primary',
    highlight: false,
  },
  {
    id: 'rf-orders',
    icon: ShoppingBag,
    title: 'Pedidos organizados',
    description:
      'Cada pedido llega con los datos del cliente, los productos seleccionados y las cantidades. Sin confusiones, sin perder información.',
    color: 'bg-accent/10 text-accent',
    highlight: true,
  },
  {
    id: 'rf-whatsapp',
    icon: MessageCircle,
    title: 'WhatsApp integrado',
    description:
      'Recibe notificaciones de pedidos en tu WhatsApp habitual. Responde a tus clientes desde donde ya estás.',
    color: 'bg-positive/10 text-positive',
    highlight: false,
  },
  {
    id: 'rf-crm',
    icon: Users,
    title: 'CRM de clientes',
    description:
      'Registro automático de cada cliente que te compra. Historial de pedidos, frecuencia y preferencias en un solo lugar.',
    color: 'bg-pending/10 text-pending',
    highlight: false,
  },
  {
    id: 'rf-stock',
    icon: Package,
    title: 'Control de stock',
    description:
      'Sabe en tiempo real cuánto tienes de cada producto. Recibe alertas cuando algo está a punto de agotarse.',
    color: 'bg-warning/10 text-warning',
    highlight: false,
  },
  {
    id: 'rf-setup',
    icon: Zap,
    title: 'Listo en 10 minutos',
    description:
      'Sin necesidad de saber de tecnología. Si puedes usar WhatsApp, puedes usar Walinka. Soporte en español incluido.',
    color: 'bg-primary/10 text-primary',
    highlight: false,
  },
];

export default function FeatureCards() {
  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="max-w-screen-xl mx-auto px-6 lg:px-10">
        <div className="text-center mb-12">
          <p className="text-xs font-600 uppercase tracking-widest text-primary mb-3">
            Funcionalidades
          </p>
          <h2 className="text-3xl lg:text-4xl font-800 text-foreground mb-4">
            Todo lo que tu negocio necesita
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Una plataforma completa, diseñada para negocios reales que venden en Latinoamérica.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features?.map((feat) => {
            const Icon = feat?.icon;
            return (
              <div
                key={feat?.id}
                className={`rounded-2xl p-6 border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover ${
                  feat?.highlight
                    ? 'bg-primary text-primary-foreground border-primary shadow-hero'
                    : 'bg-card border-border shadow-card'
                }`}
              >
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${
                  feat?.highlight ? 'bg-white/15' : feat?.color
                }`}>
                  <Icon size={20} className={feat?.highlight ? 'text-white' : ''} />
                </div>
                <h3 className={`text-base font-700 mb-2 ${feat?.highlight ? 'text-white' : 'text-foreground'}`}>
                  {feat?.title}
                </h3>
                <p className={`text-sm leading-relaxed ${feat?.highlight ? 'text-white/80' : 'text-muted-foreground'}`}>
                  {feat?.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}