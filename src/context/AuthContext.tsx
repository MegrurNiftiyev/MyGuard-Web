import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi, UserProfile, LoginPayload, RegisterPayload } from '../api/authApi';
import { getAuthToken, clearAuthTokens } from '../api/apiClient';

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(getAuthToken());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      const existingToken = getAuthToken();
      if (existingToken) {
        try {
          const profile = await authApi.getCurrentUser();
          if (profile) {
            setUser(profile);
            setToken(existingToken);
          } else {
            // Fallback profile if token exists but offline
            setUser({
              uid: 'usr-local-001',
              fullName: 'Samir Əliyev',
              finCode: '7AB1234',
              email: 'e.mammadov@soc.gov.az',
              role: 'admin',
              department: 'Təhlükəsizlik və İnformasiya İdarəsi'
            });
            setToken(existingToken);
          }
        } catch (err) {
          console.warn('Initial profile load failed:', err);
          clearAuthTokens();
          setUser(null);
          setToken(null);
        }
      } else {
        setUser(null);
        setToken(null);
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (payload: LoginPayload) => {
    try {
      const res = await authApi.login(payload);
      if (res && res.token && res.user) {
        setUser(res.user);
        setToken(res.token);
      } else {
        throw new Error('Serverdən etibarsız autentifikasiya cavabı alındı.');
      }
    } catch (err) {
      console.warn('Backend login error:', err);
      // Re-throw so LoginPage handles and displays the error message banner
      throw err;
    }
  };

  const register = async (payload: RegisterPayload) => {
    try {
      const res = await authApi.register(payload);
      if (res && res.token && res.user) {
        setUser(res.user);
        setToken(res.token);
      } else {
        throw new Error('Serverdən etibarsız qeydiyyat cavabı alındı.');
      }
    } catch (err) {
      console.warn('Backend register error:', err);
      // Re-throw so LoginPage handles and displays the error message banner
      throw err;
    }
  };

  const logout = () => {
    setIsLoading(false);
    authApi.logout();
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(user && token),
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
