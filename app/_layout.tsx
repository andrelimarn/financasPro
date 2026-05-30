// =====================================================
// Layout Raiz — AuthProvider + routing global
// =====================================================

import React, { useEffect } from 'react';
import { Slot, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, useAuth } from '../src/contexts/AuthContext';

function InitialLayout() {
  const { session, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    // Verifica se o usuário está em um grupo de rotas específico
    const inAuthGroup = segments[0] === '(auth)';

    if (session) {
      // Se logado e estiver na tela de login/cadastro, manda para o dashboard
      if (inAuthGroup || !segments[0] || segments[0] === 'index') {
        router.replace('/(tabs)/dashboard');
      }
    } else {
      // Se não estiver logado e não estiver nas telas de auth, força login
      if (!inAuthGroup) {
        router.replace('/(auth)/login');
      }
    }
  }, [session, loading, segments]);

  return <Slot />;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <StatusBar style="light" />
      <InitialLayout />
    </AuthProvider>
  );
}
