// =====================================================
// Utilidades de formatação
// =====================================================

/**
 * Formata um número como moeda brasileira (R$).
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

/**
 * Formata uma string de data ISO para o formato brasileiro.
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString + 'T00:00:00');
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

/**
 * Formata uma data por extenso (ex: "30 de maio de 2026").
 */
export function formatDateLong(dateString: string): string {
  const date = new Date(dateString + 'T00:00:00');
  return new Intl.DateTimeFormat('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

/**
 * Retorna a data atual no formato YYYY-MM-DD.
 */
export function getTodayISO(): string {
  const now = new Date();
  return now.toISOString().split('T')[0];
}

/**
 * Verifica se uma data está vencida (antes de hoje).
 */
export function isOverdue(dateString: string): boolean {
  const today = new Date(getTodayISO());
  const dueDate = new Date(dateString);
  return dueDate < today;
}

/**
 * Retorna o primeiro e último dia do mês/ano.
 */
export function getMonthRange(year: number, month: number): { start: string; end: string } {
  const start = `${year}-${String(month).padStart(2, '0')}-01`;
  const lastDay = new Date(year, month, 0).getDate();
  const end = `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
  return { start, end };
}

/**
 * Retorna o nome do mês em português.
 */
export function getMonthName(month: number): string {
  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
  ];
  return months[month - 1] || '';
}

/**
 * Converte string monetária "1.234,56" para number 1234.56.
 */
export function parseCurrencyInput(value: string): number {
  const cleaned = value.replace(/[R$\s.]/g, '').replace(',', '.');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}
