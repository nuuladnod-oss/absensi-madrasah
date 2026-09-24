import { useState, useCallback, useEffect } from 'react';
import { madrasahService, type MadrasahListResult, type MadrasahSingleResult, type MadrasahMutationResult } from '../services/madrasahService';
import type { Madrasah, MadrasahFormData } from './types';

interface UseMadrasahReturn {
  madrasahList: Madrasah[];
  loading: boolean;
  error: string | null;
  selectedMadrasah: Madrasah | null;
  fetchList: () => Promise<void>;
  fetchById: (id: string) => Promise<void>;
  create: (data: MadrasahFormData) => Promise<MadrasahMutationResult>;
  update: (id: string, data: Partial<MadrasahFormData>) => Promise<MadrasahMutationResult>;
  remove: (id: string) => Promise<MadrasahMutationResult>;
  clearSelection: () => void;
}

export function useMadrasah(): UseMadrasahReturn {
  const [madrasahList, setMadrasahList] = useState<Madrasah[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedMadrasah, setSelectedMadrasah] = useState<Madrasah | null>(null);

  const fetchList = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result: MadrasahListResult = await madrasahService.list();
    if (result.error) {
      setError(result.error);
      setMadrasahList([]);
    } else {
      setMadrasahList(result.data ?? []);
    }
    setLoading(false);
  }, []);

  const fetchById = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    const result: MadrasahSingleResult = await madrasahService.getById(id);
    if (result.error) {
      setError(result.error);
      setSelectedMadrasah(null);
    } else {
      setSelectedMadrasah(result.data);
    }
    setLoading(false);
  }, []);

  const create = useCallback(async (data: MadrasahFormData): Promise<MadrasahMutationResult> => {
    setLoading(true);
    setError(null);
    const result = await madrasahService.create(data);
    if (result.error) {
      setError(result.error);
    } else {
      await fetchList();
    }
    setLoading(false);
    return result;
  }, [fetchList]);

  const update = useCallback(async (id: string, data: Partial<MadrasahFormData>): Promise<MadrasahMutationResult> => {
    setLoading(true);
    setError(null);
    const result = await madrasahService.update(id, data);
    if (result.error) {
      setError(result.error);
    } else {
      await fetchList();
      if (selectedMadrasah?.id === id) {
        const fresh = await madrasahService.getById(id);
        setSelectedMadrasah(fresh.data);
      }
    }
    setLoading(false);
    return result;
  }, [fetchList, selectedMadrasah]);

  const remove = useCallback(async (id: string): Promise<MadrasahMutationResult> => {
    setLoading(true);
    setError(null);
    const result = await madrasahService.delete(id);
    if (result.error) {
      setError(result.error);
    } else {
      await fetchList();
      if (selectedMadrasah?.id === id) {
        setSelectedMadrasah(null);
      }
    }
    setLoading(false);
    return result;
  }, [fetchList, selectedMadrasah]);

  const clearSelection = useCallback(() => {
    setSelectedMadrasah(null);
  }, []);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  return {
    madrasahList,
    loading,
    error,
    selectedMadrasah,
    fetchList,
    fetchById,
    create,
    update,
    remove,
    clearSelection,
  };
}