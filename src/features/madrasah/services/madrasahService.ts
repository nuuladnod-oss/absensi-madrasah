import { supabase } from '@/lib/supabaseClient';
import type { Madrasah } from './types';

export interface MadrasahListResult {
  data: Madrasah[] | null;
  error: string | null;
}

export interface MadrasahSingleResult {
  data: Madrasah | null;
  error: string | null;
}

export interface MadrasahMutationResult {
  success: boolean;
  error: string | null;
}

export const madrasahService = {
  async list(): Promise<MadrasahListResult> {
    const { data, error } = await supabase
      .from('madrasah')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return { data: null, error: error.message };
    }

    return { data: data as Madrasah[], error: null };
  },

  async getById(id: string): Promise<MadrasahSingleResult> {
    const { data, error } = await supabase
      .from('madrasah')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      return { data: null, error: error.message };
    }

    return { data: data as Madrasah | null, error: null };
  },

  async create(madrasah: Omit<Madrasah, 'id' | 'created_at' | 'updated_at'>): Promise<MadrasahMutationResult> {
    const { error } = await supabase
      .from('madrasah')
      .insert(madrasah);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  },

  async update(id: string, madrasah: Partial<Omit<Madrasah, 'id' | 'created_at' | 'updated_at'>>): Promise<MadrasahMutationResult> {
    const { error } = await supabase
      .from('madrasah')
      .update(madrasah)
      .eq('id', id);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  },

  async delete(id: string): Promise<MadrasahMutationResult> {
    const { error } = await supabase
      .from('madrasah')
      .delete()
      .eq('id', id);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  },
};