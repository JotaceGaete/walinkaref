'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  AlertTriangle,
  CheckCircle2,
  CircleDollarSign,
  Globe2,
  Landmark,
  Loader2,
  LogOut,
  Mail,
  ShieldCheck,
  UserRound,
} from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { getMyReferralStats, type ReferralStats } from '@/services/referralService';

function formatMoney(amount: number, currency: string) {
  return new Intl.NumberFormat('es', {
    style: 'currency',
    currency,
    currencyDisplay: 'code',
  }).format(amount);
}

export default function AffiliateSettingsPage() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const loadStats = useCallback(() => {
    setStatsLoading(true);
    setStatsError(false);
    getMyReferralStats()
      .then((data) => setStats(data))
      .catch((error) => {
        console.warn('[AffiliateSettings] getMyReferralStats failed:', error?.message);
        setStats(null);
        setStatsError(true);
      })
      .finally(() => setStatsLoading(false));
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const handleSignOut = async () => {
    if (signingOut) return;
    setSigningOut(true);
    await signOut();
    router.replace('/sign-up-login-screen');
  };

  const name = user?.user_metadata?.full_name || user?.user_metadata?.name || null;
  const email = user?.email || 'No disponible';
  const pendingPayouts = stats?.pendingPayoutsByCurrency ?? [];

  return (
    <DashboardLayout referralsCount={stats?.invitedCount}>
      <div className="mx-auto max-w-6xl p-4 sm:p-6 lg:p-8">
        <header className="mb-8 border-b border-border pb-7">
          <p className="text-xs font-700 uppercase tracking-[0.18em] text-primary">Tu cuenta</p>
          <h1 className="mt-2 text-2xl font-800 tracking-tight text-foreground sm:text-3xl">
            Configuración
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Revisa los datos de tu cuenta y cómo funcionarán tus pagos como afiliado.
          </p>
        </header>

        <div className="grid gap-5 lg:grid-cols-2">
          <section
            aria-labelledby="profile-heading"
            className="rounded-3xl border border-border bg-card p-5 shadow-card sm:p-6"
          >
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
                <UserRound size={18} />
              </div>
              <div className="min-w-0 flex-1">
                <h2 id="profile-heading" className="text-lg font-700 text-foreground">
                  Perfil
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Tu identidad dentro del programa
                </p>
                <dl className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-background p-4">
                    <dt className="text-xs font-600 uppercase tracking-wider text-muted-foreground">
                      Nombre
                    </dt>
                    <dd className="mt-1.5 text-sm font-600 text-foreground">
                      {name || 'No configurado'}
                    </dd>
                  </div>
                  <div className="rounded-2xl bg-background p-4">
                    <dt className="text-xs font-600 uppercase tracking-wider text-muted-foreground">
                      Email
                    </dt>
                    <dd className="mt-1.5 break-all text-sm font-600 text-foreground">{email}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </section>

          <section
            aria-labelledby="country-heading"
            className="rounded-3xl border border-border bg-card p-5 shadow-card sm:p-6"
          >
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                <Globe2 size={18} />
              </div>
              <div>
                <h2 id="country-heading" className="text-lg font-700 text-foreground">
                  País de pago
                </h2>
                <div className="mt-4 inline-flex items-center rounded-full border border-border bg-muted px-3 py-1 text-xs font-700 text-muted-foreground">
                  No configurado
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  El país de pago se configurará cuando actives tu método de retiro.
                </p>
              </div>
            </div>
          </section>

          <section
            aria-labelledby="payments-heading"
            className="rounded-3xl border border-border bg-card p-5 shadow-card sm:p-6 lg:col-span-2"
          >
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-positive/10 text-positive">
                <CircleDollarSign size={18} />
              </div>
              <div className="min-w-0 flex-1">
                <h2 id="payments-heading" className="text-lg font-700 text-foreground">
                  Pagos y retiros
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Información actual de tu programa de afiliados
                </p>

                {statsLoading ? (
                  <div
                    role="status"
                    className="mt-5 flex items-center gap-2 text-sm text-muted-foreground"
                  >
                    <Loader2 size={16} className="animate-spin" />
                    Cargando información de pagos…
                  </div>
                ) : statsError ? (
                  <div
                    role="alert"
                    className="mt-5 flex flex-col gap-3 rounded-xl border border-danger/20 bg-danger/5 p-4 sm:flex-row sm:items-center"
                  >
                    <AlertTriangle size={17} className="shrink-0 text-danger" />
                    <p className="flex-1 text-sm text-muted-foreground">
                      No pudimos cargar tu información de pagos.
                    </p>
                    <button
                      type="button"
                      onClick={loadStats}
                      className="self-start text-sm font-600 text-primary hover:underline"
                    >
                      Reintentar
                    </button>
                  </div>
                ) : stats ? (
                  <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.8fr)]">
                    <dl className="grid gap-3 rounded-2xl bg-background p-4 sm:grid-cols-2">
                      <div className="rounded-xl bg-card p-4">
                        <dt className="text-xs font-600 uppercase tracking-wider text-muted-foreground">
                          Moneda de recompensa
                        </dt>
                        <dd className="mt-1 text-lg font-800 text-foreground">
                          {stats.rewardCurrency}
                        </dd>
                      </div>
                      <div className="rounded-xl bg-card p-4">
                        <dt className="text-xs font-600 uppercase tracking-wider text-muted-foreground">
                          Saldo disponible
                        </dt>
                        <dd className="mt-1 text-lg font-800 text-foreground font-tabular">
                          {formatMoney(stats.availableAmount, stats.rewardCurrency)}
                        </dd>
                      </div>
                    </dl>

                    <div className="rounded-2xl border border-border p-4">
                      <h3 className="text-sm font-700 text-foreground">Retiros pendientes</h3>
                      {pendingPayouts.length > 0 ? (
                        <ul
                          className="mt-3 flex flex-wrap gap-2"
                          aria-label="Retiros pendientes por moneda"
                        >
                          {pendingPayouts.map((payout) => (
                            <li
                              key={payout.currency}
                              className="rounded-xl border border-border px-4 py-2 text-sm font-700 text-foreground font-tabular"
                            >
                              {formatMoney(payout.amount, payout.currency)}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="mt-2 text-sm text-muted-foreground">
                          No tienes retiros pendientes.
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="mt-5 text-sm text-muted-foreground">
                    No hay información financiera disponible.
                  </p>
                )}

                <div className="mt-6 rounded-2xl border border-primary/15 bg-secondary/50 p-4 sm:p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-700 text-foreground">Método de retiro</h3>
                      <p className="mt-1 text-sm text-muted-foreground">No configurado</p>
                    </div>
                    <span className="rounded-full bg-secondary px-3 py-1 text-xs font-700 text-primary">
                      Próximamente
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    La configuración segura de tu método de retiro se habilitará en la siguiente
                    fase.
                  </p>
                </div>

                <div className="mt-7 border-t border-border pt-6">
                  <h3 className="text-sm font-700 text-foreground">Cómo recibirás tus pagos</h3>
                  <div className="mt-3 grid gap-3 md:grid-cols-2">
                    <article className="rounded-2xl border border-border bg-background p-4 sm:p-5">
                      <div className="flex items-center gap-2">
                        <Landmark size={16} className="text-primary" />
                        <h4 className="text-sm font-700 text-foreground">Chile</h4>
                      </div>
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                        Los retiros se procesarán mediante transferencia bancaria.
                      </p>
                      <p className="mt-3 text-xs font-600 text-foreground">
                        En Fase C se solicitará:
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                        titular, RUT, banco, tipo de cuenta y número de cuenta.
                      </p>
                    </article>
                    <article className="rounded-2xl border border-border bg-background p-4 sm:p-5">
                      <div className="flex items-center gap-2">
                        <Landmark size={16} className="text-primary" />
                        <h4 className="text-sm font-700 text-foreground">Argentina</h4>
                      </div>
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                        Los retiros se procesarán mediante transferencia a una cuenta compatible.
                      </p>
                      <p className="mt-3 text-xs font-600 text-foreground">
                        En Fase C está previsto solicitar:
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                        titular, CUIT/CUIL, banco o billetera, CBU/CVU y alias cuando corresponda.
                      </p>
                    </article>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section
            aria-labelledby="security-heading"
            className="rounded-3xl border border-border bg-card p-5 shadow-card sm:p-6 lg:col-span-2"
          >
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
                <ShieldCheck size={18} />
              </div>
              <div className="min-w-0 flex-1">
                <h2 id="security-heading" className="text-lg font-700 text-foreground">
                  Seguridad
                </h2>
                <div className="mt-4 flex flex-col gap-4 rounded-2xl bg-background p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                  <div className="flex min-w-0 items-start gap-3">
                    <Mail size={17} className="mt-0.5 shrink-0 text-muted-foreground" />
                    <div className="min-w-0">
                      <p className="text-xs font-600 uppercase tracking-wider text-muted-foreground">
                        Email de acceso
                      </p>
                      <p className="mt-1 break-all text-sm font-600 text-foreground">{email}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    disabled={signingOut}
                    className="flex shrink-0 items-center justify-center gap-2 rounded-xl border border-danger/20 px-4 py-2.5 text-sm font-600 text-danger transition-colors hover:bg-danger/5 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {signingOut ? (
                      <Loader2 size={15} className="animate-spin" />
                    ) : (
                      <LogOut size={15} />
                    )}
                    {signingOut ? 'Cerrando…' : 'Cerrar sesión'}
                  </button>
                </div>
                <div className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
                  <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-positive" />
                  En esta etapa no se solicitan ni almacenan datos bancarios en Configuración.
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
}
