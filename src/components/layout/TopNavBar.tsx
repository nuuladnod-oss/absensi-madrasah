import React from 'react';
import { Button } from '@/components/ui/Button';

export interface NavItem {
  id: string;
  label: string;
  /** Optional icon rendered before the label. */
  icon?: React.ReactNode;
  /** When true, this nav item is the active one. */
  active?: boolean;
  /** Optional badge rendered at the end (e.g. active period badge). */
  badge?: React.ReactNode;
  /** Click handler. */
  onClick?: (id: string) => void;
}

export interface TopNavBarProps {
  /** Institution / madrasah name. */
  institutionName?: string;
  /** Short subtitle under the institution name. */
  institutionSubtitle?: string;
  /** Active academic period text (placeholder until Fase 3). */
  activePeriod?: string;
  /** User display name. */
  userName?: string;
  /** User role label. */
  userRole?: string;
  /** User initials for the avatar. */
  userInitials?: string;
  /** Logout handler. */
  onLogout?: () => void;
  /** Optional extra actions rendered on the right. */
  actions?: React.ReactNode;
  /** Optional extra Tailwind classes. */
  className?: string;
}

const defaultInstitutionName = 'MAS Al-Hikmah';
const defaultInstitutionSubtitle = 'Sistem Presensi GPS & QR Code';
const defaultActivePeriod = '2026/2027 Ganjil';

const PeriodBadge = ({ text }: { text: string }) => (
  <span className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full text-xs font-medium text-emerald-800">
    <span
      className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"
      aria-hidden="true"
    />
    <span>Periode Aktif: <strong>{text}</strong></span>
  </span>
);

const LogoutIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
    />
  </svg>
);

/**
 * Persistent desktop top bar.
 * Contains brand identity, active academic period badge slot, user profile, and logout.
 * No business logic, no data fetching.
 */
export function TopNavBar({
  institutionName = defaultInstitutionName,
  institutionSubtitle = defaultInstitutionSubtitle,
  activePeriod = defaultActivePeriod,
  userName = 'Pengguna',
  userRole = 'Peran',
  userInitials = 'PG',
  onLogout,
  actions,
  className = '',
}: TopNavBarProps) {
  return (
    <header
      className={`h-16 border-b border-slate-200 bg-white flex items-center justify-between px-4 sm:px-6 z-20 ${className}`}
    >
      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
        <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
          AM
        </div>
        <div className="min-w-0">
          <div className="text-sm font-bold text-slate-900 leading-tight truncate">
            {institutionName}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5 leading-none truncate">
            {institutionSubtitle}
          </div>
        </div>

        <div className="hidden sm:flex items-center ml-2">
          <PeriodBadge text={activePeriod} />
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {actions}

        <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg">
          <svg
            className="w-3.5 h-3.5 text-emerald-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
          </svg>
          <span>GPS Siap</span>
        </div>

        <div className="flex items-center gap-2 pl-1">
          <div className="text-right hidden sm:block">
            <div className="text-xs font-semibold text-slate-900 leading-tight truncate">
              {userName}
            </div>
            <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
              {userRole}
            </div>
          </div>
          <div className="relative">
            <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center font-bold text-xs text-emerald-700">
              {userInitials}
            </div>
            <span
              className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"
              aria-hidden="true"
            />
          </div>
          {onLogout && (
            <Button
              variant="outline"
              size="sm"
              onClick={onLogout}
              className="px-2"
              aria-label="Keluar"
            >
              <LogoutIcon />
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}

export default TopNavBar;