// =====================================================
// Tela de Cadastro
// =====================================================
// TODO(security): Implementar leaked password detection
// TODO(security): Considerar OAuth providers (Google)

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../../src/contexts/AuthContext';
import { colors, spacing, borderRadius, fontSize, fontWeight, shadows } from '../../src/theme';
import { APP_NAME } from '../../src/utils/constants';

const MIN_PASSWORD_LENGTH = 8;

export default function RegisterScreen() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const router = useRouter();

  const validateForm = (): string | null => {
    if (!fullName.trim()) return 'Informe seu nome completo.';
    if (!email.trim()) return 'Informe seu email.';
    if (!password) return 'Informe uma senha.';
    if (password.length < MIN_PASSWORD_LENGTH) {
      return `A senha deve ter no mínimo ${MIN_PASSWORD_LENGTH} caracteres.`;
    }
    if (password !== confirmPassword) return 'As senhas não coincidem.';
    return null;
  };

  const handleRegister = async () => {
    const validationError = validateForm();
    if (validationError) {
      Alert.alert('Atenção', validationError);
      return;
    }

    setLoading(true);
    const { error } = await signUp(email, password, fullName);
    setLoading(false);

    if (error) {
      Alert.alert('Erro', error);
    } else {
      Alert.alert(
        'Conta criada!',
        'Verifique seu email para confirmar o cadastro.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
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
          <Text style={styles.headerTitle}>Criar Conta</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Branding */}
        <View style={styles.brandContainer}>
          <Text style={styles.subtitle}>
            Comece a controlar suas finanças com o {APP_NAME}
          </Text>
        </View>

        {/* Form */}
        <View style={styles.formContainer}>
          {/* Nome */}
          <View style={styles.inputContainer}>
            <MaterialCommunityIcons
              name="account-outline"
              size={20}
              color={colors.textMuted}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Nome completo"
              placeholderTextColor={colors.textMuted}
              value={fullName}
              onChangeText={setFullName}
              autoCapitalize="words"
              accessibilityLabel="Campo de nome completo"
            />
          </View>

          {/* Email */}
          <View style={styles.inputContainer}>
            <MaterialCommunityIcons
              name="email-outline"
              size={20}
              color={colors.textMuted}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor={colors.textMuted}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              accessibilityLabel="Campo de email"
            />
          </View>

          {/* Senha */}
          <View style={styles.inputContainer}>
            <MaterialCommunityIcons
              name="lock-outline"
              size={20}
              color={colors.textMuted}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder={`Senha (mín. ${MIN_PASSWORD_LENGTH} caracteres)`}
              placeholderTextColor={colors.textMuted}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              accessibilityLabel="Campo de senha"
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              accessibilityRole="button"
              accessibilityLabel={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
            >
              <MaterialCommunityIcons
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color={colors.textMuted}
              />
            </TouchableOpacity>
          </View>

          {/* Confirmar Senha */}
          <View style={styles.inputContainer}>
            <MaterialCommunityIcons
              name="lock-check-outline"
              size={20}
              color={colors.textMuted}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Confirmar senha"
              placeholderTextColor={colors.textMuted}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showPassword}
              accessibilityLabel="Campo de confirmar senha"
            />
          </View>

          {/* Botão Cadastrar */}
          <TouchableOpacity
            style={[styles.registerButton, loading && styles.registerButtonDisabled]}
            onPress={handleRegister}
            disabled={loading}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Criar conta"
          >
            {loading ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={styles.registerButtonText}>Criar Conta</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Link para login */}
        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Já tem uma conta?</Text>
          <TouchableOpacity
            onPress={() => router.back()}
            accessibilityRole="link"
            accessibilityLabel="Voltar para login"
          >
            <Text style={styles.loginLink}> Fazer login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.xxxl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xxl,
    paddingTop: spacing.xl,
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
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  brandContainer: {
    marginBottom: spacing.xxl,
  },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  formContainer: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.xxl,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.lg,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceLight,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
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
  registerButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.sm,
    ...shadows.md,
  },
  registerButtonDisabled: {
    opacity: 0.7,
  },
  registerButtonText: {
    color: colors.white,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.xxl,
  },
  loginText: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
  },
  loginLink: {
    color: colors.primary,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
  },
});
