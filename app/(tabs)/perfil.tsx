// =====================================================
// Tela: Perfil do Usuário
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
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../src/contexts/AuthContext';
import { supabase } from '../../src/lib/supabase';
import { colors, spacing, borderRadius, fontSize, fontWeight, shadows } from '../../src/theme';
import { APP_NAME } from '../../src/utils/constants';
import { Profile } from '../../src/types';

export default function PerfilScreen() {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (!error && data) {
          setProfile(data as Profile);
          setFullName((data as Profile).full_name);
        }
      } catch {
        // Use fallback from auth metadata
        setFullName(user.user_metadata?.full_name || '');
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [user]);

  const handleSave = async () => {
    if (!fullName.trim()) {
      Alert.alert('Atenção', 'Informe seu nome.');
      return;
    }
    if (!user) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: fullName.trim(), updated_at: new Date().toISOString() })
        .eq('id', user.id);

      if (error) throw error;

      // Atualizar metadata do auth também
      await supabase.auth.updateUser({
        data: { full_name: fullName.trim() },
      });

      setIsEditing(false);
      Alert.alert('Sucesso', 'Perfil atualizado!');
    } catch {
      Alert.alert('Erro', 'Não foi possível atualizar o perfil.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Sair',
      'Tem certeza que deseja sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: signOut,
        },
      ]
    );
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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Perfil</Text>
        </View>

        {/* Avatar e nome */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>
              {(fullName || 'U').charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text style={styles.userName}>{fullName || 'Usuário'}</Text>
          <Text style={styles.userEmail}>{user?.email || ''}</Text>
        </View>

        {/* Card de informações */}
        <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <Text style={styles.infoTitle}>Informações Pessoais</Text>
            {!isEditing && (
              <TouchableOpacity
                onPress={() => setIsEditing(true)}
                accessibilityRole="button"
                accessibilityLabel="Editar perfil"
              >
                <MaterialCommunityIcons name="pencil-outline" size={20} color={colors.primary} />
              </TouchableOpacity>
            )}
          </View>

          {/* Nome */}
          <Text style={styles.fieldLabel}>Nome completo</Text>
          {isEditing ? (
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={fullName}
                onChangeText={setFullName}
                placeholder="Seu nome"
                placeholderTextColor={colors.textMuted}
                autoCapitalize="words"
                accessibilityLabel="Editar nome"
              />
            </View>
          ) : (
            <Text style={styles.fieldValue}>{fullName || '-'}</Text>
          )}

          {/* Email (somente leitura) */}
          <Text style={styles.fieldLabel}>Email</Text>
          <Text style={styles.fieldValue}>{user?.email || '-'}</Text>

          {/* Membro desde */}
          <Text style={styles.fieldLabel}>Membro desde</Text>
          <Text style={styles.fieldValue}>
            {profile?.created_at
              ? new Date(profile.created_at).toLocaleDateString('pt-BR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })
              : '-'}
          </Text>

          {/* Botões de edição */}
          {isEditing && (
            <View style={styles.editActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setFullName(profile?.full_name || '');
                  setIsEditing(false);
                }}
                accessibilityRole="button"
                accessibilityLabel="Cancelar edição"
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.saveButton, saving && { opacity: 0.7 }]}
                onPress={handleSave}
                disabled={saving}
                accessibilityRole="button"
                accessibilityLabel="Salvar alterações"
              >
                {saving ? (
                  <ActivityIndicator color={colors.white} size="small" />
                ) : (
                  <Text style={styles.saveButtonText}>Salvar</Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Botão Logout */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Sair da conta"
        >
          <MaterialCommunityIcons name="logout" size={20} color={colors.danger} />
          <Text style={styles.logoutButtonText}>Sair da Conta</Text>
        </TouchableOpacity>

        {/* Footer */}
        <Text style={styles.footer}>{APP_NAME} v1.0.0</Text>
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
    paddingBottom: spacing.xxxl * 2,
  },
  header: {
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  headerTitle: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  avatarSection: {
    alignItems: 'center',
    marginVertical: spacing.xxl,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
    borderWidth: 2,
    borderColor: colors.primary + '40',
  },
  avatarText: {
    fontSize: fontSize.xxxl,
    fontWeight: fontWeight.bold,
    color: colors.primary,
  },
  userName: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  userEmail: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  infoCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.xxl,
    ...shadows.sm,
  },
  infoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  infoTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  fieldLabel: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
    marginTop: spacing.lg,
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  fieldValue: {
    color: colors.text,
    fontSize: fontSize.md,
  },
  inputContainer: {
    backgroundColor: colors.surfaceLight,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    height: 44,
    justifyContent: 'center',
  },
  input: {
    color: colors.text,
    fontSize: fontSize.md,
  },
  editActions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.xl,
  },
  cancelButton: {
    flex: 1,
    height: 44,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: colors.textSecondary,
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
  },
  saveButton: {
    flex: 1,
    height: 44,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonText: {
    color: colors.white,
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    borderRadius: borderRadius.md,
    backgroundColor: colors.danger + '10',
    borderWidth: 1,
    borderColor: colors.danger + '30',
    gap: spacing.sm,
  },
  logoutButtonText: {
    color: colors.danger,
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
  },
  footer: {
    textAlign: 'center',
    color: colors.textMuted,
    fontSize: fontSize.xs,
    marginTop: spacing.xxl,
  },
});
