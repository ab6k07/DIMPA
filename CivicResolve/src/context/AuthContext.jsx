import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setTokenState] = useState(api.getToken());
  const [loading, setLoading] = useState(true);

  // Restore authenticated session on initial load
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = api.getToken();
      if (!storedToken) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const userData = await api.getMe();
        setUser(userData);
        setTokenState(storedToken);
      } catch (err) {
        console.warn('Session expired or invalid token:', err.message);
        api.clearToken();
        setUser(null);
        setTokenState(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    const res = await api.login({ email, password });
    setUser(res.user);
    setTokenState(res.access_token);
    return res.user;
  };

  const register = async (userData) => {
    const res = await api.register(userData);
    setUser(res.user);
    setTokenState(res.access_token);
    return res.user;
  };

  const logout = async () => {
    await api.logout();
    setUser(null);
    setTokenState(null);
  };

  const refreshUser = async () => {
    try {
      const updated = await api.getMe();
      setUser(updated);
      return updated;
    } catch {
      return null;
    }
  };

  const value = {
    user,
    token,
    isAuthenticated: !!user,
    loading,
    login,
    register,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
