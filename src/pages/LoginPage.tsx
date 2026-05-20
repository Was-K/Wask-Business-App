import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Mail,
  Lock,
  ArrowRight,
  Shield,
  AlertCircle,
  CheckCircle2,
  User,
  Phone,
  Building2,
  Hash,
  MapPin,
  Briefcase,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ApiError } from '../services/apiClient';
import type { UserRole } from '../types/api';

type AuthMode = 'login' | 'register';

function routeForRole(role?: UserRole): string {
  switch (role) {
    case 'ADMIN':
      return '/admin/dashboard';
    case 'BUSINESS_OWNER':
      return '/business/dashboard';
    default:
      return '/';
  }
}

function translateAuthError(err: unknown): string {
  if (err instanceof Error) {
    return err.message;
  }
  if (err instanceof ApiError) {
    if (err.status === 0) return 'No se pudo contactar al servidor. Verifica tu conexión.';
    if (err.status === 401) return 'Tu cuenta está pendiente de aprobación o las credenciales son incorrectas.';
    if (err.status === 403) return 'No tienes permisos para ingresar a este portal.';
    if (err.status >= 500) return 'El servidor no está disponible. Intenta de nuevo más tarde.';
    return err.message || 'Error al iniciar sesión';
  }
  return 'Error inesperado. Intenta de nuevo.';
}

