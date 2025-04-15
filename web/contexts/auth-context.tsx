"use client"

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

interface User {
  id: string;
  username: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Check for token in cookies on initial load
  useEffect(() => {
    const storedToken = Cookies.get('auth_token');
    if (storedToken) {
      setToken(storedToken);
      // Parse the JWT to get user info
      try {
        const payload = JSON.parse(atob(storedToken.split('.')[1]));
        setUser(payload.user);
      } catch (err) {
        console.error('Error parsing token:', err);
        Cookies.remove('auth_token');
        localStorage.removeItem('auth_token'); // Remove from localStorage too for backward compatibility
      }
    } else {
      // Check localStorage as fallback (for backward compatibility)
      const localToken = localStorage.getItem('auth_token');
      if (localToken) {
        setToken(localToken);
        // Parse the JWT to get user info
        try {
          const payload = JSON.parse(atob(localToken.split('.')[1]));
          setUser(payload.user);
          // Move token to cookie
          Cookies.set('auth_token', localToken, { expires: 7, secure: process.env.NODE_ENV === 'production' });
        } catch (err) {
          console.error('Error parsing token from localStorage:', err);
          localStorage.removeItem('auth_token');
        }
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Login failed');
      }

      // Save token to cookie (and localStorage for backward compatibility)
      Cookies.set('auth_token', data.token, { expires: 7, secure: process.env.NODE_ENV === 'production' });
      localStorage.setItem('auth_token', data.token);
      setToken(data.token);

      // Parse the JWT to get user info
      const payload = JSON.parse(atob(data.token.split('.')[1]));
      setUser(payload.user);

      // Redirect to home page after successful login
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // Remove token from both cookie and localStorage
    Cookies.remove('auth_token');
    localStorage.removeItem('auth_token');
    setToken(null);
    setUser(null);

    // Redirect to login page
    router.push('/login');
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token,
    isLoading,
    login,
    logout,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
