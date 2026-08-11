import React from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    id: 'faq-1',
    q: '¿Necesito saber de tecnología para usar Walinka?',
    a: 'No. Si puedes usar WhatsApp, puedes usar Walinka. La configuración inicial toma menos de 10 minutos y el soporte en español está incluido en todos los planes.',
  },
  {
    id: 'faq-2',
    q: '¿Cómo recibo los pedidos de mis clientes?',
    a: 'Cada pedido llega directamente a tu WhatsApp con todos los datos del cliente, los productos seleccionados y las cantidades. Sin confusiones, sin perder información.',
  },
  {
    id: 'faq-3',
    q: '¿Mis clientes necesitan descargar alguna app?',
    a: 'No. Tu catálogo es una página web que tus clientes abren desde cualquier dispositivo, sin descargar nada. Solo comparte tu enlace.',
  },
  {
    id: 'faq-4',
    q: '¿Puedo probar Walinka antes de pagar?',
    a: 'Sí. Todos los planes incluyen una prueba gratuita. Puedes empezar sin tarjeta de crédito y decidir si Walinka es para tu negocio antes de comprometerte.',
  },
  {
    id: 'faq-5',
    q: '¿Qué pasa si quiero cancelar?',
    a: 'Puedes cancelar cuando quieras, sin permanencia ni penalizaciones. Tu catálogo y datos siempre son tuyos.',
  },
];

export default function ReferralFAQ() {
  return (
    <section className="py-16 lg:py-20 bg-background">
      <div className="max-w-screen-xl mx-auto px-6 lg:px-10">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-600 uppercase tracking-widest mb-3" style={{ color: '#7C3AED' }}>
              Preguntas frecuentes
            </p>
            <h2 className="text-3xl font-800 text-foreground">
              Resolvemos tus dudas
            </h2>
          </div>

          <div className="flex flex-col gap-3">
            {faqs?.map((faq) => (
              <details
                key={faq?.id}
                className="group rounded-2xl border border-border bg-card overflow-hidden"
              >
                <summary className="flex items-center justify-between gap-4 p-5 cursor-pointer list-none select-none hover:bg-muted/50 transition-colors">
                  <span className="text-sm font-700 text-foreground">{faq?.q}</span>
                  <ChevronDown
                    size={16}
                    className="text-muted-foreground shrink-0 transition-transform duration-200 group-open:rotate-180"
                  />
                </summary>
                <div className="px-5 pb-5">
                  <p className="text-sm text-muted-foreground leading-relaxed">{faq?.a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
