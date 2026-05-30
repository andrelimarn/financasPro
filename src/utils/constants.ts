// =====================================================
// Constantes do App
// =====================================================

export const APP_NAME = 'FinançasPro';

export const STATUS_LABELS: Record<string, string> = {
  pendente: 'Pendente',
  pago: 'Pago',
  vencido: 'Vencido',
};

export const STATUS_COLORS: Record<string, string> = {
  pendente: '#f59e0b',
  pago: '#22c55e',
  vencido: '#ef4444',
};

export const TYPE_LABELS: Record<string, string> = {
  pagar: 'A Pagar',
  receber: 'A Receber',
};

export const TYPE_ICONS: Record<string, string> = {
  pagar: 'arrow-up-circle',
  receber: 'arrow-down-circle',
};

export const CATEGORY_COLORS = [
  '#ef4444', '#f97316', '#f59e0b', '#eab308',
  '#84cc16', '#22c55e', '#10b981', '#14b8a6',
  '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1',
  '#8b5cf6', '#a855f7', '#d946ef', '#ec4899',
];

export const CATEGORY_TYPE_LABELS: Record<string, string> = {
  pagar: 'Despesa',
  receber: 'Receita',
  ambos: 'Ambos',
};
