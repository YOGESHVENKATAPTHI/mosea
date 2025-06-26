import React, { createContext, useState, useEffect } from 'react';
import API from '../api';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('userData');
    if (stored) {
      const parsed = JSON.parse(stored);
      setUser(parsed.user);
      console.log('[AuthContext] Loaded user from localStorage:', parsed.user);
    }
  }, []);

  const login = async (username, password) => {
    setLoading(true);
    try {
      console.log('[AuthContext] Attempting login for', username);
      const { data } = await API.post('/auth/login', { username, password });
      setUser(data.user);
      localStorage.setItem('userData', JSON.stringify({ user: data.user, token: data.token }));
      console.log('[AuthContext] Login successful:', data.user);
      setLoading(false);
      return data;
    } catch (err) {
      console.error('[AuthContext] Login error:', err);
      setLoading(false);
      throw err;
    }
  };

  const signup = async (username, password) => {
    setLoading(true);
    try {
      console.log('[AuthContext] Attempting signup for', username);
      await API.post('/auth/signup', { username, password });
      // Auto-login after signup
      await login(username, password);
      setLoading(false);
    } catch (err) {
      console.error('[AuthContext] Signup error:', err);
      setLoading(false);
      throw err;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('userData');
    console.log('[AuthContext] User logged out');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}