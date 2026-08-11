import React from 'react';
import { BookOpen, ShoppingBag, MessageCircle, Users, Package, CreditCard, HelpCircle, Globe } from 'lucide-react';
import Icon from '@/components/ui/AppIcon';


const features = [
  {
    id: 'feat-catalog',
    icon: BookOpen,
    title: '¿Qué es Walinka?',
    description:
      'Walinka es una plataforma para que pequeños negocios vendan en línea con catálogo digital, pedidos por WhatsApp y gestión de clientes.',
    videoLabel: 'Mira Walinka en 2 minutos',
    color: 'bg-secondary text-primary',
  },
  {
    id: 'feat-catalog-create',
    icon: ShoppingBag,
    title: 'Catálogo digital',
    description:
      'Cualquier negocio puede crear su catálogo de productos con fotos, precios y categorías. Sin necesidad de saber de tecnología.',
    videoLabel: 'Cómo crear un catálogo',
    color: 'bg-accent/10 text-accent',
  },
  {
    id: 'feat-orders',
    icon: ShoppingBag,
    title: 'Recepción de pedidos',
    description:
      'Los clientes del negocio hacen pedidos directamente desde el catálogo. El dueño recibe la notificación al instante.',
    videoLabel: 'Cómo recibe un pedido un negocio',
    color: 'bg-warning/10 text-warning',
  },
  {
    id: 'feat-whatsapp',
    icon: MessageCircle,
    title: 'WhatsApp + Walinka',
    description:
      'Walinka se integra con WhatsApp para que los negocios reciban y gestionen pedidos desde su número habitual.',
    videoLabel: null,
    color: 'bg-positive/10 text-positive',
  },
  {
    id: 'feat-crm',
    icon: Users,
    title: 'CRM y clientes',
    description:
      'Registro automático de clientes, historial de compras y seguimiento de cada relación comercial desde un solo lugar.',
    videoLabel: null,
    color: 'bg-pending/10 text-pending',
  },
  {
    id: 'feat-stock',
    icon: Package,
    title: 'Stock y ventas',
    description:
      'Control de inventario en tiempo real. El negocio sabe qué productos tiene disponibles y cuáles están agotados.',
    videoLabel: null,
    color: 'bg-primary/10 text-primary',
  },
  {
    id: 'feat-plans',
    icon: CreditCard,
    title: 'Planes y precios',
    description:
      'Walinka ofrece planes accesibles para negocios de cualquier tamaño. Prueba gratuita disponible sin tarjeta de crédito.',
    videoLabel: null,
    color: 'bg-accent/10 text-accent',
  },
  {
    id: 'feat-help',
    icon: HelpCircle,
    title: 'Centro de ayuda',
    description:
      'Soporte en español, tutoriales en video y documentación completa. Tus referidos nunca estarán solos.',
    videoLabel: null,
    color: 'bg-muted text-muted-foreground',
  },
];

export default function ProductFeaturesSection() {
  return (
    <section className="py-20 lg:py-28 bg-card border-y border-border">
      <div className="max-w-screen-xl mx-auto px-6 lg:px-10">
        <div className="text-center mb-14">
          <p className="text-xs font-600 uppercase tracking-widest text-primary mb-3">
            Conoce el producto
          </p>
          <h2 className="text-3xl lg:text-4xl font-800 text-foreground mb-4">
            Conoce lo que vas a recomendar
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Entender Walinka te hace un mejor afiliado. Aquí tienes todo lo que necesitas saber antes de empezar a compartir.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features?.map((feature) => {
            const Icon = feature?.icon;
            return (
              <div
                key={feature?.id}
                className="bg-background rounded-2xl p-5 border border-border hover:shadow-card-hover transition-all duration-200 hover:-translate-y-0.5 group"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${feature?.color}`}>
                  <Icon size={18} />
                </div>
                <h3 className="text-base font-700 text-foreground mb-2">{feature?.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  {feature?.description}
                </p>
                {feature?.videoLabel && (
                  <div className="mt-auto">
                    <div className="bg-muted rounded-xl aspect-video flex items-center justify-center border border-border group-hover:border-primary/20 transition-colors cursor-pointer">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <Globe size={14} className="text-primary" />
                        </div>
                        <p className="text-[10px] text-muted-foreground text-center px-2">
                          {feature?.videoLabel}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}