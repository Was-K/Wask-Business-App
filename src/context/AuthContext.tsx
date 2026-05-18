import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { authService, type RegisterPayload } from '../services/authService';
import { clearTokens, getAccessToken } from '../services/tokenStorage';
import type { User, UserRole } from '../types/api';

export type { User, UserRole };

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<User>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<boolean>;
  loadCurrentUser: () => Promise<User | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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

  // Bootstrap: if we have an access token, try to load /users/me.
  // If that fails, attempt one refresh then retry; finally bail out cleanly.
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
      return me!;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al iniciar sesión';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [loadCurrentUser]);

  const register = useCallback(async (payload: RegisterPayload): Promise<void> => {
    setError(null);
    setIsLoading(true);
    try {
      const result = await authService.register(payload);
      // If the backend issued tokens on register, load the user automatically.
      if (result && typeof result === 'object' && 'accessToken' in result) {
        await loadCurrentUser();
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al registrarse';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [loadCurrentUser]);

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
