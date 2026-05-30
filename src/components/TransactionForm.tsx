// =====================================================
// Componente: TransactionForm — Formulário reutilizável
// =====================================================

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { colors, spacing, borderRadius, fontSize, fontWeight, shadows } from '../theme';
import { getCategories } from '../services/categoryService';
import { Category, TransactionType } from '../types';
import { formatCurrency, parseCurrencyInput } from '../utils/formatters';

interface TransactionFormProps {
  type: TransactionType;
  initialData?: {
    description: string;
    amount: number;
    due_date: string;
    category_id: string | null;
    notes: string | null;
  };
  onSubmit: (data: {
    description: string;
    amount: number;
    due_date: string;
    category_id?: string;
    notes?: string;
  }) => Promise<void>;
  submitLabel: string;
}

export default function TransactionForm({
  type,
  initialData,
  onSubmit,
  submitLabel,
}: TransactionFormProps) {
  const [description, setDescription] = useState(initialData?.description || '');
  const formatInitialAmount = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const [amountText, setAmountText] = useState(
    initialData?.amount ? formatInitialAmount(initialData.amount) : ''
  );
  const [dueDate, setDueDate] = useState(
    initialData?.due_date ? new Date(initialData.due_date + 'T12:00:00') : new Date()
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [categoryId, setCategoryId] = useState(initialData?.category_id || '');
  const [notes, setNotes] = useState(initialData?.notes || '');
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getCategories(type);
        setCategories(data);
      } catch {
        // Categorias podem estar vazias
      } finally {
        setLoadingCategories(false);
      }
    };
    loadCategories();
  }, [type]);

  const handleAmountChange = (text: string) => {
    // Manter apenas dígitos numéricos
    const cleanDigits = text.replace(/\D/g, '');
    if (!cleanDigits) {
      setAmountText('');
      return;
    }
    
    const centsValue = parseInt(cleanDigits, 10);
    const floatValue = centsValue / 100;
    
    const formatted = new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(floatValue);
    
    setAmountText(formatted);
  };

  const handleSubmit = async () => {
    if (!description.trim()) {
      Alert.alert('Atenção', 'Informe uma descrição.');
      return;
    }

    const amount = parseCurrencyInput(amountText);
    if (amount <= 0) {
      Alert.alert('Atenção', 'Informe um valor válido.');
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        description: description.trim(),
        amount,
        due_date: dueDate.toISOString().split('T')[0],
        category_id: categoryId || undefined,
        notes: notes.trim() || undefined,
      });
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível salvar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const isPagar = type === 'pagar';

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {/* Descrição */}
      <Text style={styles.label}>Descrição *</Text>
      <View style={styles.inputContainer}>
        <MaterialCommunityIcons
          name="text-short"
          size={20}
          color={colors.textMuted}
          style={styles.inputIcon}
        />
        <TextInput
          style={styles.input}
          placeholder={isPagar ? 'Ex: Pagamento fornecedor' : 'Ex: Venda cliente João'}
          placeholderTextColor={colors.textMuted}
          value={description}
          onChangeText={setDescription}
          maxLength={100}
          accessibilityLabel="Descrição da conta"
        />
      </View>

      {/* Valor */}
      <Text style={styles.label}>Valor (R$) *</Text>
      <View style={styles.inputContainer}>
        <Text style={[styles.currencyPrefix, { color: isPagar ? colors.danger : colors.success }]}>
          R$
        </Text>
        <TextInput
          style={styles.input}
          placeholder="0,00"
          placeholderTextColor={colors.textMuted}
          value={amountText}
          onChangeText={handleAmountChange}
          keyboardType="decimal-pad"
          accessibilityLabel="Valor da conta"
        />
      </View>

      {/* Data de vencimento */}
      <Text style={styles.label}>Data de Vencimento *</Text>
      <TouchableOpacity
        style={styles.inputContainer}
        onPress={() => setShowDatePicker(true)}
        accessibilityRole="button"
        accessibilityLabel="Selecionar data de vencimento"
      >
        <MaterialCommunityIcons
          name="calendar"
          size={20}
          color={colors.textMuted}
          style={styles.inputIcon}
        />
        <Text style={styles.dateText}>
          {dueDate.toLocaleDateString('pt-BR')}
        </Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={dueDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(_, selectedDate) => {
            setShowDatePicker(Platform.OS === 'ios');
            if (selectedDate) setDueDate(selectedDate);
          }}
        />
      )}

      {/* Categoria */}
      <Text style={styles.label}>Categoria</Text>
      {loadingCategories ? (
        <ActivityIndicator color={colors.primary} style={{ marginVertical: spacing.md }} />
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesScroll}
        >
          <TouchableOpacity
            style={[
              styles.categoryChip,
              !categoryId && styles.categoryChipActive,
            ]}
            onPress={() => setCategoryId('')}
            accessibilityRole="button"
            accessibilityLabel="Sem categoria"
          >
            <Text
              style={[
                styles.categoryChipText,
                !categoryId && styles.categoryChipTextActive,
              ]}
            >
              Nenhuma
            </Text>
          </TouchableOpacity>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.categoryChip,
                categoryId === cat.id && {
                  backgroundColor: cat.color + '20',
                  borderColor: cat.color,
                },
              ]}
              onPress={() => setCategoryId(cat.id)}
              accessibilityRole="button"
              accessibilityLabel={`Categoria ${cat.name}`}
              accessibilityState={{ selected: categoryId === cat.id }}
            >
              <View style={[styles.categoryDot, { backgroundColor: cat.color }]} />
              <Text
                style={[
                  styles.categoryChipText,
                  categoryId === cat.id && { color: cat.color },
                ]}
              >
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Observações */}
      <Text style={styles.label}>Observações</Text>
      <View style={[styles.inputContainer, { height: 100, alignItems: 'flex-start' }]}>
        <TextInput
          style={[styles.input, { height: 80, textAlignVertical: 'top', paddingTop: spacing.md }]}
          placeholder="Anotações opcionais..."
          placeholderTextColor={colors.textMuted}
          value={notes}
          onChangeText={setNotes}
          multiline
          maxLength={500}
          accessibilityLabel="Observações"
        />
      </View>

      {/* Botão Salvar */}
      <TouchableOpacity
        style={[
          styles.submitButton,
          { backgroundColor: isPagar ? colors.danger : colors.success },
          loading && styles.submitButtonDisabled,
        ]}
        onPress={handleSubmit}
        disabled={loading}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel={submitLabel}
      >
        {loading ? (
          <ActivityIndicator color={colors.white} />
        ) : (
          <>
            <MaterialCommunityIcons name="check" size={20} color={colors.white} />
            <Text style={styles.submitButtonText}>{submitLabel}</Text>
          </>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxxl * 2,
  },
  label: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    marginBottom: spacing.sm,
    marginTop: spacing.lg,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    height: 52,
  },
  inputIcon: {
    marginRight: spacing.md,
  },
  input: {
    flex: 1,
    color: colors.text,
    fontSize: fontSize.md,
  },
  currencyPrefix: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    marginRight: spacing.md,
  },
  dateText: {
    color: colors.text,
    fontSize: fontSize.md,
  },
  categoriesScroll: {
    paddingRight: spacing.lg,
    flexDirection: 'row',
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryChipActive: {
    backgroundColor: colors.primary + '20',
    borderColor: colors.primary,
  },
  categoryChipText: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
  categoryChipTextActive: {
    color: colors.primary,
  },
  categoryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: spacing.sm,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    borderRadius: borderRadius.md,
    marginTop: spacing.xxl,
    gap: spacing.sm,
    ...shadows.md,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: colors.white,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
  },
});
