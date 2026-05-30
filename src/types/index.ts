// =====================================================
// Types — MVP Contas a Pagar e Receber
// =====================================================

export type TransactionType = 'pagar' | 'receber';
export type TransactionStatus = 'pendente' | 'pago' | 'vencido';
export type CategoryType = 'pagar' | 'receber' | 'ambos';

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  user_id: string;
  name: string;
  type: CategoryType;
  color: string;
  created_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  category_id: string | null;
  type: TransactionType;
  description: string;
  amount: number;
  due_date: string;
  paid_date: string | null;
  status: TransactionStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
  // Relação (join)
  category?: Category;
}

export interface DashboardSummary {
  total_pagar: number;
  total_receber: number;
  saldo: number;
  contas_vencidas: number;
  proximos_vencimentos: Transaction[];
}

// Form types
export interface TransactionFormData {
  description: string;
  amount: string;
  due_date: Date;
  category_id: string;
  notes: string;
}

export interface CategoryFormData {
  name: string;
  type: CategoryType;
  color: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  full_name: string;
  email: string;
  password: string;
  confirm_password: string;
}
