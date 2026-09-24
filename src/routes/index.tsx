import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AuthGuard, AdminGuard, TeacherGuard, HomeroomGuard, StudentGuard, HeadmasterGuard, PublicGuard } from './guards';
import { LoginPage } from '@/features/auth/pages/LoginPage';
import { AdminDashboardPage } from '@/features/admin/pages/AdminDashboardPage';
import MainLayout from '@/layouts/MainLayout';
import { useAuth } from '@/features/auth/hooks/useAuth';

// Placeholder pages - will be replaced in later phases
function DashboardPlaceholder() {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
      <h1 className="text-2xl font-semibold text-slate-800">Dashboard</h1>
      <p className="mt-2 text-sm text-slate-500">Halaman dashboard (placeholder)</p>
    </div>
  );
}

function AttendancePlaceholder() {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
      <h1 className="text-2xl font-semibold text-slate-800">Presensi</h1>
      <p className="mt-2 text-sm text-slate-500">Halaman presensi (placeholder)</p>
    </div>
  );
}

function LeavePlaceholder() {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
      <h1 className="text-2xl font-semibold text-slate-800">Perizinan</h1>
      <p className="mt-2 text-sm text-slate-500">Halaman perizinan (placeholder)</p>
    </div>
  );
}

function ReportsPlaceholder() {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
      <h1 className="text-2xl font-semibold text-slate-800">Laporan</h1>
      <p className="mt-2 text-sm text-slate-500">Halaman laporan (placeholder)</p>
    </div>
  );
}

function TeacherDashboardPlaceholder() {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
      <h1 className="text-2xl font-semibold text-slate-800">Teacher Dashboard</h1>
      <p className="mt-2 text-sm text-slate-500">Halaman guru (placeholder)</p>
    </div>
  );
}

function HomeroomDashboardPlaceholder() {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
      <h1 className="text-2xl font-semibold text-slate-800">Wali Kelas Dashboard</h1>
      <p className="mt-2 text-sm text-slate-500">Halaman wali kelas (placeholder)</p>
    </div>
  );
}

function StudentDashboardPlaceholder() {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
      <h1 className="text-2xl font-semibold text-slate-800">Student Dashboard</h1>
      <p className="mt-2 text-sm text-slate-500">Halaman siswa (placeholder)</p>
    </div>
  );
}

function HeadmasterDashboardPlaceholder() {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
      <h1 className="text-2xl font-semibold text-slate-800">Kepala Madrasah Dashboard</h1>
      <p className="mt-2 text-sm text-slate-500">Halaman kepala madrasah (placeholder)</p>
    </div>
  );
}

function AppRoutes() {
  const { user } = useAuth();

  const router = React.useMemo(
    () =>
      createBrowserRouter([
        {
          path: '/login',
          element: (
            <PublicGuard>
              <LoginPage />
            </PublicGuard>
          ),
        },
        {
          path: '/',
          element: (
            <AuthGuard>
              <MainLayout
                institutionName="MAS Al-Hikmah"
                institutionSubtitle="Sistem Presensi GPS & QR Code"
                activePeriod="2026/2027 Ganjil"
                userName={user?.user_metadata?.full_name ?? 'Pengguna'}
                userRole={user?.user_metadata?.role ?? 'Peran'}
                userInitials={(user?.user_metadata?.full_name ?? 'PG').slice(0, 2).toUpperCase()}
              >
                <DashboardPlaceholder />
              </MainLayout>
            </AuthGuard>
          ),
          children: [
            {
              index: true,
              element: <DashboardPlaceholder />,
            },
            {
              path: 'attendance',
              element: <AttendancePlaceholder />,
            },
            {
              path: 'leave',
              element: <LeavePlaceholder />,
            },
            {
              path: 'reports',
              element: <ReportsPlaceholder />,
            },
            // Admin routes
            {
              path: 'admin/*',
              element: (
                <AdminGuard>
                  <AdminDashboardPage />
                </AdminGuard>
              ),
            },
            // Teacher routes
            {
              path: 'teacher/*',
              element: (
                <TeacherGuard>
                  <TeacherDashboardPlaceholder />
                </TeacherGuard>
              ),
            },
            // Homeroom teacher routes
            {
              path: 'homeroom/*',
              element: (
                <HomeroomGuard>
                  <HomeroomDashboardPlaceholder />
                </HomeroomGuard>
              ),
            },
            // Student routes
            {
              path: 'student/*',
              element: (
                <StudentGuard>
                  <StudentDashboardPlaceholder />
                </StudentGuard>
              ),
            },
            // Headmaster routes
            {
              path: 'headmaster/*',
              element: (
                <HeadmasterGuard>
                  <HeadmasterDashboardPlaceholder />
                </HeadmasterGuard>
              ),
            },
          ],
        },
        // Catch-all redirect
        {
          path: '*',
          element: <Navigate to="/" replace />,
        },
      ]),
    [user]
  );

  return <RouterProvider router={router} />;
}

export default AppRoutes;