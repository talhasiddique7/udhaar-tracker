// ✅ FILE: src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { supabase } from '../services/supabaseClient';
import { saveSession, getSession, clearSession } from '../storage/authStorage';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const savedUserId = await getSession();
      if (savedUserId) {
        const { data, error } = await supabase
          .from('auth')
          .select('*')
          .eq('id', savedUserId)
          .single();

        if (!error && data) {
          setUser(data);
        }
      }
      setLoading(false);
    })();
  }, []);

  const login = async (email, password) => {
    const cleanEmail = email.trim().toLowerCase();
    const isOnline = (await NetInfo.fetch()).isConnected;

    if (!isOnline) {
      // Offline fallback: match stored session ID
      const savedUserId = await getSession();
      if (savedUserId) {
        const { data, error } = await supabase
          .from('auth')
          .select('*')
          .eq('id', savedUserId)
          .eq('email', cleanEmail)
          .eq('password', password)
          .single();

        if (!error && data) {
          setUser(data);
          return { data };
        }
      }
      return { error: { message: 'No internet and no saved session found' } };
    }

    const { data, error } = await supabase
      .from('auth')
      .select('*')
      .eq('email', cleanEmail)
      .eq('password', password)
      .single();

    if (error || !data) {
      return { error: { message: 'Invalid email or password' } };
    }

    await saveSession(data.id);
    setUser(data);
    return { data };
  };

  const signup = async (name, email, password) => {
    const cleanEmail = email.trim().toLowerCase();
    const isOnline = (await NetInfo.fetch()).isConnected;

    if (!isOnline) {
      return { error: { message: 'No internet connection' } };
    }

    const { data: existing } = await supabase
      .from('auth')
      .select('*')
      .eq('email', cleanEmail)
      .single();

    if (existing) {
      return { error: { message: 'Email already registered' } };
    }

    const { data, error } = await supabase
      .from('auth')
      .insert({ name, email: cleanEmail, password })
      .select()
      .single();

    if (error) {
      return { error };
    }

    await saveSession(data.id);
    setUser(data);
    return { data };
  };

  const logout = async () => {
    await clearSession();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);