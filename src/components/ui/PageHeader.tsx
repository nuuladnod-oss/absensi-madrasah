import React from 'react';

export interface PageHeaderProps {
  /** Page title (formula: [Aksi/Entitas] — [Konteks Singkat], 007 §1). */
  title: string;
  /** Short context line rendered below the title. */
  subtitle?: string;
  /** Optional active academic period badge rendered in the header. */
  periodBadge?: {
    label: string;
    text: string;
  };
  /** Optional action elements rendered on the right side. */
  actions?: React.ReactNode;
  /** Optional extra Tailwind classes. */
  className?: string;
}

/**
 * Responsive page header.
 * Desktop: title + subtitle on the left, actions on the right.
 * Mobile: stacks vertically with reduced title size.
 * No business logic, no data fetching.
 */
export function PageHeader({
  title,
  subtitle,
  periodBadge,
  actions,
  className = '',
}: PageHeaderProps) {
  return (
    <div className={`pb-4 border-b border-slate-100 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 leading-tight truncate">
              {title}
            </h1>
            {periodBadge && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 shrink-0">
                <span
                  className="w-1.5 h-1.5 rounded-full bg-emerald-600 mr-1.5"
                  aria-hidden="true"
                />
                {periodBadge.text}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
          )}
        </div>

        {actions && (
          <div className="flex items-center gap-2 shrink-0">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}

export default PageHeader;