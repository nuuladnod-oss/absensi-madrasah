export type UserRoleCode = 'ADMIN' | 'GURU' | 'WALI_KELAS' | 'SISWA' | 'KEPALA_MADRASAH';

export interface Role {
  id: string;
  code: UserRoleCode;
  name: string;
  description: string | null;
}

export interface User {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  roles: Role[];
}

export interface UserFormData {
  email: string;
  full_name: string;
  password?: string;
  phone?: string;
  is_active: boolean;
  role_ids: string[];
}

export interface UserListResult {
  data: User[] | null;
  error: string | null;
}

export interface UserSingleResult {
  data: User | null;
  error: string | null;
}

export interface UserMutationResult {
  success: boolean;
  error: string | null;
}

export interface RolesListResult {
  data: Role[] | null;
  error: string | null;
}

export const validateUserForm = (data: UserFormData, isEdit: boolean = false): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (!data.email.trim()) {
    errors.email = 'Email wajib diisi';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Format email tidak valid';
  }

  if (!data.full_name.trim()) {
    errors.full_name = 'Nama lengkap wajib diisi';
  }

  if (!isEdit && !data.password) {
    errors.password = 'Kata sandi wajib diisi untuk user baru';
  } else if (data.password && data.password.length < 6) {
    errors.password = 'Kata sandi minimal 6 karakter';
  }

  if (data.role_ids.length === 0) {
    errors.role_ids = 'Minimal satu role harus dipilih';
  }

  return errors;
};

export const ROLE_LABELS: Record<UserRoleCode, string> = {
  ADMIN: 'Administrator',
  GURU: 'Guru',
  WALI_KELAS: 'Wali Kelas',
  SISWA: 'Siswa',
  KEPALA_MADRASAH: 'Kepala Madrasah',
};