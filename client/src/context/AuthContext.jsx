import { createContext, useContext, useState, useEffect } from 'react';
import api, { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // Try to get the current user (works with cookie + bearer token)
      const response = await authAPI.getMe();
      const currentUser = response.data?.user || response.data?.data;
      setUser(currentUser || null);
    } catch (error) {
      // Clear bad/expired token if present
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const response = await authAPI.login({ email, password });
    const token = response.data?.token;
    if (token) localStorage.setItem('token', token);
    await checkAuth();
    return response.data;
  };

  const register = async (name, email, password, role) => {
    const response = await authAPI.register({ name, email, password, role });
    const token = response.data?.token;
    if (token) localStorage.setItem('token', token);
    await checkAuth();
    return response.data;
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
    localStorage.removeItem('token');
    setUser(null);
    // Best-effort clear of cached axios defaults
    try {
      if (api && api.defaults) {
        delete api.defaults.headers.common.Authorization;
      }
    } catch (e) {
      /* no-op */
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
