'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AppLogo from '@/components/ui/AppLogo';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { label: 'Cómo funciona', href: '#como-funciona' },
  { label: 'Calculadora', href: '#calculadora' },
  { label: 'Recursos', href: '/affiliate-resources' },
];

export default function PublicNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-card/95 backdrop-blur-md shadow-card border-b border-border'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-screen-xl mx-auto px-6 lg:px-10 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2.5">
          <AppLogo size={32} />
          <span className="font-bold text-lg text-foreground tracking-tight">
            WalinkaRef
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks?.map((link) => (
            <a
              key={`nav-${link?.label}`}
              href={link?.href}
              className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-150"
            >
              {link?.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/sign-up-login-screen"
            className="px-4 py-2 text-sm font-medium text-primary hover:bg-secondary rounded-lg transition-all duration-150"
          >
            Iniciar sesión
          </Link>
          <Link
            href="/sign-up-login-screen"
            className="btn-primary px-5 py-2 text-sm"
          >
            Quiero ser afiliado
          </Link>
        </div>

        <button
          className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <X size={20} className="text-foreground" />
          ) : (
            <Menu size={20} className="text-foreground" />
          )}
        </button>
      </div>
      {mobileOpen && (
        <div className="md:hidden bg-card border-t border-border animate-fade-in">
          <div className="px-6 py-4 flex flex-col gap-2">
            {navLinks?.map((link) => (
              <a
                key={`mobile-nav-${link?.label}`}
                href={link?.href}
                className="px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                onClick={() => setMobileOpen(false)}
              >
                {link?.label}
              </a>
            ))}
            <div className="pt-2 border-t border-border flex flex-col gap-2">
              <Link
                href="/sign-up-login-screen"
                className="px-4 py-3 text-sm font-medium text-center border border-border rounded-lg hover:bg-muted transition-all"
                onClick={() => setMobileOpen(false)}
              >
                Iniciar sesión
              </Link>
              <Link
                href="/sign-up-login-screen"
                className="btn-primary px-4 py-3 text-sm text-center"
                onClick={() => setMobileOpen(false)}
              >
                Quiero ser afiliado
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}