import React from 'react';
import { CheckCircle, AlertCircle, Lightbulb } from 'lucide-react';

const doList = [
  { id: 'do-1', text: 'Presenta Walinka como una solución a un problema concreto: "¿Cómo reciben pedidos ahora?"' },
  { id: 'do-2', text: 'Muestra el catálogo demo en vivo. Ver el producto funcionar vale más que explicarlo.' },
  { id: 'do-3', text: 'Menciona que tiene prueba gratuita. Baja la resistencia inicial.' },
  { id: 'do-4', text: 'Enfócate en negocios que ya venden por WhatsApp pero de forma manual.' },
  { id: 'do-5', text: 'Haz seguimiento a los 3 días. La mayoría no decide en el primer contacto.' },
];

const dontList = [
  { id: 'dont-1', text: 'No prometas funcionalidades que no existen o que no conoces bien.' },
  { id: 'dont-2', text: 'No presiones. Si el negocio no está listo, respeta el momento.' },
  { id: 'dont-3', text: 'No digas "es gratis para siempre" — tiene prueba gratuita, luego planes pagos.' },
  { id: 'dont-4', text: 'No envíes el enlace sin contexto. Siempre acompáñalo con una explicación breve.' },
];

const tips = [
  { id: 'tip-1', text: 'El mejor perfil de cliente: negocios con 20–200 productos, que venden por WhatsApp o Instagram.' },
  { id: 'tip-2', text: 'Los rubros que más convierten: ropa, alimentos, cosméticos, accesorios, productos artesanales.' },
  { id: 'tip-3', text: 'Si el negocio ya tiene un catálogo en PDF o fotos en WhatsApp, Walinka es la evolución natural.' },
];

export default function QuickSalesGuide() {
  return (
    <div className="bg-card shadow-card rounded-2xl border border-border overflow-hidden mb-6">
      <div className="p-6 border-b border-border">
        <h2 className="text-lg font-700 text-foreground">Guía rápida de venta</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Consejos prácticos para que tus conversaciones sean más efectivas
        </p>
      </div>
      <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Do */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg bg-positive/10 flex items-center justify-center">
              <CheckCircle size={14} className="text-positive" />
            </div>
            <h3 className="text-sm font-700 text-foreground">Sí hacer</h3>
          </div>
          <div className="flex flex-col gap-2.5">
            {doList?.map((item) => (
              <div key={item?.id} className="flex items-start gap-2.5">
                <div className="w-4 h-4 rounded-full bg-positive/10 flex items-center justify-center mt-0.5 shrink-0">
                  <CheckCircle size={10} className="text-positive" />
                </div>
                <p className="text-sm text-foreground leading-relaxed">{item?.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Don't */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg bg-danger/10 flex items-center justify-center">
              <AlertCircle size={14} className="text-danger" />
            </div>
            <h3 className="text-sm font-700 text-foreground">Evitar</h3>
          </div>
          <div className="flex flex-col gap-2.5">
            {dontList?.map((item) => (
              <div key={item?.id} className="flex items-start gap-2.5">
                <div className="w-4 h-4 rounded-full bg-danger/10 flex items-center justify-center mt-0.5 shrink-0">
                  <AlertCircle size={10} className="text-danger" />
                </div>
                <p className="text-sm text-foreground leading-relaxed">{item?.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tips */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg bg-warning/10 flex items-center justify-center">
              <Lightbulb size={14} className="text-warning" />
            </div>
            <h3 className="text-sm font-700 text-foreground">Tips de segmentación</h3>
          </div>
          <div className="flex flex-col gap-2.5">
            {tips?.map((item) => (
              <div key={item?.id} className="bg-warning/5 border border-warning/15 rounded-xl p-3">
                <p className="text-sm text-foreground leading-relaxed">{item?.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}