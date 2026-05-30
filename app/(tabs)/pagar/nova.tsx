// =====================================================
// Tela: Nova Conta a Pagar
// =====================================================

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import TransactionForm from '../../../src/components/TransactionForm';
import { createTransaction } from '../../../src/services/transactionService';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../../../src/theme';

export default function NovaPagarScreen() {
  const router = useRouter();

  const handleSubmit = async (data: {
    description: string;
    amount: number;
    due_date: string;
    category_id?: string;
    notes?: string;
  }) => {
    await createTransaction({ ...data, type: 'pagar' });
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel="Voltar"
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nova Conta a Pagar</Text>
        <View style={{ width: 40 }} />
      </View>

      <TransactionForm
        type="pagar"
        onSubmit={handleSubmit}
        submitLabel="Salvar Conta"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  headerTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
});
