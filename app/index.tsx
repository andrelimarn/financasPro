// =====================================================
// Index — Redirect baseado em auth
// =====================================================

import React, { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '../src/contexts/AuthContext';
import LoadingScreen from '../src/components/ui/LoadingScreen';

export default function Index() {
  const { session, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (session) {
        router.replace('/(tabs)/dashboard');
      } else {
        router.replace('/(auth)/login');
      }
    }
  }, [loading, session]);

  return <LoadingScreen />;
}
