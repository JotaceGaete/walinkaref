import { createClient } from '@supabase/supabase-js';

// Exportado (solo la URL, nunca la anon key) para diagnóstico server-side:
// permite loguear el host de Supabase contra el que se está corriendo sin
// tocar credenciales.
export const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? '').replace(/\/$/, '');
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Faltan variables de entorno de Supabase: revisa NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY en .env'
  );
}

// Mismo proyecto Supabase que go.ventalink.app: mismo auth.users, mismo Affiliate Core.
// Cliente único de navegador — sin SSR/cookies todavía (fuera del alcance de esta fase).
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});
