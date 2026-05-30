// =====================================================
// Tela: Lista de Categorias
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
import EmptyState from '../../../src/components/EmptyState';
import { getCategories, deleteCategory } from '../../../src/services/categoryService';
import { colors, spacing, borderRadius, fontSize, fontWeight, shadows } from '../../../src/theme';
import { Category } from '../../../src/types';
import { CATEGORY_TYPE_LABELS } from '../../../src/utils/constants';

export default function CategoriasListScreen() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch {
      setCategories([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchData();
    }, [fetchData])
  );

  const handleDelete = (category: Category) => {
    Alert.alert(
      'Excluir Categoria',
      `Tem certeza que deseja excluir "${category.name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteCategory(category.id);
              fetchData();
            } catch (err) {
              const message = err instanceof Error ? err.message : 'Erro ao excluir categoria.';
              Alert.alert('Erro', message);
            }
          },
        },
      ]
    );
  };

  const renderCategory = ({ item }: { item: Category }) => (
    <View style={styles.categoryCard}>
      <View style={styles.categoryRow}>
        <View style={[styles.colorIndicator, { backgroundColor: item.color }]} />
        <View style={styles.categoryInfo}>
          <Text style={styles.categoryName}>{item.name}</Text>
          <Text style={styles.categoryType}>
            {CATEGORY_TYPE_LABELS[item.type] || item.type}
          </Text>
        </View>
        <View style={styles.categoryActions}>
          <TouchableOpacity
            onPress={() => router.push({ pathname: '/(tabs)/categorias/nova', params: { editId: item.id, editName: item.name, editType: item.type, editColor: item.color } })}
            style={styles.actionButton}
            accessibilityRole="button"
            accessibilityLabel={`Editar categoria ${item.name}`}
          >
            <MaterialCommunityIcons name="pencil-outline" size={18} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleDelete(item)}
            style={styles.actionButton}
            accessibilityRole="button"
            accessibilityLabel={`Excluir categoria ${item.name}`}
          >
            <MaterialCommunityIcons name="delete-outline" size={18} color={colors.danger} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

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
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Categorias</Text>
      </View>

      <FlatList
        data={categories}
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
        renderItem={renderCategory}
        ListEmptyComponent={
          <EmptyState
            icon="tag-off-outline"
            title="Nenhuma categoria"
            subtitle="Categorias ajudam a organizar suas contas"
          />
        }
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/(tabs)/categorias/nova')}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel="Adicionar nova categoria"
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
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 100,
  },
  categoryCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
    overflow: 'hidden',
    ...shadows.sm,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorIndicator: {
    width: 4,
    height: '100%',
    minHeight: 56,
  },
  categoryInfo: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  categoryName: {
    color: colors.text,
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    marginBottom: 2,
  },
  categoryType: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
  },
  categoryActions: {
    flexDirection: 'row',
    paddingRight: spacing.md,
    gap: spacing.xs,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    right: spacing.xl,
    bottom: spacing.xl,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
});
