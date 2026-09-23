import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { authorizationService, type UserRole, type UserRoles } from '@/services/authorizationService';

export interface AuthorizationContextValue {
  userRoles: UserRoles | null;
  loading: boolean;
  hasRole: (role: UserRole) => boolean;
  hasAnyRole: (roles: UserRole[]) => boolean;
  canAccessAdmin: () => boolean;
  canAccessTeacher: () => boolean;
  canAccessHomeroom: () => boolean;
  canAccessStudent: () => boolean;
  canAccessHeadmaster: () => boolean;
  isHomeroomOf: (classId: string) => boolean;
  teachesClass: (classId: string) => boolean;
  refresh: () => Promise<void>;
}

/**
 * useAuthorization hook provides centralized role-based access control.
 * Uses useAuth to get the current user, then loads roles from authorizationService.
 * All checks are memoized and update when user roles change.
 */
export function useAuthorization(): AuthorizationContextValue {
  const { user, status, refresh: refreshAuth } = useAuth();
  const [userRoles, setUserRoles] = useState<UserRoles | null>(null);
  const [loading, setLoading] = useState(true);

  const loadRoles = useCallback(async () => {
    if (!user || status !== 'authenticated') {
      setUserRoles(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const roles = await authorizationService.loadUserRoles(user.id);
      setUserRoles(roles);
    } catch {
      setUserRoles({ roles: [], homeroomClassIds: [], taughtClassIds: [] });
    } finally {
      setLoading(false);
    }
  }, [user, status]);

  useEffect(() => {
    loadRoles();
  }, [loadRoles]);

  const hasRole = useCallback((role: UserRole): boolean => {
    return userRoles ? authorizationService.hasRole(userRoles, role) : false;
  }, [userRoles]);

  const hasAnyRole = useCallback((roles: UserRole[]): boolean => {
    return userRoles ? authorizationService.hasAnyRole(userRoles, roles) : false;
  }, [userRoles]);

  const canAccessAdmin = useCallback((): boolean => {
    return userRoles ? authorizationService.canAccessAdmin(userRoles) : false;
  }, [userRoles]);

  const canAccessTeacher = useCallback((): boolean => {
    return userRoles ? authorizationService.canAccessTeacher(userRoles) : false;
  }, [userRoles]);

  const canAccessHomeroom = useCallback((): boolean => {
    return userRoles ? authorizationService.canAccessHomeroom(userRoles) : false;
  }, [userRoles]);

  const canAccessStudent = useCallback((): boolean => {
    return userRoles ? authorizationService.canAccessStudent(userRoles) : false;
  }, [userRoles]);

  const canAccessHeadmaster = useCallback((): boolean => {
    return userRoles ? authorizationService.canAccessHeadmaster(userRoles) : false;
  }, [userRoles]);

  const isHomeroomOf = useCallback((classId: string): boolean => {
    return userRoles ? authorizationService.isHomeroomOf(userRoles, classId) : false;
  }, [userRoles]);

  const teachesClass = useCallback((classId: string): boolean => {
    return userRoles ? authorizationService.teachesClass(userRoles, classId) : false;
  }, [userRoles]);

  const refresh = useCallback(async () => {
    if (user) {
      authorizationService.invalidateCache(user.id);
    }
    await refreshAuth();
    await loadRoles();
  }, [user, refreshAuth, loadRoles]);

  return {
    userRoles,
    loading,
    hasRole,
    hasAnyRole,
    canAccessAdmin,
    canAccessTeacher,
    canAccessHomeroom,
    canAccessStudent,
    canAccessHeadmaster,
    isHomeroomOf,
    teachesClass,
    refresh,
  };
}

export default useAuthorization;