// =====================================================
// Tela: Nova / Editar Categoria
// =====================================================

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createCategory, updateCategory } from '../../../src/services/categoryService';
import { colors, spacing, borderRadius, fontSize, fontWeight, shadows } from '../../../src/theme';
import { CategoryType } from '../../../src/types';
import { CATEGORY_COLORS, CATEGORY_TYPE_LABELS } from '../../../src/utils/constants';

const TYPE_OPTIONS: { label: string; value: CategoryType }[] = [
  { label: 'Despesa (A Pagar)', value: 'pagar' },
  { label: 'Receita (A Receber)', value: 'receber' },
  { label: 'Ambos', value: 'ambos' },
];

export default function NovaCategoriaScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    editId?: string;
    editName?: string;
    editType?: string;
    editColor?: string;
  }>();

  const isEditing = !!params.editId;

  const [name, setName] = useState(params.editName || '');
  const [type, setType] = useState<CategoryType>((params.editType as CategoryType) || 'ambos');
  const [selectedColor, setSelectedColor] = useState(params.editColor || CATEGORY_COLORS[0]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim()) {
      Alert.alert('Atenção', 'Informe o nome da categoria.');
      return;
    }

    setLoading(true);
    try {
      if (isEditing && params.editId) {
        await updateCategory(params.editId, {
          name: name.trim(),
          type,
          color: selectedColor,
        });
      } else {
        await createCategory({
          name: name.trim(),
          type,
          color: selectedColor,
        });
      }
      router.back();
    } catch {
      Alert.alert('Erro', 'Não foi possível salvar a categoria.');
    } finally {
      setLoading(false);
    }
  };

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
        <Text style={styles.headerTitle}>
          {isEditing ? 'Editar Categoria' : 'Nova Categoria'}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Preview */}
        <View style={styles.previewContainer}>
          <View style={[styles.previewCard, { borderLeftColor: selectedColor, borderLeftWidth: 4 }]}>
            <View style={[styles.previewDot, { backgroundColor: selectedColor }]} />
            <Text style={styles.previewName}>{name || 'Nome da categoria'}</Text>
            <Text style={[styles.previewType, { color: selectedColor }]}>
              {CATEGORY_TYPE_LABELS[type]}
            </Text>
          </View>
        </View>

        {/* Nome */}
        <Text style={styles.label}>Nome *</Text>
        <View style={styles.inputContainer}>
          <MaterialCommunityIcons
            name="tag-outline"
            size={20}
            color={colors.textMuted}
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            placeholder="Ex: Fornecedores, Vendas..."
            placeholderTextColor={colors.textMuted}
            value={name}
            onChangeText={setName}
            maxLength={50}
            accessibilityLabel="Nome da categoria"
          />
        </View>

        {/* Tipo */}
        <Text style={styles.label}>Tipo *</Text>
        <View style={styles.typeOptions}>
          {TYPE_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.typeChip,
                type === option.value && styles.typeChipActive,
              ]}
              onPress={() => setType(option.value)}
              accessibilityRole="button"
              accessibilityLabel={`Tipo ${option.label}`}
              accessibilityState={{ selected: type === option.value }}
            >
              <Text
                style={[
                  styles.typeChipText,
                  type === option.value && styles.typeChipTextActive,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Cor */}
        <Text style={styles.label}>Cor</Text>
        <View style={styles.colorsGrid}>
          {CATEGORY_COLORS.map((color) => (
            <TouchableOpacity
              key={color}
              style={[
                styles.colorCircle,
                { backgroundColor: color },
                selectedColor === color && styles.colorCircleActive,
              ]}
              onPress={() => setSelectedColor(color)}
              accessibilityRole="button"
              accessibilityLabel={`Cor ${color}`}
              accessibilityState={{ selected: selectedColor === color }}
            >
              {selectedColor === color && (
                <MaterialCommunityIcons name="check" size={18} color={colors.white} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Botão Salvar */}
        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel={isEditing ? 'Atualizar categoria' : 'Criar categoria'}
        >
          {loading ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <>
              <MaterialCommunityIcons name="check" size={20} color={colors.white} />
              <Text style={styles.submitButtonText}>
                {isEditing ? 'Atualizar' : 'Criar Categoria'}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
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
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxxl * 2,
  },
  previewContainer: {
    marginBottom: spacing.lg,
  },
  previewCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  previewDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: spacing.md,
  },
  previewName: {
    flex: 1,
    color: colors.text,
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
  },
  previewType: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
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
  typeOptions: {
    gap: spacing.sm,
  },
  typeChip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  typeChipActive: {
    backgroundColor: colors.primary + '20',
    borderColor: colors.primary,
  },
  typeChipText: {
    color: colors.textSecondary,
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
  },
  typeChipTextActive: {
    color: colors.primary,
    fontWeight: fontWeight.bold,
  },
  colorsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  colorCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorCircleActive: {
    borderWidth: 3,
    borderColor: colors.white,
    ...shadows.md,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary,
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
