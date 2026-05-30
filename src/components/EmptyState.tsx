// =====================================================
// Componente: EmptyState — Estado vazio
// =====================================================

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, fontSize, fontWeight } from '../theme';

interface EmptyStateProps {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  title: string;
  subtitle?: string;
}

export default function EmptyState({ icon, title, subtitle }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <MaterialCommunityIcons name={icon} size={64} color={colors.textMuted} />
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xxxl * 2,
    paddingHorizontal: spacing.xxl,
  },
  title: {
    color: colors.textSecondary,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    marginTop: spacing.lg,
    textAlign: 'center',
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    marginTop: spacing.sm,
    textAlign: 'center',
    lineHeight: 20,
  },
});
