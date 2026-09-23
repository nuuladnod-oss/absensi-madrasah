import React, { useState } from 'react';
import { TopNavBar, type TopNavBarProps } from '@/components/layout/TopNavBar';
import { MobileBottomNav, type MobileBottomNavItem } from '@/components/layout/MobileBottomNav';

export interface AppShellProps extends TopNavBarProps {
  /** Desktop sidebar navigation items. */
  sidebarItems?: MobileBottomNavItem[];
  /** Mobile bottom navigation items. */
  bottomNavItems?: MobileBottomNavItem[];
  /** Main content rendered inside the shell. */
  children: React.ReactNode;
  /** Optional extra Tailwind classes for the content area. */
  contentClassName?: string;
}

/**
 * AppShell composes TopNavBar (desktop) + MobileBottomNav (mobile) and
 * provides a responsive sidebar / bottom-nav layout.
 *
 * Desktop (< 1024px is hidden): persistent left sidebar.
 * Mobile: sidebar hidden, bottom nav shown instead.
 *
 * No business logic, no data fetching, no route guards.
 */
export function AppShell({
  sidebarItems = [],
  bottomNavItems = [],
  children,
  contentClassName = '',
  ...topNavBarProps
}: AppShellProps) {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      <TopNavBar {...topNavBarProps} />

      <div className="flex-1 flex overflow-hidden">
        {/* DESKTOP SIDEBAR — hidden on mobile */}
        <aside className="hidden lg:flex w-64 border-r border-slate-200 bg-slate-50/70 flex-col justify-between p-4 flex-shrink-0">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-2">
              Menu Utama
            </div>
            <nav className="space-y-1">
              {sidebarItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => item.onClick?.(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    item.active
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                  aria-current={item.active ? 'page' : undefined}
                >
                  <span className={item.active ? 'text-emerald-600' : 'text-slate-400'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="pt-4 border-t border-slate-200">
            <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700 mb-1">
                <span>Tahun Ajaran</span>
                <span className="text-emerald-600 font-mono">26/27</span>
              </div>
              <div className="text-[11px] text-slate-500 truncate">
                Semester Ganjil (Aktif)
              </div>
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className={`flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 ${contentClassName}`}>
          {children}
        </main>
      </div>

      {/* MOBILE BOTTOM NAV — hidden on desktop */}
      <div className="lg:hidden">
        <MobileBottomNav
          items={bottomNavItems}
          onMore={() => setMobileDrawerOpen((prev) => !prev)}
          moreActive={mobileDrawerOpen}
        />
      </div>

      {/* MOBILE DRAWER SHEET — shown when "Lainnya" is tapped */}
      {mobileDrawerOpen && (
        <div
          className="lg:hidden fixed inset-0 z-30 flex justify-end"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="absolute inset-0 bg-slate-900/50"
            aria-hidden="true"
            onClick={() => setMobileDrawerOpen(false)}
          />
          <div className="relative w-full max-w-[70%] h-full bg-white shadow-xl flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
              <span className="text-sm font-bold text-slate-900">Menu Lengkap</span>
              <button
                type="button"
                onClick={() => setMobileDrawerOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-600"
                aria-label="Tutup menu"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto p-2 space-y-1">
              {sidebarItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    item.onClick?.(item.id);
                    setMobileDrawerOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    item.active
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span className={item.active ? 'text-emerald-600' : 'text-slate-400'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}

export default AppShell;