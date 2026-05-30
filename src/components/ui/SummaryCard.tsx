// =====================================================
// Componente: SummaryCard — Card do dashboard
// =====================================================

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, borderRadius, spacing, fontSize, fontWeight, shadows } from '../../theme';

interface SummaryCardProps {
  title: string;
  value: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  color: string;
  bgColor?: string;
}

export default function SummaryCard({ title, value, icon, color, bgColor }: SummaryCardProps) {
  return (
    <View style={[styles.card, bgColor ? { backgroundColor: bgColor } : undefined]}>
      <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
        <MaterialCommunityIcons name={icon} size={24} color={color} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={[styles.value, { color }]} numberOfLines={1} adjustsFontSizeToFit={true}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.md,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  title: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    marginBottom: spacing.xs,
  },
  value: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
  },
});
