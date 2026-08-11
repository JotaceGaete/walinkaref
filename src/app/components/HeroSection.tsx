import React from 'react';
import Link from 'next/link';
import { ArrowRight, Play, TrendingUp } from 'lucide-react';
import DashboardMockup from './DashboardMockup';

export default function HeroSection() {
  return (
    <section className="relative pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-10"
          style={{
            background: 'radial-gradient(circle, #0F4C81 0%, transparent 70%)',
            transform: 'translate(30%, -30%)',
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-8"
          style={{
            background: 'radial-gradient(circle, #00C896 0%, transparent 70%)',
            transform: 'translate(-30%, 30%)',
          }}
        />
      </div>

      <div className="max-w-screen-xl mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: copy */}
          <div className="animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary rounded-full text-sm font-600 text-primary mb-6 border border-primary/10">
              <TrendingUp size={14} />
              Programa de afiliados — ref.walinka.com
            </div>

            <h1 className="text-4xl lg:text-5xl xl:text-[3.25rem] font-800 text-foreground leading-[1.1] tracking-tight mb-6">
              Haz crecer negocios.{' '}
              <span className="text-gradient-primary">
                Gana recomendando
              </span>{' '}
              Walinka.
            </h1>

            <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-lg">
              Recomienda una plataforma creada para pequeños negocios y recibe
              una recompensa por cada cliente que califique.
            </p>

            {/* Value prop */}
            <div className="flex items-center gap-4 mb-8">
              <div className="bg-card shadow-card rounded-2xl px-6 py-4 border border-border">
                <p className="text-3xl font-800 text-gradient-accent font-tabular">
                  US$5
                </p>
                <p className="text-xs text-muted-foreground mt-1 font-500">
                  por cliente calificado
                </p>
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  El cliente debe completar{' '}
                  <span className="font-600 text-foreground">2 meses pagos</span>{' '}
                  para que califique tu recompensa.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/sign-up-login-screen"
                className="btn-primary px-6 py-3.5 text-base flex items-center justify-center gap-2"
              >
                Quiero ser afiliado
                <ArrowRight size={18} />
              </Link>
              <a
                href="#como-funciona"
                className="btn-outline px-6 py-3.5 text-base flex items-center justify-center gap-2"
              >
                <Play size={16} className="text-primary" />
                Ver cómo funciona
              </a>
            </div>

            <p className="text-xs text-muted-foreground mt-4">
              Sin costo de registro · Sin mínimo de referidos · Retiro cuando quieras
            </p>
          </div>

          {/* Right: dashboard mockup */}
          <div className="flex justify-center lg:justify-end animate-fade-in">
            <DashboardMockup />
          </div>
        </div>
      </div>
    </section>
  );
}