import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import {
  authService,
  type RegisterBusinessOwnerPayload,
} from '../services/authService';
import { clearTokens, getAccessToken } from '../services/tokenStorage';
import type { User, UserRole } from '../types/api';

export type { User, UserRole };

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<User>;
  register: (payload: RegisterBusinessOwnerPayload) => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<boolean>;
  loadCurrentUser: () => Promise<User | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function buildLoginError(user: User): string | null {
  const role = user.role;

  if (role === 'CUSTOMER') {
    return 'Esta cuenta pertenece a la app móvil de clientes. Descarga la app Wask para continuar.';
  }
  if (role === 'DELIVERY') {
    return 'Esta cuenta pertenece al módulo de delivery. Usa la app de repartidores.';
  }
  if (role === 'BUSINESS_OWNER') {
    if (user.status === 'PENDING') {
      return 'Tu negocio está pendiente de aprobación por el administrador.';
    }
    if (user.status === 'SUSPENDED' || user.status === 'DISABLED') {
      return 'Tu cuenta está suspendida o deshabilitada. Contacta al soporte.';
    }
    const vs = user.business?.verificationStatus;
    if (vs === 'PENDING') {
      return 'Tu solicitud de negocio aún está en revisión. Te notificaremos cuando sea aprobada.';
    }
    if (vs === 'REJECTED') {
      const reason = user.business?.rejectionReason;
      return reason
        ? `Tu solicitud fue rechazada: ${reason}`
        : 'Tu solicitud de negocio fue rechazada. Contacta al administrador.';
    }
  }
  return null;
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadCurrentUser = useCallback(async (): Promise<User | null> => {
    try {
      const me = await authService.getCurrentUser();
      setUser(me);
      return me;
    } catch (err) {
      setUser(null);
      throw err;
    }
  }, []);

  const refreshSession = useCallback(async (): Promise<boolean> => {
    const tokens = await authService.refreshToken();
    return !!tokens;
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function bootstrap() {
      const token = getAccessToken();
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        await loadCurrentUser();
      } catch {
        try {
          const refreshed = await authService.refreshToken();
          if (refreshed) {
            await loadCurrentUser();
          } else {
            clearTokens();
          }
        } catch {
          clearTokens();
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }
    bootstrap();
    return () => {
      cancelled = true;
    };
  }, [loadCurrentUser]);

  const login = useCallback(async (email: string, password: string): Promise<User> => {
    setError(null);
    setIsLoading(true);
    try {
      await authService.login(email, password);
      const me = await loadCurrentUser();
      if (!me) throw new Error('No se pudo cargar la sesión');

      const blockMessage = buildLoginError(me);
      if (blockMessage) {
        clearTokens();
        setUser(null);
        throw new Error(blockMessage);
      }

      // Only ADMIN and BUSINESS_OWNER with VERIFIED business may enter.
      if (me.role !== 'ADMIN' && me.role !== 'BUSINESS_OWNER') {
        clearTokens();
        setUser(null);
        throw new Error('No tienes permisos para acceder a este portal.');
      }

      return me;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al iniciar sesión';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [loadCurrentUser]);

  // register creates a pending BUSINESS_OWNER account.
  // No tokens are issued — user must wait for admin approval before logging in.
  const register = useCallback(async (payload: RegisterBusinessOwnerPayload): Promise<void> => {
    setError(null);
    setIsLoading(true);
    try {
      await authService.registerBusinessOwner(payload);
      // Intentionally do NOT set user or tokens here.
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al registrarse';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
      setError(null);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        error,
        login,
        register,
        logout,
        refreshSession,
        loadCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
