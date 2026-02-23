import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import api from '../lib/api';
import { useNavigate } from 'react-router-dom';
import { ROLE_DASHBOARD_PATH } from '../lib/roles';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  organization: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    // Fallback to avoid runtime crash during HMR or initial loads when provider
    // might not be mounted yet. This returns a safe default with noop methods.
    console.warn('useAuth called outside AuthProvider - returning fallback');
    return {
      user: null,
      token: null,
      loading: true,
      // login should be awaited by callers; provide a function that rejects
      login: async () => { throw new Error('AuthProvider not initialized'); },
      logout: () => { }
    } as AuthContextType;
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for stored token on app load
    const storedToken = localStorage.getItem('bose_token');
    if (storedToken) {
      setToken(storedToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;

      // Verify token and get user info
      api.get(`${import.meta.env.VITE_API_URL || 'http://localhost:3002'}/api/auth/me`)
        .then(response => {
          setUser(response.data.user);
        })
        .catch(() => {
          // Token invalid, remove it
          localStorage.removeItem('bose_token');
          setToken(null);
          delete axios.defaults.headers.common['Authorization'];
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post(
        `${import.meta.env.VITE_API_URL || 'http://localhost:3002'}/api/auth/login`,
        { email, password }
      );

      const { token: jwtToken, user: loggedInUser } = response.data;

      setToken(jwtToken);
      setUser(loggedInUser);
      localStorage.setItem('bose_token', jwtToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${jwtToken}`;
      (api.defaults.headers as any) = (api.defaults.headers || {}) as any;
      (api.defaults.headers as any).common = (api.defaults.headers as any).common || {};
      (api.defaults.headers as any).common['Authorization'] = `Bearer ${jwtToken}`;
      const roleKey = (loggedInUser.role || '').toLowerCase() as keyof typeof ROLE_DASHBOARD_PATH;
      const path = ROLE_DASHBOARD_PATH[roleKey] || '/dashboard';
      navigate(path, { replace: true });
      return loggedInUser;
    } catch (error) {
      throw error as any;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('bose_token');
    delete axios.defaults.headers.common['Authorization'];
    if ((api.defaults.headers as any)?.common) {
      delete (api.defaults.headers as any).common['Authorization'];
    }
    navigate('/login', { replace: true });
  };

  const value = {
    user,
    token,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}