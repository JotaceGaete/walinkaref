'use client';

/**
 * Error boundary mínimo para /[code]: captura errores de resolución de
 * wa_resolve_referral_code que NO son "código inválido" (red, configuración,
 * runtime). No expone detalles del error al visitante -- el detalle real ya
 * quedó en los logs de servidor vía logReferralResolutionError en page.tsx.
 */
export default function ReferralLandingError() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="text-center max-w-md">
        <h2 className="text-2xl font-medium text-onBackground mb-2">No pudimos verificar este enlace</h2>
        <p className="text-onBackground/70">
          Ocurrió un problema al verificar este enlace de invitación. Intenta nuevamente en unos minutos.
        </p>
      </div>
    </div>
  );
}
