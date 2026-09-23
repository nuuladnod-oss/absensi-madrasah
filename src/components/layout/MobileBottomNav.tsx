import React from 'react';

export interface MobileBottomNavItem {
  id: string;
  label: string;
  /** Optional icon rendered before the label. */
  icon?: React.ReactNode;
  /** When true, this item is the active one. */
  active?: boolean;
  /** Click handler. */
  onClick?: (id: string) => void;
}

export interface MobileBottomNavProps {
  /** Primary bottom navigation items (3-4 priority items). */
  items: MobileBottomNavItem[];
  /** Optional handler for the "More" drawer toggle. */
  onMore?: () => void;
  /** Whether the secondary drawer is open. */
  moreActive?: boolean;
  /** Optional extra Tailwind classes. */
  className?: string;
}

const MoreIcon = ({ active }: { active?: boolean }) => (
  <svg
    className="w-6 h-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    aria-hidden="true"
  >
    {active ? (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M6 18L18 6M6 6l12 12"
      />
    ) : (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M4 6h16M4 12h16M4 18h16"
      />
    )}
  </svg>
);

/**
 * Persistent Android bottom navigation bar.
 * One-thumb access: 3-4 priority items + a "More" drawer toggle.
 * Touch target >= 44px (h-16 bar, items padded).
 * No business logic, no data fetching.
 */
export function MobileBottomNav({
  items,
  onMore,
  moreActive = false,
  className = '',
}: MobileBottomNavProps) {
  const hasMore = typeof onMore === 'function';

  return (
    <nav
      className={`h-16 bg-white border-t border-slate-200 flex items-center justify-around px-2 z-20 shadow-lg ${className}`}
      aria-label="Navigasi utama mobile"
    >
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => item.onClick?.(item.id)}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl min-w-[44px] transition-colors ${
            item.active
              ? 'text-emerald-600 bg-emerald-50'
              : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
          }`}
          aria-current={item.active ? 'page' : undefined}
        >
          <span
            className={`mb-0.5 ${item.active ? 'text-emerald-600' : 'text-slate-400'}`}
          >
            {item.icon}
          </span>
          <span className="text-[10px] tracking-tight font-medium">
            {item.label}
          </span>
        </button>
      ))}

      {hasMore && (
        <button
          type="button"
          onClick={onMore}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl min-w-[44px] transition-colors ${
            moreActive
              ? 'text-emerald-600 bg-emerald-50'
              : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
          }`}
          aria-pressed={moreActive}
          aria-label="Menu lainnya"
        >
          <MoreIcon active={moreActive} />
          <span className="text-[10px] tracking-tight font-medium">
            {moreActive ? 'Tutup' : 'Lainnya'}
          </span>
        </button>
      )}
    </nav>
  );
}

export default MobileBottomNav;