// =====================================================
// Tela de Login
// =====================================================

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

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert('Atenção', 'Preencha todos os campos.');
      return;
    }

    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);

    if (error) {
      Alert.alert('Erro', error);
    }
    // Se sucesso, o AuthContext redireciona automaticamente
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
        {/* Logo / Branding */}
        <View style={styles.brandContainer}>
          <View style={styles.logoContainer}>
            <MaterialCommunityIcons name="wallet-outline" size={48} color={colors.primary} />
          </View>
          <Text style={styles.appName}>{APP_NAME}</Text>
          <Text style={styles.tagline}>Controle financeiro para seu negócio</Text>
        </View>

        {/* Form */}
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Entrar na conta</Text>

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
              placeholder="Senha"
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

          {/* Botão Login */}
          <TouchableOpacity
            style={[styles.loginButton, loading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Fazer login"
          >
            {loading ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={styles.loginButtonText}>Entrar</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Link para cadastro */}
        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>Não tem uma conta?</Text>
          <TouchableOpacity
            onPress={() => router.push('/(auth)/register')}
            accessibilityRole="link"
            accessibilityLabel="Ir para cadastro"
          >
            <Text style={styles.registerLink}> Criar conta</Text>
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
    justifyContent: 'center',
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.xxxl,
  },
  brandContainer: {
    alignItems: 'center',
    marginBottom: spacing.xxxl * 1.5,
  },
  logoContainer: {
    width: 88,
    height: 88,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.primary + '30',
  },
  appName: {
    fontSize: fontSize.xxxl,
    fontWeight: fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  tagline: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  formContainer: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.xxl,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.lg,
  },
  formTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.xxl,
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
  loginButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.sm,
    ...shadows.md,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: colors.white,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.xxl,
  },
  registerText: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
  },
  registerLink: {
    color: colors.primary,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
  },
});
