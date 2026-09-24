import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useAuthorization } from '@/hooks/useAuthorization';
import { StateAlert } from '@/components/ui/StateAlert';

/**
 * Authentication guard - ensures user is logged in.
 */
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { status } = useAuth();

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500">Memuat...</p>
        </div>
      </div>
    );
  }

  if (status !== 'authenticated') {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

/**
 * Role-based guard - ensures user has at least one of the required roles.
 */
interface RoleGuardProps {
  children: React.ReactNode;
  roles: Array<'ADMIN' | 'GURU' | 'WALI_KELAS' | 'SISWA' | 'KEPALA_MADRASAH'>;
  fallback?: React.ReactNode;
}

export function RoleGuard({ children, roles, fallback }: RoleGuardProps) {
  const { status } = useAuth();
  const { loading, hasAnyRole } = useAuthorization();

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500">Memeriksa hak akses...</p>
        </div>
      </div>
    );
  }

  const hasAccess = hasAnyRole(roles);

  if (!hasAccess) {
    return fallback ?? (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
        <StateAlert
          variant="error"
          title="Akses Ditolak"
          message="Anda tidak memiliki hak akses untuk halaman ini."
        />
      </div>
    );
  }

  return <>{children}</>;
}

/**
 * Admin-only guard (for nested routes with Outlet).
 */
export function AdminGuard() {
  const { status } = useAuth();
  const { loading, canAccessAdmin } = useAuthorization();

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500">Memeriksa hak akses...</p>
        </div>
      </div>
    );
  }

  if (!canAccessAdmin()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
        <StateAlert
          variant="error"
          title="Akses Ditolak"
          message="Anda tidak memiliki hak akses untuk halaman ini."
        />
      </div>
    );
  }

  return <Outlet />;
}

/**
 * Admin-only guard (for direct children).
 */
export function AdminGuardWithChildren({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard roles={['ADMIN']}>
      {children}
    </RoleGuard>
  );
}

/**
 * Teacher guard (Guru + Admin).
 */
export function TeacherGuard({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard roles={['GURU', 'ADMIN']}>
      {children}
    </RoleGuard>
  );
}

/**
 * Homeroom teacher guard (Wali Kelas + Admin).
 */
export function HomeroomGuard({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard roles={['WALI_KELAS', 'ADMIN']}>
      {children}
    </RoleGuard>
  );
}

/**
 * Student guard (Siswa + Admin).
 */
export function StudentGuard({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard roles={['SISWA', 'ADMIN']}>
      {children}
    </RoleGuard>
  );
}

/**
 * Headmaster guard (Kepala Madrasah + Admin).
 */
export function HeadmasterGuard({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard roles={['KEPALA_MADRASAH', 'ADMIN']}>
      {children}
    </RoleGuard>
  );
}

/**
 * Public route guard - redirects authenticated users away from login page.
 */
export function PublicGuard({ children }: { children: React.ReactNode }) {
  const { status, user } = useAuth();

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500">Memuat...</p>
        </div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}