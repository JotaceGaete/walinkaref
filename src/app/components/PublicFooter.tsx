import React from 'react';
import Link from 'next/link';
import AppLogo from '@/components/ui/AppLogo';

export default function PublicFooter() {
  return (
    <footer className="bg-card border-t border-border py-12">
      <div className="max-w-screen-xl mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <AppLogo size={28} />
              <span className="font-bold text-base text-foreground">WalinkaRef</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              El programa de afiliados oficial de Walinka. Recomienda, rastrea y cobra — todo desde un solo lugar.
            </p>
          </div>
          <div>
            <p className="text-xs font-600 uppercase tracking-widest text-muted-foreground mb-4">
              Programa
            </p>
            <div className="flex flex-col gap-2">
              {['Cómo funciona', 'Calculadora', 'Recursos', 'FAQ']?.map((item) => (
                <a
                  key={`footer-prog-${item}`}
                  href="#"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-600 uppercase tracking-widest text-muted-foreground mb-4">
              Cuenta
            </p>
            <div className="flex flex-col gap-2">
              {[
                { label: 'Registrarse', href: '/sign-up-login-screen' },
                { label: 'Iniciar sesión', href: '/sign-up-login-screen' },
                { label: 'Dashboard', href: '/affiliate-dashboard' },
              ]?.map((item) => (
                <Link
                  key={`footer-acc-${item?.label}`}
                  href={item?.href}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {item?.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            © 2026 Walinka. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Términos
            </a>
            <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Privacidad
            </a>
            <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Contacto
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}