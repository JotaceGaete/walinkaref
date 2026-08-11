'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { getAuthRedirectUrl } from '@/config/authUrl';

type AuthError = { message: string } | null;

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: AuthError }>;
  signUp: (
    email: string,
    password: string,
    name: string
  ) => Promise<{ error: AuthError; needsEmailConfirmation: boolean }>;
  signOut: () => Promise<void>;
  // Definida y lista para usarse, pero deliberadamente NO conectada a la UI
  // todavía: requiere que ref.walinka.com/auth/callback esté agregado a la
  // lista de Redirect URLs del proyecto Supabase (cambio remoto pendiente,
  // fuera de alcance de esta fase).
  signInWithGoogle: () => Promise<{ error: AuthError }>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!active) return;
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return;
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn: AuthContextValue['signIn'] = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error ? { message: error.message } : null };
  };

  const signUp: AuthContextValue['signUp'] = async (email, password, name) => {
    const emailRedirectTo = getAuthRedirectUrl();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo,
        data: { full_name: name, name },
      },
    });
    if (error) {
      return { error: { message: error.message }, needsEmailConfirmation: false };
    }
    // Sin sesión tras signUp = confirmación de email pendiente.
    return { error: null, needsEmailConfirmation: !data.session };
  };

  const signOut: AuthContextValue['signOut'] = async () => {
    await supabase.auth.signOut();
  };

  const signInWithGoogle: AuthContextValue['signInWithGoogle'] = async () => {
    const redirectTo = getAuthRedirectUrl();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo },
    });
    return { error: error ? { message: error.message } : null };
  };

  const value: AuthContextValue = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
