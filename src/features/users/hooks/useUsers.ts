import { useState, useCallback, useEffect } from 'react';
import { userService, type User, type Role, type UserFormData, type UserListResult, type UserSingleResult, type UserMutationResult, type RolesListResult } from './services/userService';

interface UseUsersReturn {
  users: User[];
  roles: Role[];
  loading: boolean;
  rolesLoading: boolean;
  error: string | null;
  selectedUser: User | null;
  fetchList: () => Promise<void>;
  fetchRoles: () => Promise<void>;
  fetchById: (id: string) => Promise<void>;
  create: (data: UserFormData) => Promise<UserMutationResult>;
  update: (id: string, data: Partial<UserFormData>) => Promise<UserMutationResult>;
  remove: (id: string) => Promise<UserMutationResult>;
  toggleActive: (id: string, isActive: boolean) => Promise<UserMutationResult>;
  clearSelection: () => void;
}

export function useUsers(): UseUsersReturn {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [rolesLoading, setRolesLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const fetchList = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result: UserListResult = await userService.list();
    if (result.error) {
      setError(result.error);
      setUsers([]);
    } else {
      setUsers(result.data ?? []);
    }
    setLoading(false);
  }, []);

  const fetchRoles = useCallback(async () => {
    setRolesLoading(true);
    const result: RolesListResult = await userService.listRoles();
    if (result.error) {
      setRoles([]);
    } else {
      setRoles(result.data ?? []);
    }
    setRolesLoading(false);
  }, []);

  const fetchById = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    const result: UserSingleResult = await userService.getById(id);
    if (result.error) {
      setError(result.error);
      setSelectedUser(null);
    } else {
      setSelectedUser(result.data);
    }
    setLoading(false);
  }, []);

  const create = useCallback(async (data: UserFormData): Promise<UserMutationResult> => {
    setLoading(true);
    setError(null);
    const result = await userService.create(data);
    if (result.error) {
      setError(result.error);
    } else {
      await fetchList();
    }
    setLoading(false);
    return result;
  }, [fetchList]);

  const update = useCallback(async (id: string, data: Partial<UserFormData>): Promise<UserMutationResult> => {
    setLoading(true);
    setError(null);
    const result = await userService.update(id, data);
    if (result.error) {
      setError(result.error);
    } else {
      await fetchList();
      if (selectedUser?.id === id) {
        const fresh = await userService.getById(id);
        setSelectedUser(fresh.data);
      }
    }
    setLoading(false);
    return result;
  }, [fetchList, selectedUser]);

  const remove = useCallback(async (id: string): Promise<UserMutationResult> => {
    setLoading(true);
    setError(null);
    const result = await userService.delete(id);
    if (result.error) {
      setError(result.error);
    } else {
      await fetchList();
      if (selectedUser?.id === id) {
        setSelectedUser(null);
      }
    }
    setLoading(false);
    return result;
  }, [fetchList, selectedUser]);

  const toggleActive = useCallback(async (id: string, isActive: boolean): Promise<UserMutationResult> => {
    setLoading(true);
    setError(null);
    const result = await userService.toggleActive(id, isActive);
    if (result.error) {
      setError(result.error);
    } else {
      await fetchList();
      if (selectedUser?.id === id) {
        const fresh = await userService.getById(id);
        setSelectedUser(fresh.data);
      }
    }
    setLoading(false);
    return result;
  }, [fetchList, selectedUser]);

  const clearSelection = useCallback(() => {
    setSelectedUser(null);
  }, []);

  useEffect(() => {
    fetchList();
    fetchRoles();
  }, [fetchList, fetchRoles]);

  return {
    users,
    roles,
    loading,
    rolesLoading,
    error,
    selectedUser,
    fetchList,
    fetchRoles,
    fetchById,
    create,
    update,
    remove,
    toggleActive,
    clearSelection,
  };
}