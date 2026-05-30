// =====================================================
// Tabs Layout — Navegação principal com abas e Cabeçalho Fixo
// =====================================================

import React from 'react';
import { Tabs } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, fontSize, fontWeight, spacing, borderRadius, shadows } from '../../src/theme';

function AppHeader() {
  return (
    <SafeAreaView edges={['top']} style={styles.headerSafeArea}>
      <View style={styles.headerContainer}>
        <View style={styles.logoContainer}>
          <MaterialCommunityIcons name="wallet" size={22} color={colors.white} />
        </View>
        <Text style={styles.brandText}>
          Finanças<Text style={{ color: colors.primary }}>Pro</Text>
        </Text>
      </View>
    </SafeAreaView>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        header: () => <AppHeader />,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 4,
        },
        tabBarLabelStyle: {
          fontSize: fontSize.xs,
          fontWeight: fontWeight.medium,
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Início',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="view-dashboard-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="pagar"
        options={{
          title: 'A Pagar',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="arrow-up-circle-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="receber"
        options={{
          title: 'A Receber',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="arrow-down-circle-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="categorias"
        options={{
          title: 'Categorias',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="tag-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  headerSafeArea: {
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    ...shadows.sm,
  },
  headerContainer: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  logoContainer: {
    width: 34,
    height: 34,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandText: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.text,
    letterSpacing: -0.3,
  },
});
