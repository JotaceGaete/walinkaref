'use client';
import React, { useState } from 'react';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import AppLogo from '@/components/ui/AppLogo';
import { useAuth } from '@/contexts/AuthContext';

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

export default function AuthScreen() {
  const router = useRouter();
  const { signIn, signUp, signInWithGoogle } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  const loginForm = useForm<LoginFormData>({
    defaultValues: { email: '', password: '', remember: false },
  });

  const registerForm = useForm<RegisterFormData>({
    defaultValues: { name: '', email: '', password: '', confirmPassword: '', terms: false },
  });

  const switchMode = (next: 'login' | 'register') => {
    setMode(next);
    setAuthError(null);
    setInfoMessage(null);
  };

  const handleLogin = async (data: LoginFormData) => {
    setIsLoading(true);
    setAuthError(null);
    const { error } = await signIn(data.email, data.password);
    setIsLoading(false);
    if (error) {
      setAuthError('Credenciales inválidas. Verifica tu correo y contraseña.');
      return;
    }
    router.push('/affiliate-dashboard');
  };

  const handleRegister = async (data: RegisterFormData) => {
    setIsLoading(true);
    setAuthError(null);
    const { error, needsEmailConfirmation } = await signUp(data.email, data.password, data.name);
    setIsLoading(false);
    if (error) {
      setAuthError(error.message || 'No se pudo crear tu cuenta. Intenta nuevamente.');
      return;
    }
    if (needsEmailConfirmation) {
      switchMode('login');
      setInfoMessage('Revisa tu correo para confirmar tu cuenta antes de iniciar sesión.');
      return;
    }
    router.push('/affiliate-dashboard');
  };

  const handleGoogleSignIn = async () => {
    setAuthError(null);
    setInfoMessage(null);
    setIsGoogleLoading(true);
    const { error } = await signInWithGoogle();
    // Sin error: signInWithGoogle ya redirigió el navegador a Google — no
    // hay nada más que hacer acá. Con error, nos quedamos en la pantalla.
    if (error) {
      setAuthError(error.message || 'No se pudo iniciar sesión con Google. Intenta nuevamente.');
      setIsGoogleLoading(false);
    }
  };

  return (
    <div data-testid="auth-screen" className="flex min-h-screen w-full min-w-0 overflow-x-hidden">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 gradient-hero flex-col justify-between p-12 relative overflow-hidden">
        {/* Decorative circles */}
        <div
          className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10"
          style={{
            background: 'radial-gradient(circle, #ffffff, transparent 70%)',
            transform: 'translate(30%, -30%)',
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-10"
          style={{
            background: 'radial-gradient(circle, #00C896, transparent 70%)',
            transform: 'translate(-30%, 30%)',
          }}
        />

        <div className="relative">
          <div className="flex items-center gap-3 mb-16">
            <AppLogo size={36} />
            <span className="font-bold text-xl text-white tracking-tight">WalinkaRef</span>
          </div>

          <h2 className="text-3xl font-800 text-white leading-tight mb-4">
            Gana recomendando
            <br />
            una plataforma que
            <br />
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
      <div className="flex min-w-0 flex-1 flex-col justify-center bg-background px-4 py-8 sm:px-10 sm:py-12 lg:px-16">
        {/* Mobile logo */}
        <div className="mb-8 flex items-center gap-2.5 lg:hidden sm:mb-10">
          <AppLogo size={28} />
          <span className="font-bold text-base text-foreground">WalinkaRef</span>
        </div>

        <div className="mx-auto w-full min-w-0 max-w-md">
          {/* Mode toggle */}
          <div className="mb-8 flex min-w-0 rounded-xl bg-muted p-1">
            <button
              onClick={() => switchMode('login')}
              className={`min-w-0 flex-1 rounded-lg px-2 py-2.5 text-sm font-600 transition-all duration-200 ${
                mode === 'login'
                  ? 'bg-card shadow-card text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Iniciar sesión
            </button>
            <button
              onClick={() => switchMode('register')}
              className={`min-w-0 flex-1 rounded-lg px-2 py-2.5 text-sm font-600 transition-all duration-200 ${
                mode === 'register'
                  ? 'bg-card shadow-card text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
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
              {mode === 'login'
                ? 'Ingresa a tu panel de afiliado'
                : 'Crea tu cuenta y empieza a ganar'}
            </p>
          </div>

          {/* Error alert */}
          {authError && (
            <div className="flex items-start gap-3 bg-danger/10 border border-danger/20 rounded-xl p-4 mb-5">
              <AlertCircle size={16} className="text-danger mt-0.5 shrink-0" />
              <p className="text-sm text-danger">{authError}</p>
            </div>
          )}

          {/* Info alert (p.ej. confirmación de email pendiente) */}
          {infoMessage && (
            <div className="flex items-start gap-3 bg-positive/10 border border-positive/20 rounded-xl p-4 mb-5">
              <CheckCircle2 size={16} className="text-positive mt-0.5 shrink-0" />
              <p className="text-sm text-positive">{infoMessage}</p>
            </div>
          )}

          {/* Google SSO — redirectTo lo resuelve getAuthRedirectUrl()
              (src/config/authUrl.ts), propio de ref.walinka.com: local
              apunta a localhost:4028/auth/callback, producción siempre a
              ref.walinka.com/auth/callback. */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-card border border-border rounded-xl text-sm font-600 text-foreground hover:bg-muted transition-all duration-150 mb-5 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isGoogleLoading ? (
              <div className="w-4 h-4 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" />
            ) : (
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path
                  d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
                  fill="#4285F4"
                />
                <path
                  d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z"
                  fill="#34A853"
                />
                <path
                  d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
                  fill="#FBBC05"
                />
                <path
                  d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
                  fill="#EA4335"
                />
              </svg>
            )}
            {isGoogleLoading ? 'Conectando...' : 'Continuar con Google'}
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
                  <p className="text-xs text-danger mt-1.5">
                    {loginForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <div className="mb-1.5 flex min-w-0 items-start justify-between gap-2">
                  <label className="text-sm font-600 text-foreground">Contraseña</label>
                  <a
                    href="#"
                    className="shrink-0 text-right text-xs leading-5 text-primary hover:underline"
                  >
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
                  <p className="text-xs text-danger mt-1.5">
                    {loginForm.formState.errors.password.message}
                  </p>
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
            <form
              onSubmit={registerForm.handleSubmit(handleRegister)}
              className="flex flex-col gap-4"
            >
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
                  <p className="text-xs text-danger mt-1.5">
                    {registerForm.formState.errors.name.message}
                  </p>
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
                  <p className="text-xs text-danger mt-1.5">
                    {registerForm.formState.errors.email.message}
                  </p>
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
                  <p className="text-xs text-danger mt-1.5">
                    {registerForm.formState.errors.password.message}
                  </p>
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
                  <p className="text-xs text-danger mt-1.5">
                    {registerForm.formState.errors.confirmPassword.message}
                  </p>
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
                  <label
                    htmlFor="terms"
                    className="text-sm text-muted-foreground cursor-pointer leading-relaxed"
                  >
                    Acepto los{' '}
                    <a href="#" className="text-primary hover:underline">
                      Términos del programa
                    </a>{' '}
                    y la{' '}
                    <a href="#" className="text-primary hover:underline">
                      Política de privacidad
                    </a>
                  </label>
                </div>
                {registerForm.formState.errors.terms && (
                  <p className="text-xs text-danger mt-1.5">
                    {registerForm.formState.errors.terms.message}
                  </p>
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

          <p className="text-center text-xs text-muted-foreground mt-6">
            {mode === 'login' ? (
              <>
                ¿No tienes cuenta?{' '}
                <button
                  onClick={() => switchMode('register')}
                  className="text-primary font-600 hover:underline"
                >
                  Regístrate gratis
                </button>
              </>
            ) : (
              <>
                ¿Ya tienes cuenta?{' '}
                <button
                  onClick={() => switchMode('login')}
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
