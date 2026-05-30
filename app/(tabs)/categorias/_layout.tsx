// =====================================================
// Categorias Layout — Stack para sub-rotas
// =====================================================

import React from 'react';
import { Stack } from 'expo-router';
import { colors } from '../../../src/theme';

export default function CategoriasLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
        animation: 'slide_from_right',
      }}
    />
  );
}
