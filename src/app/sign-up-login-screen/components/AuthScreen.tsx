'use client';
import React, { useState } from 'react';

import { useForm } from 'react-hook-form';
import { Eye, EyeOff, ArrowRight, CheckCircle, Copy, Check, AlertCircle } from 'lucide-react';
import AppLogo from '@/components/ui/AppLogo';

type LoginFormData = {
  email: string;
  password: string;
  remember: boolean;
};

type RegisterFormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
};

const demoCredentials = {
  email: 'afiliado@walinka.app',
  password: 'WalinkaRef2026',
};

export default function AuthScreen() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  const loginForm = useForm<LoginFormData>({
    defaultValues: { email: '', password: '', remember: false },
  });

  const registerForm = useForm<RegisterFormData>({
    defaultValues: { name: '', email: '', password: '', confirmPassword: '', terms: false },
  });

  const handleCopy = (field: string, value: string) => {
    navigator.clipboard.writeText(value);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleAutofill = () => {
    loginForm.setValue('email', demoCredentials.email);
    loginForm.setValue('password', demoCredentials.password);
    setAuthError(null);
  };

  // Backend integration point: connect to Supabase Auth here
  const handleLogin = async (data: LoginFormData) => {
    setIsLoading(true);
    setAuthError(null);
    await new Promise((r) => setTimeout(r, 1200));
    if (
      data.email !== demoCredentials.email ||
      data.password !== demoCredentials.password
    ) {
      setAuthError(
        'Credenciales inválidas — usa las cuentas demo de abajo para ingresar'
      );
      setIsLoading(false);
      return;
    }
    // Navigate to dashboard on success
    window.location.href = '/affiliate-dashboard';
  };

  // Backend integration point: connect to Supabase Auth signup here
  const handleRegister = async (_data: RegisterFormData) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    window.location.href = '/affiliate-dashboard';
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 gradient-hero flex-col justify-between p-12 relative overflow-hidden">
        {/* Decorative circles */}
        <div
          className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #ffffff, transparent 70%)', transform: 'translate(30%, -30%)' }}
        />
        <div
          className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #00C896, transparent 70%)', transform: 'translate(-30%, 30%)' }}
        />

        <div className="relative">
          <div className="flex items-center gap-3 mb-16">
            <AppLogo size={36} />
            <span className="font-bold text-xl text-white tracking-tight">WalinkaRef</span>
          </div>

          <h2 className="text-3xl font-800 text-white leading-tight mb-4">
            Gana recomendando<br />una plataforma que<br />
            <span className="text-accent">los negocios aman.</span>
          </h2>
          <p className="text-white/70 text-base leading-relaxed">
            US$5 por cada cliente calificado. Sin límites, sin tecnicismos.
          </p>
        </div>

        <div className="relative">
          {/* Mini stat cards */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: 'US$5', label: 'por calificado' },
              { value: '2 meses', label: 'condición' },
              { value: 'Inmediato', label: 'acreditación' },
            ].map((stat) => (
              <div
                key={`auth-stat-${stat.label}`}
                className="bg-white/10 rounded-xl p-4 border border-white/15"
              >
                <p className="text-white font-800 text-lg font-tabular">{stat.value}</p>
                <p className="text-white/60 text-xs mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
          <p className="text-white/40 text-xs mt-6">
            ref.walinka.com · Programa de afiliados oficial
          </p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 sm:px-10 lg:px-16 bg-background">
        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-2.5 mb-10">
          <AppLogo size={28} />
          <span className="font-bold text-base text-foreground">WalinkaRef</span>
        </div>

        <div className="w-full max-w-md mx-auto">
          {/* Mode toggle */}
          <div className="flex bg-muted rounded-xl p-1 mb-8">
            <button
              onClick={() => { setMode('login'); setAuthError(null); }}
              className={`flex-1 py-2.5 text-sm font-600 rounded-lg transition-all duration-200 ${
                mode === 'login' ?'bg-card shadow-card text-foreground' :'text-muted-foreground hover:text-foreground'
              }`}
            >
              Iniciar sesión
            </button>
            <button
              onClick={() => { setMode('register'); setAuthError(null); }}
              className={`flex-1 py-2.5 text-sm font-600 rounded-lg transition-all duration-200 ${
                mode === 'register' ?'bg-card shadow-card text-foreground' :'text-muted-foreground hover:text-foreground'
              }`}
            >
              Crear cuenta
            </button>
          </div>

          {/* Title */}
          <div className="mb-6">
            <h1 className="text-2xl font-800 text-foreground mb-1">
              {mode === 'login' ? 'Bienvenido de vuelta' : 'Únete al programa'}
            </h1>
            <p className="text-sm text-muted-foreground">
              {mode === 'login' ?'Ingresa a tu panel de afiliado' :'Crea tu cuenta y empieza a ganar'}
            </p>
          </div>

          {/* Error alert */}
          {authError && (
            <div className="flex items-start gap-3 bg-danger/10 border border-danger/20 rounded-xl p-4 mb-5">
              <AlertCircle size={16} className="text-danger mt-0.5 shrink-0" />
              <p className="text-sm text-danger">{authError}</p>
            </div>
          )}

          {/* Google SSO */}
          <button className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-card border border-border rounded-xl text-sm font-600 text-foreground hover:bg-muted transition-all duration-150 mb-5 shadow-sm">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
              <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
            </svg>
            Continuar con Google
          </button>

          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">o con email</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Login form */}
          {mode === 'login' && (
            <form onSubmit={loginForm.handleSubmit(handleLogin)} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-600 text-foreground mb-1.5">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  {...loginForm.register('email', {
                    required: 'El correo es obligatorio',
                    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Correo inválido' },
                  })}
                  className={`input-field ${loginForm.formState.errors.email ? 'input-field-error' : ''}`}
                  placeholder="tu@email.com"
                />
                {loginForm.formState.errors.email && (
                  <p className="text-xs text-danger mt-1.5">{loginForm.formState.errors.email.message}</p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm font-600 text-foreground">Contraseña</label>
                  <a href="#" className="text-xs text-primary hover:underline">
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    {...loginForm.register('password', {
                      required: 'La contraseña es obligatoria',
                      minLength: { value: 6, message: 'Mínimo 6 caracteres' },
                    })}
                    className={`input-field pr-11 ${loginForm.formState.errors.password ? 'input-field-error' : ''}`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {loginForm.formState.errors.password && (
                  <p className="text-xs text-danger mt-1.5">{loginForm.formState.errors.password.message}</p>
                )}
              </div>

              <div className="flex items-center gap-2.5">
                <input
                  type="checkbox"
                  id="remember"
                  {...loginForm.register('remember')}
                  className="w-4 h-4 rounded border-border accent-primary"
                />
                <label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer">
                  Mantener sesión iniciada
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary py-3.5 text-sm flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ minWidth: '100%' }}
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Ingresando...
                  </>
                ) : (
                  <>
                    Iniciar sesión
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Register form */}
          {mode === 'register' && (
            <form onSubmit={registerForm.handleSubmit(handleRegister)} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-600 text-foreground mb-1.5">
                  Nombre completo
                </label>
                <input
                  type="text"
                  {...registerForm.register('name', { required: 'El nombre es obligatorio' })}
                  className={`input-field ${registerForm.formState.errors.name ? 'input-field-error' : ''}`}
                  placeholder="Tu nombre"
                />
                {registerForm.formState.errors.name && (
                  <p className="text-xs text-danger mt-1.5">{registerForm.formState.errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-600 text-foreground mb-1.5">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  {...registerForm.register('email', {
                    required: 'El correo es obligatorio',
                    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Correo inválido' },
                  })}
                  className={`input-field ${registerForm.formState.errors.email ? 'input-field-error' : ''}`}
                  placeholder="tu@email.com"
                />
                {registerForm.formState.errors.email && (
                  <p className="text-xs text-danger mt-1.5">{registerForm.formState.errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-600 text-foreground mb-1.5">Contraseña</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    {...registerForm.register('password', {
                      required: 'La contraseña es obligatoria',
                      minLength: { value: 8, message: 'Mínimo 8 caracteres' },
                    })}
                    className={`input-field pr-11 ${registerForm.formState.errors.password ? 'input-field-error' : ''}`}
                    placeholder="Mínimo 8 caracteres"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {registerForm.formState.errors.password && (
                  <p className="text-xs text-danger mt-1.5">{registerForm.formState.errors.password.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-600 text-foreground mb-1.5">
                  Confirmar contraseña
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    {...registerForm.register('confirmPassword', {
                      required: 'Confirma tu contraseña',
                      validate: (val) =>
                        val === registerForm.watch('password') || 'Las contraseñas no coinciden',
                    })}
                    className={`input-field pr-11 ${registerForm.formState.errors.confirmPassword ? 'input-field-error' : ''}`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {registerForm.formState.errors.confirmPassword && (
                  <p className="text-xs text-danger mt-1.5">{registerForm.formState.errors.confirmPassword.message}</p>
                )}
              </div>

              <div>
                <div className="flex items-start gap-2.5">
                  <input
                    type="checkbox"
                    id="terms"
                    {...registerForm.register('terms', { required: 'Debes aceptar los términos' })}
                    className="w-4 h-4 rounded border-border accent-primary mt-0.5"
                  />
                  <label htmlFor="terms" className="text-sm text-muted-foreground cursor-pointer leading-relaxed">
                    Acepto los{' '}
                    <a href="#" className="text-primary hover:underline">Términos del programa</a>{' '}
                    y la{' '}
                    <a href="#" className="text-primary hover:underline">Política de privacidad</a>
                  </label>
                </div>
                {registerForm.formState.errors.terms && (
                  <p className="text-xs text-danger mt-1.5">{registerForm.formState.errors.terms.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary py-3.5 text-sm flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creando cuenta...
                  </>
                ) : (
                  <>
                    Crear mi cuenta
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Demo credentials */}
          {mode === 'login' && (
            <div className="mt-6 bg-secondary rounded-xl border border-primary/10 p-4">
              <p className="text-xs font-600 text-primary mb-3 uppercase tracking-wider">
                Cuenta demo
              </p>
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between bg-card rounded-lg px-3 py-2 border border-border">
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">Email</p>
                    <p className="text-xs font-600 text-foreground font-tabular">{demoCredentials.email}</p>
                  </div>
                  <button
                    onClick={() => handleCopy('email', demoCredentials.email)}
                    className="p-1.5 rounded-md hover:bg-muted transition-colors"
                    aria-label="Copiar email"
                  >
                    {copiedField === 'email' ? (
                      <Check size={13} className="text-accent" />
                    ) : (
                      <Copy size={13} className="text-muted-foreground" />
                    )}
                  </button>
                </div>
                <div className="flex items-center justify-between bg-card rounded-lg px-3 py-2 border border-border">
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">Contraseña</p>
                    <p className="text-xs font-600 text-foreground font-tabular">{demoCredentials.password}</p>
                  </div>
                  <button
                    onClick={() => handleCopy('password', demoCredentials.password)}
                    className="p-1.5 rounded-md hover:bg-muted transition-colors"
                    aria-label="Copiar contraseña"
                  >
                    {copiedField === 'password' ? (
                      <Check size={13} className="text-accent" />
                    ) : (
                      <Copy size={13} className="text-muted-foreground" />
                    )}
                  </button>
                </div>
                <button
                  type="button"
                  onClick={handleAutofill}
                  className="w-full py-2 text-xs font-600 text-primary bg-primary/5 hover:bg-primary/10 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                >
                  <CheckCircle size={13} />
                  Usar estas credenciales
                </button>
              </div>
            </div>
          )}

          <p className="text-center text-xs text-muted-foreground mt-6">
            {mode === 'login' ? (
              <>
                ¿No tienes cuenta?{' '}
                <button
                  onClick={() => setMode('register')}
                  className="text-primary font-600 hover:underline"
                >
                  Regístrate gratis
                </button>
              </>
            ) : (
              <>
                ¿Ya tienes cuenta?{' '}
                <button
                  onClick={() => setMode('login')}
                  className="text-primary font-600 hover:underline"
                >
                  Inicia sesión
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}