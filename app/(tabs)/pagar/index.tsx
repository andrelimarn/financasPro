// =====================================================
// Tela: Lista de Contas a Pagar
// =====================================================

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import TransactionCard from '../../../src/components/TransactionCard';
import EmptyState from '../../../src/components/EmptyState';
import { getTransactions, markAsPaid, deleteTransaction } from '../../../src/services/transactionService';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../../../src/theme';
import { Transaction, TransactionStatus } from '../../../src/types';

const FILTER_OPTIONS: { label: string; value: TransactionStatus | 'all' }[] = [
  { label: 'Todas', value: 'all' },
  { label: 'Pendentes', value: 'pendente' },
  { label: 'Pagas', value: 'pago' },
  { label: 'Vencidas', value: 'vencido' },
];

export default function PagarListScreen() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<TransactionStatus | 'all'>('all');

  const fetchData = useCallback(async () => {
    try {
      const data = await getTransactions({
        type: 'pagar',
        status: filter === 'all' ? undefined : filter,
      });
      setTransactions(data);
    } catch {
      setTransactions([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [filter]);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchData();
    }, [fetchData])
  );

  const handleMarkPaid = async (id: string) => {
    Alert.alert(
      'Confirmar',
      'Marcar esta conta como paga?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: async () => {
            try {
              await markAsPaid(id);
              fetchData();
            } catch {
              Alert.alert('Erro', 'Não foi possível atualizar a conta.');
            }
          },
        },
      ]
    );
  };

  const handleDelete = async (id: string) => {
    Alert.alert(
      'Excluir',
      'Tem certeza que deseja excluir esta conta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteTransaction(id);
              fetchData();
            } catch {
              Alert.alert('Erro', 'Não foi possível excluir a conta.');
            }
          },
        },
      ]
    );
  };

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Contas a Pagar</Text>
      </View>

      {/* Filtros */}
      <View style={styles.filtersContainer}>
        {FILTER_OPTIONS.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.filterChip,
              filter === option.value && styles.filterChipActive,
            ]}
            onPress={() => setFilter(option.value)}
            accessibilityRole="button"
            accessibilityLabel={`Filtrar por ${option.label}`}
            accessibilityState={{ selected: filter === option.value }}
          >
            <Text
              style={[
                styles.filterChipText,
                filter === option.value && styles.filterChipTextActive,
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Lista */}
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              fetchData();
            }}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        renderItem={({ item }) => (
          <TransactionCard
            transaction={item}
            onPress={() => router.push(`/(tabs)/pagar/${item.id}`)}
            onMarkPaid={() => handleMarkPaid(item.id)}
          />
        )}
        ListEmptyComponent={
          <EmptyState
            icon="cash-remove"
            title="Nenhuma conta a pagar"
            subtitle="Toque no + para adicionar sua primeira conta"
          />
        }
        showsVerticalScrollIndicator={false}
      />

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/(tabs)/pagar/nova')}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel="Adicionar nova conta a pagar"
      >
        <MaterialCommunityIcons name="plus" size={28} color={colors.white} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  headerTitle: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  filtersContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  filterChip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChipActive: {
    backgroundColor: colors.primary + '20',
    borderColor: colors.primary,
  },
  filterChipText: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
  filterChipTextActive: {
    color: colors.primary,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 100,
  },
  fab: {
    position: 'absolute',
    right: spacing.xl,
    bottom: spacing.xl,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.danger,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: colors.danger,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
});
