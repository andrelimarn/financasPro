-- ============================================================
-- FinançasPro — Script de setup do banco de dados Supabase
-- ============================================================
-- Execute este script no SQL Editor do Supabase Dashboard:
-- https://supabase.com → Seu Projeto → SQL Editor → New Query
-- ============================================================

-- ==========================================
-- TABELA: profiles
-- Criada automaticamente via trigger ao signup
-- ==========================================
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Trigger para criar profile automaticamente no signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, email)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        NEW.email
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==========================================
-- TABELA: categories
-- ==========================================
CREATE TABLE public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('pagar', 'receber', 'ambos')),
    color TEXT DEFAULT '#6366f1',
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_categories_user_id ON public.categories(user_id);

-- ==========================================
-- TABELA: transactions (contas a pagar/receber)
-- ==========================================
CREATE TABLE public.transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    type TEXT NOT NULL CHECK (type IN ('pagar', 'receber')),
    description TEXT NOT NULL,
    amount DECIMAL(12,2) NOT NULL CHECK (amount > 0),
    due_date DATE NOT NULL,
    paid_date DATE,
    status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'pago', 'vencido')),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX idx_transactions_type ON public.transactions(type);
CREATE INDEX idx_transactions_status ON public.transactions(status);
CREATE INDEX idx_transactions_due_date ON public.transactions(due_date);

-- ==========================================
-- ROW LEVEL SECURITY (RLS)
-- Cada usuário só vê/manipula seus próprios dados
-- ==========================================

-- Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuarios veem apenas seu perfil"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Usuarios atualizam apenas seu perfil"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- Categories
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuarios veem suas categorias"
    ON public.categories FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Usuarios criam suas categorias"
    ON public.categories FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuarios atualizam suas categorias"
    ON public.categories FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Usuarios deletam suas categorias"
    ON public.categories FOR DELETE
    USING (auth.uid() = user_id);

-- Transactions
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuarios veem suas transacoes"
    ON public.transactions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Usuarios criam suas transacoes"
    ON public.transactions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuarios atualizam suas transacoes"
    ON public.transactions FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Usuarios deletam suas transacoes"
    ON public.transactions FOR DELETE
    USING (auth.uid() = user_id);

-- ==========================================
-- SEED: Categorias padrão para novos usuários
-- ==========================================
CREATE OR REPLACE FUNCTION public.seed_default_categories()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.categories (user_id, name, type, color) VALUES
        (NEW.id, 'Fornecedores', 'pagar', '#ef4444'),
        (NEW.id, 'Aluguel', 'pagar', '#f97316'),
        (NEW.id, 'Energia / Água', 'pagar', '#eab308'),
        (NEW.id, 'Internet / Telefone', 'pagar', '#84cc16'),
        (NEW.id, 'Impostos', 'pagar', '#dc2626'),
        (NEW.id, 'Vendas', 'receber', '#22c55e'),
        (NEW.id, 'Serviços', 'receber', '#3b82f6'),
        (NEW.id, 'Outros', 'ambos', '#8b5cf6');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_profile_created_seed_categories
    AFTER INSERT ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.seed_default_categories();
