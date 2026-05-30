// =====================================================
// Auth Context — Gerenciamento de autenticação
// =====================================================

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Recuperar sessão existente
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setLoading(false);
    });

    // Escutar mudanças de auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (
    email: string,
    password: string,
    fullName: string
  ): Promise<{ error: string | null }> => {
    try {
      const { error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: { full_name: fullName.trim() },
        },
      });

      if (error) {
        if (error.message.includes('already registered')) {
          return { error: 'Este email já está cadastrado.' };
        }
        return { error: error.message };
      }

      return { error: null };
    } catch {
      return { error: 'Erro ao criar conta. Tente novamente.' };
    }
  };

  const signIn = async (
    email: string,
    password: string
  ): Promise<{ error: string | null }> => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          return { error: 'Email ou senha incorretos.' };
        }
        return { error: error.message };
      }

      return { error: null };
    } catch {
      return { error: 'Erro ao fazer login. Tente novamente.' };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    // Limpar estado do cliente ao fazer logout
    setSession(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ session, user, loading, signUp, signIn, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}
