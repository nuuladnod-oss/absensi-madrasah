import React from 'react';
import AppShell, { type AppShellProps } from '@/components/layout/AppShell';

/**
 * Page-level layout composition.
 * Wraps AppShell with default nav items for placeholder routes.
 * No business logic, no data fetching.
 */
export function MainLayout({
  sidebarItems,
  bottomNavItems,
  ...shellProps
}: Omit<AppShellProps, 'children'> & {
  children: React.ReactNode;
}) {
  const defaultSidebarItems = sidebarItems ?? [
    { id: 'dashboard', label: 'Beranda', active: true },
    { id: 'attendance', label: 'Presensi' },
    { id: 'leave', label: 'Perizinan' },
    { id: 'reports', label: 'Laporan' },
  ];

  const defaultBottomNavItems = bottomNavItems ?? [
    { id: 'dashboard', label: 'Beranda', active: true },
    { id: 'attendance', label: 'Presensi' },
    { id: 'leave', label: 'Perizinan' },
    { id: 'reports', label: 'Laporan' },
  ];

  return (
    <AppShell
      sidebarItems={defaultSidebarItems}
      bottomNavItems={defaultBottomNavItems}
      {...shellProps}
    />
  );
}

export default MainLayout;