// =====================================================
// Theme — Design System do App
// =====================================================

export const colors = {
  // Primary (Mint/Emerald fintech green)
  primary: '#00b46d',
  primaryDark: '#008a51',
  primaryLight: '#5cdbb5',

  // Status
  success: '#10b981',
  successDark: '#047857',
  successLight: '#34d399',
  danger: '#ef4444',
  dangerDark: '#dc2626',
  dangerLight: '#f87171',
  warning: '#f59e0b',
  warningDark: '#d97706',
  warningLight: '#fbbf24',

  // Backgrounds (Light Theme)
  background: '#f8fafc',
  surface: '#ffffff',
  surfaceLight: '#f1f5f9',
  surfaceLighter: '#e2e8f0',

  // Text
  text: '#0f172a',
  textSecondary: '#475569',
  textMuted: '#94a3b8',

  // Borders
  border: '#e2e8f0',
  borderLight: '#f1f5f9',

  // Misc
  white: '#ffffff',
  black: '#000000',
  transparent: 'transparent',

  // Gradients (arrays for LinearGradient)
  gradientPrimary: ['#00b46d', '#10b981'],
  gradientSuccess: ['#10b981', '#059669'],
  gradientDanger: ['#ef4444', '#f97316'],
  gradientWarning: ['#f59e0b', '#f97316'],
  gradientDark: ['#ffffff', '#f8fafc'],
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
};

export const fontSize = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  hero: 40,
};

export const fontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

export const shadows = {
  sm: {
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
  },
};

const theme = {
  colors,
  spacing,
  borderRadius,
  fontSize,
  fontWeight,
  shadows,
};

export default theme;