const INDUSTRY_OPTIONS = [
  'Licorería',
  'Bodega',
  'Tienda de conveniencia',
  'Distribuidora',
  'Restaurante',
  'Bar / Cantina',
  'Supermercado',
  'Otro',
];

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    businessIdentifier: '',
    address: '',
    industry: '',
  });

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegisterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setRegisterForm((prev) => ({ ...prev, [name]: value }));
  };

  const switchMode = (mode: AuthMode) => {
    setAuthMode(mode);
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);
    try {
      const user = await login(loginForm.email, loginForm.password);
      navigate(routeForRole(user.role));
    } catch (err) {
      setErrorMessage(translateAuthError(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    if (registerForm.password !== registerForm.confirmPassword) {
      setErrorMessage('Las contraseñas no coinciden.');
      return;
    }
    if (registerForm.password.length < 10) {
      setErrorMessage('La contraseña debe tener al menos 10 caracteres.');
      return;
    }

    setIsLoading(true);
    try {
      await register({
        firstName: registerForm.firstName,
        lastName: registerForm.lastName,
        email: registerForm.email,
        phone: registerForm.phone || undefined,
        password: registerForm.password,
        companyName: registerForm.companyName,
        businessIdentifier: registerForm.businessIdentifier,
        address: registerForm.address || undefined,
        industry: registerForm.industry || undefined,
      });
      setSuccessMessage(
        'Solicitud enviada correctamente. Un administrador revisará tu negocio antes de habilitar el acceso.',
      );
      setAuthMode('login');
      setRegisterForm({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        companyName: '',
        businessIdentifier: '',
        address: '',
        industry: '',
      });
    } catch (err) {
      setErrorMessage(translateAuthError(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen overflow-hidden bg-black relative">
      {/* Ambient blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-white/5 rounded-full mix-blend-screen blur-3xl animate-float" />
        <div className="absolute -top-20 -right-40 w-80 h-80 bg-white/5 rounded-full mix-blend-screen blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute -bottom-40 -left-20 w-96 h-96 bg-white/5 rounded-full mix-blend-screen blur-3xl animate-float" style={{ animationDelay: '4s' }} />
        <div className="absolute -bottom-20 -right-32 w-80 h-80 bg-white/5 rounded-full mix-blend-screen blur-3xl animate-float" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="w-full max-w-md">
          <div className="rounded-3xl bg-gray-900/60 backdrop-blur-2xl border border-white/10 shadow-glass overflow-hidden">
            {/* Header */}
            <div className="px-6 sm:px-8 pt-8 pb-6 text-center border-b border-white/10">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/10 border border-white/20 mb-4">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <p className="text-xs font-semibold tracking-widest text-white/70 uppercase mb-3">
                Portal de negocios
              </p>
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-1">
                {authMode === 'login' ? 'Ingresar' : 'Solicitar cuenta'}
              </h1>
              {authMode === 'register' && (
                <p className="text-sm text-white/50 mt-2">
                  Licorería · Bodega · Tienda de alcohol
                </p>
              )}
            </div>

            <div className="px-6 sm:px-8 py-8">
              {/* Mode toggle */}
              <div className="flex gap-3 p-1 bg-gray-800/50 rounded-full border border-white/10 mb-8">
                {(['login', 'register'] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => switchMode(mode)}
                    className={`flex-1 py-2.5 px-4 rounded-full font-medium text-sm transition-all duration-300 ${
                      authMode === mode
                        ? 'bg-white text-black shadow-lg'
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    {mode === 'login' ? 'Ingresar' : 'Registrarse'}
                  </button>
                ))}
              </div>

              {/* Messages */}
              {errorMessage && (
                <div className="mb-6 flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <p className="text-sm">{errorMessage}</p>
                </div>
              )}
              {successMessage && (
                <div className="mb-6 flex items-start gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-200">
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <p className="text-sm">{successMessage}</p>
                </div>
              )}

              {/* Login form */}
              {authMode === 'login' && (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50 group-focus-within:text-white transition-colors duration-300" />
                    <input
                      type="email"
                      name="email"
                      autoComplete="email"
                      value={loginForm.email}
                      onChange={handleLoginChange}
                      placeholder="correo@negocio.com"
                      required
                      className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-900/50 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all duration-300 backdrop-blur-sm"
                    />
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50 group-focus-within:text-white transition-colors duration-300" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      autoComplete="current-password"
                      value={loginForm.password}
                      onChange={handleLoginChange}
                      placeholder="••••••••"
                      required
                      className="w-full pl-12 pr-12 py-3 rounded-xl bg-gray-900/50 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all duration-300 backdrop-blur-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-2 py-3 px-6 rounded-xl font-semibold uppercase tracking-wider text-sm bg-white text-black hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2 group shadow-lg"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                        Verificando…
                      </>
                    ) : (
                      <>
                        Ingresar
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* Register form */}
              {authMode === 'register' && (
                <form onSubmit={handleRegister} className="space-y-4">
                  {/* Responsable del negocio */}
                  <p className="text-xs font-semibold text-white/50 uppercase tracking-wider">
                    Responsable del negocio
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                      <input
                        type="text"
                        name="firstName"
                        autoComplete="given-name"
                        value={registerForm.firstName}
                        onChange={handleRegisterChange}
                        placeholder="Nombre"
                        required
                        className="w-full pl-10 pr-3 py-3 rounded-xl bg-gray-900/50 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-300 text-sm"
                      />
                    </div>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                      <input
                        type="text"
                        name="lastName"
                        autoComplete="family-name"
                        value={registerForm.lastName}
                        onChange={handleRegisterChange}
                        placeholder="Apellido"
                        required
                        className="w-full pl-10 pr-3 py-3 rounded-xl bg-gray-900/50 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-300 text-sm"
                      />
                    </div>
                  </div>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                    <input
                      type="email"
                      name="email"
                      autoComplete="email"
                      value={registerForm.email}
                      onChange={handleRegisterChange}
                      placeholder="Correo electrónico"
                      required
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-gray-900/50 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-300 text-sm"
                    />
                  </div>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                    <input
                      type="tel"
                      name="phone"
                      autoComplete="tel"
                      value={registerForm.phone}
                      onChange={handleRegisterChange}
                      placeholder="Teléfono (opcional)"
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-gray-900/50 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-300 text-sm"
                    />
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      autoComplete="new-password"
                      value={registerForm.password}
                      onChange={handleRegisterChange}
                      placeholder="Contraseña (mín. 10 caracteres)"
                      required
                      minLength={10}
                      className="w-full pl-11 pr-12 py-3 rounded-xl bg-gray-900/50 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-300 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      name="confirmPassword"
                      autoComplete="new-password"
                      value={registerForm.confirmPassword}
                      onChange={handleRegisterChange}
                      placeholder="Confirmar contraseña"
                      required
                      className="w-full pl-11 pr-12 py-3 rounded-xl bg-gray-900/50 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-300 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((v) => !v)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                    >
                      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Datos del negocio */}
                  <p className="text-xs font-semibold text-white/50 uppercase tracking-wider pt-2">
                    Datos del negocio
                  </p>
                  <div className="relative">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                    <input
                      type="text"
                      name="companyName"
                      autoComplete="organization"
                      value={registerForm.companyName}
                      onChange={handleRegisterChange}
                      placeholder="Nombre del negocio"
                      required
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-gray-900/50 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-300 text-sm"
                    />
                  </div>
                  <div className="relative">
                    <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                    <input
                      type="text"
                      name="businessIdentifier"
                      autoComplete="off"
                      value={registerForm.businessIdentifier}
                      onChange={handleRegisterChange}
                      placeholder="RUC / DNI / Identificador"
                      required
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-gray-900/50 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-300 text-sm"
                    />
                  </div>
                  <div className="relative">
                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                    <select
                      name="industry"
                      value={registerForm.industry}
                      onChange={handleRegisterChange}
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-gray-900/50 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-300 text-sm appearance-none"
                    >
                      <option value="" className="bg-gray-900">Tipo de negocio (opcional)</option>
                      {INDUSTRY_OPTIONS.map((opt) => (
                        <option key={opt} value={opt} className="bg-gray-900">{opt}</option>
                      ))}
                    </select>
                  </div>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                    <input
                      type="text"
                      name="address"
                      autoComplete="street-address"
                      value={registerForm.address}
                      onChange={handleRegisterChange}
                      placeholder="Dirección (opcional)"
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-gray-900/50 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-300 text-sm"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-2 py-3 px-6 rounded-xl font-semibold uppercase tracking-wider text-sm bg-white text-black hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2 group shadow-lg"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                        Enviando solicitud…
                      </>
                    ) : (
                      <>
                        Solicitar cuenta de negocio
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* Footer link */}
              <p className="text-center text-sm text-white/60 mt-6">
                {authMode === 'login' ? (
                  <>
                    ¿No tienes cuenta?{' '}
                    <button
                      type="button"
                      onClick={() => switchMode('register')}
                      className="text-white hover:text-gray-200 font-semibold transition-colors duration-300"
                    >
                      Registra tu negocio
                    </button>
                  </>
                ) : (
                  <>
                    ¿Ya tienes cuenta?{' '}
                    <button
                      type="button"
                      onClick={() => switchMode('login')}
                      className="text-white hover:text-gray-200 font-semibold transition-colors duration-300"
                    >
                      Ingresa aquí
                    </button>
                  </>
                )}
              </p>
            </div>
          </div>

          <div className="text-center mt-6 text-xs text-white/50 flex items-center justify-center gap-2">
            <Shield className="w-4 h-4" />
            <span>Solo para licorerías, bodegas y tiendas registradas en Wask</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
