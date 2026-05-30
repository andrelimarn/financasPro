// =====================================================
// Transaction Service — Acesso ao Supabase (contas)
// =====================================================

import { supabase } from '../lib/supabase';
import { Transaction, TransactionType, TransactionStatus } from '../types';

/**
 * Busca transações do usuário com filtros opcionais.
 */
export async function getTransactions(params: {
  type?: TransactionType;
  status?: TransactionStatus;
  startDate?: string;
  endDate?: string;
  limit?: number;
}): Promise<Transaction[]> {
  let query = supabase
    .from('transactions')
    .select('*, category:categories(*)')
    .order('due_date', { ascending: true });

  if (params.type) {
    query = query.eq('type', params.type);
  }
  if (params.status) {
    query = query.eq('status', params.status);
  }
  if (params.startDate) {
    query = query.gte('due_date', params.startDate);
  }
  if (params.endDate) {
    query = query.lte('due_date', params.endDate);
  }
  if (params.limit) {
    query = query.limit(params.limit);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error('Erro ao buscar transações.');
  }

  return (data as Transaction[]) || [];
}

/**
 * Busca uma transação por ID.
 */
export async function getTransactionById(id: string): Promise<Transaction | null> {
  const { data, error } = await supabase
    .from('transactions')
    .select('*, category:categories(*)')
    .eq('id', id)
    .single();

  if (error) {
    throw new Error('Erro ao buscar transação.');
  }

  return data as Transaction;
}

/**
 * Cria uma nova transação.
 */
export async function createTransaction(transaction: {
  type: TransactionType;
  description: string;
  amount: number;
  due_date: string;
  category_id?: string;
  notes?: string;
}): Promise<Transaction> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Usuário não autenticado.');

  const { data, error } = await supabase
    .from('transactions')
    .insert({
      ...transaction,
      user_id: user.id,
      status: 'pendente',
    })
    .select('*, category:categories(*)')
    .single();

  if (error) {
    throw new Error('Erro ao criar transação.');
  }

  return data as Transaction;
}

/**
 * Atualiza uma transação existente.
 */
export async function updateTransaction(
  id: string,
  updates: {
    description?: string;
    amount?: number;
    due_date?: string;
    category_id?: string | null;
    notes?: string | null;
    status?: TransactionStatus;
    paid_date?: string | null;
  }
): Promise<Transaction> {
  const { data, error } = await supabase
    .from('transactions')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select('*, category:categories(*)')
    .single();

  if (error) {
    throw new Error('Erro ao atualizar transação.');
  }

  return data as Transaction;
}

/**
 * Marca transação como paga/recebida.
 */
export async function markAsPaid(id: string, paidDate?: string): Promise<Transaction> {
  const date = paidDate || new Date().toISOString().split('T')[0];
  return updateTransaction(id, {
    status: 'pago',
    paid_date: date,
  });
}

/**
 * Exclui uma transação.
 */
export async function deleteTransaction(id: string): Promise<void> {
  const { error } = await supabase
    .from('transactions')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error('Erro ao excluir transação.');
  }
}

/**
 * Busca resumo do dashboard para um período.
 */
export async function getDashboardSummary(startDate: string, endDate: string) {
  // Buscar todas as transações do período
  const { data, error } = await supabase
    .from('transactions')
    .select('*, category:categories(*)')
    .gte('due_date', startDate)
    .lte('due_date', endDate);

  if (error) {
    throw new Error('Erro ao buscar resumo.');
  }

  const transactions = (data as Transaction[]) || [];

  const total_pagar = transactions
    .filter((t) => t.type === 'pagar' && t.status === 'pendente')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const total_receber = transactions
    .filter((t) => t.type === 'receber' && t.status === 'pendente')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const today = new Date().toISOString().split('T')[0];
  const contas_vencidas = transactions.filter(
    (t) => t.status === 'pendente' && t.due_date < today
  ).length;

  const proximos_vencimentos = transactions
    .filter((t) => t.status === 'pendente' && t.due_date >= today)
    .sort((a, b) => a.due_date.localeCompare(b.due_date))
    .slice(0, 5);

  return {
    total_pagar,
    total_receber,
    saldo: total_receber - total_pagar,
    contas_vencidas,
    proximos_vencimentos,
  };
}
