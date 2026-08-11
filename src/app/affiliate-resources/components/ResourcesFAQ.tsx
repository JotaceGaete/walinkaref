'use client';
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

const faqs = [
  {
    id: 'faq-1',
    q: '¿Cuándo se acredita mi recompensa?',
    a: 'Tu recompensa de US$5 se acredita automáticamente cuando el cliente referido completa 2 meses de suscripción paga. Esto puede tomar entre 60 y 70 días desde que el cliente se registra, dependiendo de su fecha de inicio.',
  },
  {
    id: 'faq-2',
    q: '¿Hay un límite de referidos que puedo hacer?',
    a: 'No. Puedes referir a tantos clientes como quieras. No hay tope máximo de recompensa.',
  },
  {
    id: 'faq-3',
    q: '¿Cómo retiro mis ganancias?',
    a: 'El monto que ves como "Disponible" en tu panel ya está confirmado y es tuyo. La solicitud de retiro todavía está en construcción — en cuanto esté lista para que la uses, te avisaremos.',
  },
  {
    id: 'faq-4',
    q: '¿Qué pasa si un cliente cancela antes de completar 2 meses?',
    a: 'Si el cliente cancela antes de completar 2 meses pagos, la recompensa no se acredita. El referido quedará en estado "No calificado" en tu panel.',
  },
  {
    id: 'faq-5',
    q: '¿Puedo usar mi propio enlace para registrarme en Walinka?',
    a: 'No. El programa está diseñado para que refieras a terceros. El uso de tu propio enlace para auto-referirse no genera recompensa y puede resultar en la suspensión de tu cuenta.',
  },
  {
    id: 'faq-6',
    q: '¿En qué países está disponible Walinka?',
    a: 'Actualmente Walinka opera en México, Colombia, Perú, Argentina, Chile y Ecuador. Solo los clientes registrados en estos países califican para tu recompensa.',
  },
  {
    id: 'faq-7',
    q: '¿Puedo ver quién se registró con mi enlace?',
    a: 'Sí, pero por privacidad los referidos se muestran con IDs anonimizados (ej. Usuario #91AE). Puedes ver su progreso de meses pagos, estado y fecha de registro, pero no sus datos personales.',
  },
  {
    id: 'faq-8',
    q: '¿Cómo puedo compartir materiales de Walinka?',
    a: 'En la sección de Recursos encontrarás plantillas de texto para WhatsApp, Instagram y email, banners descargables y videos explicativos. Todo está listo para usar.',
  },
];

export default function ResourcesFAQ() {
  const [openId, setOpenId] = useState<string | null>('faq-1');

  return (
    <div className="bg-card shadow-card rounded-2xl border border-border overflow-hidden mb-6">
      <div className="p-6 border-b border-border flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-secondary flex items-center justify-center">
          <HelpCircle size={16} className="text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-700 text-foreground">Preguntas frecuentes</h2>
          <p className="text-sm text-muted-foreground">Respuestas a las dudas más comunes del programa</p>
        </div>
      </div>
      <div className="divide-y divide-border">
        {faqs?.map((faq) => {
          const isOpen = openId === faq?.id;
          return (
            <div key={faq?.id}>
              <button
                className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-muted/40 transition-colors"
                onClick={() => setOpenId(isOpen ? null : faq?.id)}
              >
                <span className="text-sm font-600 text-foreground pr-4">{faq?.q}</span>
                {isOpen ? (
                  <ChevronUp size={16} className="text-primary shrink-0" />
                ) : (
                  <ChevronDown size={16} className="text-muted-foreground shrink-0" />
                )}
              </button>
              {isOpen && (
                <div className="px-6 pb-4 animate-fade-in">
                  <p className="text-sm text-muted-foreground leading-relaxed">{faq?.a}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}