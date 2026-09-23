import { supabase } from '@/lib/supabaseClient';

export type UserRole = 
  | 'ADMIN' 
  | 'GURU' 
  | 'WALI_KELAS' 
  | 'SISWA' 
  | 'KEPALA_MADRASAH';

export const ROLE_HIERARCHY: Record<UserRole, UserRole[]> = {
  ADMIN: ['ADMIN', 'GURU', 'WALI_KELAS', 'SISWA', 'KEPALA_MADRASAH'],
  GURU: ['GURU'],
  WALI_KELAS: ['WALI_KELAS'],
  SISWA: ['SISWA'],
  KEPALA_MADRASAH: ['KEPALA_MADRASAH'],
};

export interface UserRoles {
  roles: UserRole[];
  homeroomClassIds: string[];
  taughtClassIds: string[];
}

export interface ProfileWithRoles {
  id: string;
  fullName: string;
  email: string;
  isActive: boolean;
  roles: UserRole[];
  homeroomClassIds: string[];
  taughtClassIds: string[];
}

/**
 * AuthorizationService provides centralized role-based access control.
 * Multi-role: a user can have multiple roles (e.g., Guru + Wali Kelas).
 * Route guards use hasRole() / hasAnyRole() for access decisions.
 */
class AuthorizationService {
  private rolesCache: Map<string, UserRoles> = new Map();

  /**
   * Load roles for a user from the database.
   * Reads from user_roles table (RLS: user can read own roles, admin can read all).
   */
  async loadUserRoles(userId: string): Promise<UserRoles> {
    const cached = this.rolesCache.get(userId);
    if (cached) return cached;

    const { data: roleData, error: roleError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId);

    if (roleError || !roleData) {
      console.error('Failed to load user roles:', roleError);
      return { roles: [], homeroomClassIds: [], taughtClassIds: [] };
    }

    const roles = roleData.map(r => r.role as UserRole);

    // Load homeroom class IDs if user has WALI_KELAS role
    let homeroomClassIds: string[] = [];
    if (roles.includes('WALI_KELAS')) {
      const { data: homeroomData } = await supabase
        .from('classes')
        .select('id')
        .eq('homeroom_teacher_id', userId);
      homeroomClassIds = homeroomData?.map(c => c.id) ?? [];
    }

    // Load taught class IDs if user has GURU role
    let taughtClassIds: string[] = [];
    if (roles.includes('GURU')) {
      const { data: taughtData } = await supabase
        .from('class_subjects')
        .select('class_id')
        .eq('teacher_id', userId);
      taughtClassIds = [...new Set(taughtData?.map(c => c.class_id) ?? [])];
    }

    const userRoles: UserRoles = {
      roles,
      homeroomClassIds,
      taughtClassIds,
    };

    this.rolesCache.set(userId, userRoles);
    return userRoles;
  }

  /**
   * Check if user has a specific role.
   */
  hasRole(userRoles: UserRoles, role: UserRole): boolean {
    return userRoles.roles.includes(role);
  }

  /**
   * Check if user has any of the given roles.
   */
  hasAnyRole(userRoles: UserRoles, roles: UserRole[]): boolean {
    return roles.some(r => userRoles.roles.includes(r));
  }

  /**
   * Check if user can access admin routes.
   */
  canAccessAdmin(userRoles: UserRoles): boolean {
    return this.hasRole(userRoles, 'ADMIN');
  }

  /**
   * Check if user can access teacher routes.
   */
  canAccessTeacher(userRoles: UserRoles): boolean {
    return this.hasAnyRole(userRoles, ['GURU', 'ADMIN']);
  }

  /**
   * Check if user can access homeroom teacher routes.
   */
  canAccessHomeroom(userRoles: UserRoles): boolean {
    return this.hasAnyRole(userRoles, ['WALI_KELAS', 'ADMIN']);
  }

  /**
   * Check if user can access student routes.
   */
  canAccessStudent(userRoles: UserRoles): boolean {
    return this.hasAnyRole(userRoles, ['SISWA', 'ADMIN']);
  }

  /**
   * Check if user can access headmaster routes.
   */
  canAccessHeadmaster(userRoles: UserRoles): boolean {
    return this.hasAnyRole(userRoles, ['KEPALA_MADRASAH', 'ADMIN']);
  }

  /**
   * Check if user is homeroom teacher of a specific class.
   */
  isHomeroomOf(userRoles: UserRoles, classId: string): boolean {
    return this.hasRole(userRoles, 'WALI_KELAS') && userRoles.homeroomClassIds.includes(classId);
  }

  /**
   * Check if user teaches a specific class.
   */
  teachesClass(userRoles: UserRoles, classId: string): boolean {
    return this.hasRole(userRoles, 'GURU') && userRoles.taughtClassIds.includes(classId);
  }

  /**
   * Clear cache for a user (e.g., after role changes).
   */
  invalidateCache(userId: string): void {
    this.rolesCache.delete(userId);
  }

  /**
   * Clear all cache.
   */
  clearCache(): void {
    this.rolesCache.clear();
  }
}

export const authorizationService = new AuthorizationService();