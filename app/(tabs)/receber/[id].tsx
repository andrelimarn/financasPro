import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Platform,
  Modal,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import TransactionForm from '../../../src/components/TransactionForm';
import {
  getTransactionById,
  updateTransaction,
  deleteTransaction,
  markAsPaid,
} from '../../../src/services/transactionService';
import { colors, spacing, borderRadius, fontSize, fontWeight, shadows } from '../../../src/theme';
import { Transaction } from '../../../src/types';

export default function DetalhesReceberScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);
  const [showReceivedDatePicker, setShowReceivedDatePicker] = useState(false);
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [confirmDate, setConfirmDate] = useState(new Date());
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    const loadTransaction = async () => {
      if (!id) return;
      try {
        const data = await getTransactionById(id);
        setTransaction(data);
      } catch {
        Alert.alert('Erro', 'Conta não encontrada.');
        router.back();
      } finally {
        setLoading(false);
      }
    };
    loadTransaction();
  }, [id]);

  const handleSubmit = async (data: {
    description: string;
    amount: number;
    due_date: string;
    category_id?: string;
    notes?: string;
  }) => {
    if (!id) return;
    await updateTransaction(id, data);
    router.back();
  };

  const handleExecuteDelete = async () => {
    try {
      if (!id) return;
      setConfirming(true);
      await deleteTransaction(id);
      setIsDeleteModalVisible(false);
      router.back();
    } catch {
      Alert.alert('Erro', 'Não foi possível excluir.');
    } finally {
      setConfirming(false);
    }
  };

  const handleExecuteConfirm = async () => {
    try {
      if (!id) return;
      setConfirming(true);
      const formattedDate = confirmDate.toISOString().split('T')[0];
      await markAsPaid(id, formattedDate);
      setIsConfirmModalVisible(false);
      router.back();
    } catch {
      Alert.alert('Erro', 'Não foi possível atualizar a conta.');
    } finally {
      setConfirming(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!transaction) return null;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel="Voltar"
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Editar Receita</Text>
        <View style={styles.headerActions}>
          {transaction.status === 'pendente' && (
            <TouchableOpacity
              onPress={() => setIsConfirmModalVisible(true)}
              style={styles.headerActionButton}
              accessibilityRole="button"
              accessibilityLabel="Marcar como recebido"
            >
              <MaterialCommunityIcons name="check-circle" size={22} color={colors.success} />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={() => setIsDeleteModalVisible(true)}
            style={styles.headerActionButton}
            accessibilityRole="button"
            accessibilityLabel="Excluir conta"
          >
            <MaterialCommunityIcons name="delete-outline" size={22} color={colors.danger} />
          </TouchableOpacity>
        </View>
      </View>

      <TransactionForm
        type="receber"
        initialData={{
          description: transaction.description,
          amount: transaction.amount,
          due_date: transaction.due_date,
          category_id: transaction.category_id,
          notes: transaction.notes,
        }}
        onSubmit={handleSubmit}
        submitLabel="Atualizar Receita"
      />

      {/* DateTimePicker de Confirmação */}
      {showReceivedDatePicker && (
        <DateTimePicker
          value={confirmDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(_, selectedDate) => {
            setShowReceivedDatePicker(Platform.OS === 'ios');
            if (selectedDate) setConfirmDate(selectedDate);
          }}
        />
      )}

      {/* Modal Customizado: Confirmação de Recebimento */}
      <Modal
        visible={isConfirmModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsConfirmModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={[styles.modalIconContainer, { backgroundColor: colors.success + '15' }]}>
              <MaterialCommunityIcons name="check-circle" size={32} color={colors.success} />
            </View>
            <Text style={styles.modalTitle}>Confirmar Recebimento</Text>
            <Text style={styles.modalSubtitle}>Quando esta receita foi recebida?</Text>

            {/* Trigger do Calendário */}
            <TouchableOpacity
              style={styles.modalDatePickerTrigger}
              onPress={() => setShowReceivedDatePicker(true)}
              accessibilityRole="button"
              accessibilityLabel="Selecionar data de recebimento"
            >
              <MaterialCommunityIcons name="calendar" size={20} color={colors.primary} />
              <Text style={styles.modalDatePickerText}>
                {confirmDate.toLocaleDateString('pt-BR')}
              </Text>
            </TouchableOpacity>

            {/* Ações */}
            <View style={styles.modalButtonsRow}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={() => setIsConfirmModalVisible(false)}
                disabled={confirming}
              >
                <Text style={styles.modalButtonCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.success }]}
                onPress={handleExecuteConfirm}
                disabled={confirming}
              >
                {confirming ? (
                  <ActivityIndicator color={colors.white} />
                ) : (
                  <Text style={styles.modalButtonConfirmText}>Confirmar</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal Customizado: Confirmação de Exclusão */}
      <Modal
        visible={isDeleteModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsDeleteModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={[styles.modalIconContainer, { backgroundColor: colors.danger + '15' }]}>
              <MaterialCommunityIcons name="alert" size={32} color={colors.danger} />
            </View>
            <Text style={styles.modalTitle}>Excluir Receita</Text>
            <Text style={styles.modalSubtitle}>
              Tem certeza que deseja excluir esta receita? Esta ação é irreversível.
            </Text>

            {/* Ações */}
            <View style={styles.modalButtonsRow}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={() => setIsDeleteModalVisible(false)}
                disabled={confirming}
              >
                <Text style={styles.modalButtonCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.danger }]}
                onPress={handleExecuteDelete}
                disabled={confirming}
              >
                {confirming ? (
                  <ActivityIndicator color={colors.white} />
                ) : (
                  <Text style={styles.modalButtonConfirmText}>Excluir</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  headerActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  headerActionButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  modalContent: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    alignItems: 'center',
    ...shadows.lg,
  },
  modalIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  modalTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  modalDatePickerTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    width: '100%',
    padding: spacing.md,
    marginBottom: spacing.xl,
    gap: spacing.md,
  },
  modalDatePickerText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text,
  },
  modalButtonsRow: {
    flexDirection: 'row',
    width: '100%',
    gap: spacing.md,
  },
  modalButton: {
    flex: 1,
    height: 48,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalButtonCancel: {
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: colors.border,
  },
  modalButtonCancelText: {
    color: colors.textSecondary,
    fontWeight: fontWeight.semibold,
  },
  modalButtonConfirmText: {
    color: colors.white,
    fontWeight: fontWeight.bold,
  },
});
