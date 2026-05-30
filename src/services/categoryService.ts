// =====================================================
// Category Service — Acesso ao Supabase (categorias)
// =====================================================

import { supabase } from '../lib/supabase';
import { Category, CategoryType } from '../types';

/**
 * Busca todas as categorias do usuário.
 */
export async function getCategories(type?: CategoryType): Promise<Category[]> {
  let query = supabase
    .from('categories')
    .select('*')
    .order('name', { ascending: true });

  if (type) {
    query = query.or(`type.eq.${type},type.eq.ambos`);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error('Erro ao buscar categorias.');
  }

  return (data as Category[]) || [];
}

/**
 * Cria uma nova categoria.
 */
export async function createCategory(category: {
  name: string;
  type: CategoryType;
  color: string;
}): Promise<Category> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Usuário não autenticado.');

  const { data, error } = await supabase
    .from('categories')
    .insert({
      ...category,
      user_id: user.id,
    })
    .select()
    .single();

  if (error) {
    throw new Error('Erro ao criar categoria.');
  }

  return data as Category;
}

/**
 * Atualiza uma categoria existente.
 */
export async function updateCategory(
  id: string,
  updates: {
    name?: string;
    type?: CategoryType;
    color?: string;
  }
): Promise<Category> {
  const { data, error } = await supabase
    .from('categories')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error('Erro ao atualizar categoria.');
  }

  return data as Category;
}

/**
 * Exclui uma categoria (verifica se não tem transações vinculadas).
 */
export async function deleteCategory(id: string): Promise<void> {
  // Verificar se há transações vinculadas
  const { count, error: countError } = await supabase
    .from('transactions')
    .select('id', { count: 'exact', head: true })
    .eq('category_id', id);

  if (countError) {
    throw new Error('Erro ao verificar transações vinculadas.');
  }

  if (count && count > 0) {
    throw new Error(
      `Não é possível excluir esta categoria. Existem ${count} conta(s) vinculada(s).`
    );
  }

  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error('Erro ao excluir categoria.');
  }
}
