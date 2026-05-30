// =====================================================
// Dashboard — Visão geral financeira
// =====================================================

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../src/contexts/AuthContext';
import SummaryCard from '../../src/components/ui/SummaryCard';
import TransactionCard from '../../src/components/TransactionCard';
import EmptyState from '../../src/components/EmptyState';
import { getDashboardSummary } from '../../src/services/transactionService';
import { formatCurrency, getMonthRange, getMonthName } from '../../src/utils/formatters';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../../src/theme';
import { DashboardSummary } from '../../src/types';

export default function DashboardScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [summary, setSummary] = useState<DashboardSummary | null>(null);

  // Mês/ano atual
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());

  const fetchData = useCallback(async () => {
    try {
      const { start, end } = getMonthRange(selectedYear, selectedMonth);
      const data = await getDashboardSummary(start, end);
      setSummary(data);
    } catch {
      // Erro silencioso - dados mostrarão como 0
      setSummary({
        total_pagar: 0,
        total_receber: 0,
        saldo: 0,
        contas_vencidas: 0,
        proximos_vencimentos: [],
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedMonth, selectedYear]);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchData();
    }, [fetchData])
  );

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const changeMonth = (delta: number) => {
    let newMonth = selectedMonth + delta;
    let newYear = selectedYear;
    if (newMonth > 12) {
      newMonth = 1;
      newYear++;
    } else if (newMonth < 1) {
      newMonth = 12;
      newYear--;
    }
    setSelectedMonth(newMonth);
    setSelectedYear(newYear);
  };

  const userName = user?.user_metadata?.full_name || 'Usuário';
  const firstName = userName.split(' ')[0];

  // Calcular alertas com base na data de hoje
  const todayStr = new Date().toISOString().split('T')[0];
  const overduePayableCount = summary?.contas_vencidas || 0;
  
  const dueTodayPayable = summary?.proximos_vencimentos?.filter(
    t => t.type === 'pagar' && t.status !== 'pago' && t.due_date === todayStr
  ).length || 0;
  
  const dueTodayReceivable = summary?.proximos_vencimentos?.filter(
    t => t.type === 'receber' && t.status !== 'pago' && t.due_date === todayStr
  ).length || 0;

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
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Olá, {firstName} 👋</Text>
            <Text style={styles.headerSubtitle}>Resumo financeiro do mês</Text>
          </View>
        </View>

        {/* Banner de Alertas */}
        {(overduePayableCount > 0 || dueTodayPayable > 0 || dueTodayReceivable > 0) && (
          <View style={styles.alertBannerContainer}>
            {overduePayableCount > 0 && (
              <View style={[styles.alertBanner, { backgroundColor: colors.danger + '10', borderColor: colors.danger + '30' }]}>
                <MaterialCommunityIcons name="alert-circle" size={20} color={colors.danger} />
                <Text style={[styles.alertText, { color: colors.danger }]}>
                  Atenção: Você tem <Text style={{ fontWeight: 'bold' }}>{overduePayableCount} despesa(s)</Text> vencida(s)!
                </Text>
              </View>
            )}
            
            {dueTodayPayable > 0 && (
              <View style={[styles.alertBanner, { backgroundColor: '#FF980010', borderColor: '#FF980030', marginTop: overduePayableCount > 0 ? spacing.sm : 0 }]}>
                <MaterialCommunityIcons name="clock-alert" size={20} color="#FF9800" />
                <Text style={[styles.alertText, { color: '#FF9800' }]}>
                  Atenção: Você tem <Text style={{ fontWeight: 'bold' }}>{dueTodayPayable} despesa(s)</Text> vencendo hoje!
                </Text>
              </View>
            )}
            
            {dueTodayReceivable > 0 && (
              <View style={[styles.alertBanner, { backgroundColor: colors.success + '10', borderColor: colors.success + '30', marginTop: (overduePayableCount > 0 || dueTodayPayable > 0) ? spacing.sm : 0 }]}>
                <MaterialCommunityIcons name="currency-usd" size={20} color={colors.success} />
                <Text style={[styles.alertText, { color: colors.success }]}>
                  Lembrete: Você tem <Text style={{ fontWeight: 'bold' }}>{dueTodayReceivable} receita(s)</Text> a receber hoje!
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Seletor de mês */}
        <View style={styles.monthSelector}>
          <TouchableOpacity
            onPress={() => changeMonth(-1)}
            style={styles.monthArrow}
            accessibilityRole="button"
            accessibilityLabel="Mês anterior"
          >
            <MaterialCommunityIcons name="chevron-left" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.monthText}>
            {getMonthName(selectedMonth)} {selectedYear}
          </Text>
          <TouchableOpacity
            onPress={() => changeMonth(1)}
            style={styles.monthArrow}
            accessibilityRole="button"
            accessibilityLabel="Próximo mês"
          >
            <MaterialCommunityIcons name="chevron-right" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* Cards de resumo */}
        <View style={styles.cardsRow}>
          <TouchableOpacity
            style={{ flex: 1 }}
            onPress={() => router.push('/(tabs)/receber')}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Ir para contas a receber"
          >
            <SummaryCard
              title="A Receber"
              value={formatCurrency(summary?.total_receber || 0)}
              icon="arrow-down-circle"
              color={colors.success}
            />
          </TouchableOpacity>
          <View style={{ width: spacing.md }} />
          <TouchableOpacity
            style={{ flex: 1 }}
            onPress={() => router.push('/(tabs)/pagar')}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Ir para contas a pagar"
          >
            <SummaryCard
              title="A Pagar"
              value={formatCurrency(summary?.total_pagar || 0)}
              icon="arrow-up-circle"
              color={colors.danger}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.cardsRow}>
          <View style={{ flex: 1 }}>
            <SummaryCard
              title="Saldo"
              value={formatCurrency(summary?.saldo || 0)}
              icon="scale-balance"
              color={(summary?.saldo || 0) >= 0 ? colors.success : colors.danger}
            />
          </View>
          <View style={{ width: spacing.md }} />
          <TouchableOpacity
            style={{ flex: 1 }}
            onPress={() => router.push('/(tabs)/pagar')}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Ver contas vencidas"
          >
            <SummaryCard
              title="Vencidas"
              value={String(summary?.contas_vencidas || 0)}
              icon="alert-circle"
              color={summary?.contas_vencidas ? colors.danger : colors.textMuted}
            />
          </TouchableOpacity>
        </View>

        {/* Ações rápidas */}
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={[styles.quickActionButton, { backgroundColor: colors.danger + '15' }]}
            onPress={() => router.push('/(tabs)/pagar/nova')}
            accessibilityRole="button"
            accessibilityLabel="Nova conta a pagar"
          >
            <MaterialCommunityIcons name="plus" size={20} color={colors.danger} />
            <Text style={[styles.quickActionText, { color: colors.danger }]}>Nova Despesa</Text>
          </TouchableOpacity>

          <View style={{ width: spacing.md }} />

          <TouchableOpacity
            style={[styles.quickActionButton, { backgroundColor: colors.success + '15' }]}
            onPress={() => router.push('/(tabs)/receber/nova')}
            accessibilityRole="button"
            accessibilityLabel="Nova conta a receber"
          >
            <MaterialCommunityIcons name="plus" size={20} color={colors.success} />
            <Text style={[styles.quickActionText, { color: colors.success }]}>Nova Receita</Text>
          </TouchableOpacity>
        </View>

        {/* Próximos vencimentos */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Próximos Vencimentos</Text>
        </View>

        {summary?.proximos_vencimentos && summary.proximos_vencimentos.length > 0 ? (
          summary.proximos_vencimentos.map((transaction) => (
            <TransactionCard
              key={transaction.id}
              transaction={transaction}
              onPress={() => {
                const tab = transaction.type === 'pagar' ? 'pagar' : 'receber';
                router.push(`/(tabs)/${tab}/${transaction.id}`);
              }}
            />
          ))
        ) : (
          <EmptyState
            icon="calendar-check"
            title="Nenhum vencimento próximo"
            subtitle="As contas pendentes do mês aparecerão aqui"
          />
        )}
      </ScrollView>
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
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
  greeting: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  monthSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  monthArrow: {
    padding: spacing.sm,
  },
  monthText: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.text,
    marginHorizontal: spacing.lg,
    minWidth: 140,
    textAlign: 'center',
  },
  cardsRow: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  quickActions: {
    flexDirection: 'row',
    marginTop: spacing.sm,
    marginBottom: spacing.xxl,
  },
  quickActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    gap: spacing.sm,
  },
  quickActionText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  alertBannerContainer: {
    marginBottom: spacing.lg,
  },
  alertBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    gap: spacing.sm,
  },
  alertText: {
    fontSize: fontSize.sm,
    flex: 1,
  },
});
