// =====================================================
// Componente: TransactionCard — Card de conta
// =====================================================

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, borderRadius, spacing, fontSize, fontWeight, shadows } from '../theme';
import { Transaction } from '../types';
import { formatCurrency, formatDate } from '../utils/formatters';
import { STATUS_COLORS, STATUS_LABELS } from '../utils/constants';

interface TransactionCardProps {
  transaction: Transaction;
  onPress: () => void;
  onMarkPaid?: () => void;
}

export default function TransactionCard({ transaction, onPress, onMarkPaid }: TransactionCardProps) {
  const isPagar = transaction.type === 'pagar';
  const statusColor = STATUS_COLORS[transaction.status];
  const categoryColor = transaction.category?.color || colors.textMuted;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={`${transaction.description}, ${formatCurrency(transaction.amount)}, ${STATUS_LABELS[transaction.status]}`}
    >
      <View style={styles.row}>
        {/* Indicador de cor da categoria */}
        <View style={[styles.categoryIndicator, { backgroundColor: categoryColor }]} />

        <View style={styles.content}>
          <View style={styles.topRow}>
            <Text style={styles.description} numberOfLines={1}>
              {transaction.description}
            </Text>
            <Text style={[styles.amount, { color: isPagar ? colors.danger : colors.success }]}>
              {isPagar ? '- ' : '+ '}
              {formatCurrency(transaction.amount)}
            </Text>
          </View>

          <View style={styles.bottomRow}>
            <View style={styles.infoGroup}>
              <MaterialCommunityIcons
                name="calendar-outline"
                size={14}
                color={colors.textMuted}
              />
              <Text style={styles.dateText}>{formatDate(transaction.due_date)}</Text>

              {transaction.category && (
                <>
                  <View style={styles.dot} />
                  <Text style={[styles.categoryText, { color: categoryColor }]}>
                    {transaction.category.name}
                  </Text>
                </>
              )}
            </View>

            <View style={styles.statusRow}>
              {/* Badge de status */}
              <View style={[styles.statusBadge, { backgroundColor: statusColor + '20' }]}>
                <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
                <Text style={[styles.statusText, { color: statusColor }]}>
                  {STATUS_LABELS[transaction.status]}
                </Text>
              </View>

              {/* Botão marcar como pago */}
              {transaction.status === 'pendente' && onMarkPaid && (
                <TouchableOpacity
                  style={styles.paidButton}
                  onPress={(e) => {
                    e.stopPropagation();
                    onMarkPaid();
                  }}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  accessibilityRole="button"
                  accessibilityLabel={isPagar ? 'Marcar como pago' : 'Marcar como recebido'}
                >
                  <MaterialCommunityIcons
                    name="check-circle-outline"
                    size={22}
                    color={colors.success}
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
    overflow: 'hidden',
    ...shadows.sm,
  },
  row: {
    flexDirection: 'row',
  },
  categoryIndicator: {
    width: 4,
    borderTopLeftRadius: borderRadius.md,
    borderBottomLeftRadius: borderRadius.md,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  description: {
    flex: 1,
    color: colors.text,
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    marginRight: spacing.sm,
  },
  amount: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  dateText: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    marginLeft: 4,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.textMuted,
    marginHorizontal: spacing.sm,
  },
  categoryText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  statusText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
  },
  paidButton: {
    padding: 2,
  },
});
