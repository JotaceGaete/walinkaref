'use client';

import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

const SESSION_TIMEOUT_MS = 2500;

export default function AuthCallbackPage() {
  const router = useRouter();
  const redirectedRef = useRef(false);

  useEffect(() => {
    let active = true;

    const safeRedirect = (to: string) => {
      if (!active || redirectedRef.current) return;
      redirectedRef.current = true;
      router.replace(to);
    };

    const timeoutId = window.setTimeout(() => {
      console.warn('[AuthCallback] Timeout resolviendo la sesión, volviendo a login');
      safeRedirect('/sign-up-login-screen');
    }, SESSION_TIMEOUT_MS);

    supabase.auth
      .getSession()
      .then(({ data: { session }, error }) => {
        window.clearTimeout(timeoutId);
        if (!active) return;
        if (error || !session) {
          safeRedirect('/sign-up-login-screen');
          return;
        }
        safeRedirect('/affiliate-dashboard');
      })
      .catch(() => {
        window.clearTimeout(timeoutId);
        safeRedirect('/sign-up-login-screen');
      });

    return () => {
      active = false;
      window.clearTimeout(timeoutId);
    };
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
        <p className="text-sm text-muted-foreground">Preparando tu acceso...</p>
      </div>
    </div>
  );
}
