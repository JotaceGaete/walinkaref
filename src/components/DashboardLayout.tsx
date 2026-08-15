'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import AppLogo from '@/components/ui/AppLogo';
import {
  LayoutDashboard,
  Users,
  Link2,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Menu,
} from 'lucide-react';
import Icon from '@/components/ui/AppIcon';
import { useAuth } from '@/contexts/AuthContext';

const sidebarLinks = [
  {
    label: 'Dashboard',
    href: '/affiliate-dashboard',
    pathname: '/affiliate-dashboard',
    hash: '',
    icon: LayoutDashboard,
    badgeKey: null,
  },
  {
    label: 'Referidos',
    href: '/affiliate-dashboard#referidos',
    pathname: '/affiliate-dashboard',
    hash: '#referidos',
    icon: Users,
    badgeKey: 'referrals',
  },
  {
    label: 'Mi enlace',
    href: '/affiliate-dashboard#mi-enlace',
    pathname: '/affiliate-dashboard',
    hash: '#mi-enlace',
    icon: Link2,
    badgeKey: null,
  },
  {
    label: 'Configuración',
    href: '/affiliate-settings',
    pathname: '/affiliate-settings',
    hash: '',
    icon: Settings,
    badgeKey: null,
  },
] as const;

interface DashboardLayoutProps {
  children: React.ReactNode;
  /**
   * invitedCount real de wa_get_my_referral_stats(), si la página que
   * envuelve ya lo tiene cargado (hoy solo /affiliate-dashboard). Sin esto
   * (undefined/null, p.ej. en /affiliate-resources o mientras stats está
   * cargando) el badge de "Referidos" no se muestra — nunca se rellena con
   * un valor inventado. Pasar por prop evita que este layout compartido
   * dispare su propia llamada RPC.
   */
  referralsCount?: number | null;
}

export default function DashboardLayout({ children, referralsCount }: DashboardLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeHash, setActiveHash] = useState('');
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, signOut } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/sign-up-login-screen');
    }
  }, [loading, user, router]);

  useEffect(() => {
    const syncHash = () => setActiveHash(window.location.hash);
    syncHash();
    window.addEventListener('hashchange', syncHash);
    return () => window.removeEventListener('hashchange', syncHash);
  }, [pathname]);

  const handleLogout = async () => {
    await signOut();
    router.replace('/sign-up-login-screen');
  };

  // Sesión aún resolviéndose, o ya resuelta pero sin usuario (a punto de
  // redirigir vía el efecto de arriba): no renderizar el panel.
  if (loading || !user) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const displayName =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email?.split('@')[0] ||
    'Afiliado';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-foreground/20 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:relative z-50 lg:z-auto
          flex flex-col h-full bg-card border-r border-border shadow-xl shadow-foreground/5 lg:shadow-none
          transition-all duration-300 ease-in-out
          ${collapsed ? 'w-16' : 'w-60'}
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo */}
        <div
          className={`flex items-center h-[4.5rem] border-b border-border px-4 ${collapsed ? 'justify-center' : 'gap-3'}`}
        >
          <AppLogo size={28} />
          {!collapsed && (
            <span className="font-bold text-base text-foreground tracking-tight">WalinkaRef</span>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-5 flex flex-col gap-1.5 overflow-y-auto">
          {!collapsed && (
            <p className="text-xs font-600 uppercase tracking-widest text-muted-foreground px-3 mb-2">
              Menú
            </p>
          )}
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.pathname && activeHash === link.hash;
            const Icon = link.icon;
            const badge = link.badgeKey === 'referrals' ? referralsCount : null;
            const hasBadge = badge !== null && badge !== undefined;
            return (
              <Link
                key={`sidebar-${link.label}`}
                href={link.href}
                aria-current={isActive ? 'page' : undefined}
                onClick={() => {
                  setActiveHash(link.hash);
                  setMobileOpen(false);
                }}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-600 transition-all duration-150 relative group ${
                  isActive ? 'sidebar-link-active' : 'sidebar-link'
                }`}
                title={collapsed ? link.label : undefined}
              >
                <Icon size={18} className="shrink-0" />
                {!collapsed && <span>{link.label}</span>}
                {!collapsed && hasBadge && (
                  <span className="ml-auto bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded-full">
                    {badge}
                  </span>
                )}
                {collapsed && hasBadge && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
                )}
                {collapsed && (
                  <span className="absolute left-full ml-3 px-2 py-1 bg-foreground text-card text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                    {link.label}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="px-3 py-4 border-t border-border flex flex-col gap-1 bg-muted/20">
          <button
            type="button"
            onClick={handleLogout}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-danger hover:bg-danger/10 transition-all w-full ${collapsed ? 'justify-center' : ''}`}
            title={collapsed ? 'Cerrar sesión' : undefined}
          >
            <LogOut size={18} className="shrink-0" />
            {!collapsed && <span>Cerrar sesión</span>}
          </button>
        </div>

        {/* Collapse toggle */}
        <button
          className="hidden lg:flex absolute -right-3 top-20 w-6 h-6 bg-card border border-border rounded-full items-center justify-center shadow-card hover:shadow-card-hover transition-all"
          onClick={() => setCollapsed(!collapsed)}
          aria-label="Toggle sidebar"
        >
          {collapsed ? (
            <ChevronRight size={12} className="text-muted-foreground" />
          ) : (
            <ChevronLeft size={12} className="text-muted-foreground" />
          )}
        </button>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="h-[4.5rem] bg-card/95 backdrop-blur border-b border-border flex items-center justify-between px-4 sm:px-6 shrink-0">
          <button
            type="button"
            className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            onClick={() => setMobileOpen(true)}
            aria-label="Abrir menú"
            aria-expanded={mobileOpen}
          >
            <Menu size={20} className="text-foreground" />
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5 pl-3 border-l border-border">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold">
                {initial}
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-600 text-foreground leading-tight">{displayName}</p>
                <p className="text-xs text-muted-foreground leading-tight">Afiliado activo</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
