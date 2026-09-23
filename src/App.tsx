import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import { LoginPage } from '@/features/auth/pages/LoginPage';
import { useAuth } from '@/features/auth/hooks/useAuth';

// Placeholder pages for now - will be replaced in later phases
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

function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-500">Memuat...</p>
      </div>
    </div>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, status } = useAuth();

  if (status === 'loading') {
    return <LoadingScreen />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, status } = useAuth();

  if (status === 'loading') {
    return <LoadingScreen />;
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  const { user } = useAuth();

  const router = React.useMemo(
    () =>
      createBrowserRouter([
        {
          path: '/login',
          element: (
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          ),
        },
        {
          path: '/',
          element: (
            <ProtectedRoute>
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
            </ProtectedRoute>
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
          ],
        },
      ]),
    [user]
  );

  return <RouterProvider router={router} />;
}

export default function App() {
  return <AppRoutes />;
}