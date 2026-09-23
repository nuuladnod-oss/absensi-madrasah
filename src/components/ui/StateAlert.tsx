import React from 'react';

export type StateAlertVariant = 'success' | 'warning' | 'error' | 'info' | 'loading';

export interface StateAlertProps {
  /** Visual variant. */
  variant?: StateAlertVariant;
  /** Optional bold title line. */
  title?: string;
  /** Body text. */
  message: string;
  /** Optional retry action. */
  onRetry?: () => void;
  /** Optional retry button label. */
  retryLabel?: string;
  /** Optional extra Tailwind classes. */
  className?: string;
  /** When true, hide the icon. */
  hideIcon?: boolean;
}

const config: Record<StateAlertVariant, { border: string; bg: string; title: string; icon: React.ReactNode }> = {
  success: {
    border: 'border-emerald-200',
    bg: 'bg-emerald-50',
    title: 'text-emerald-900',
    icon: (
      <svg className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  warning: {
    border: 'border-amber-200',
    bg: 'bg-amber-50',
    title: 'text-amber-900',
    icon: (
      <svg className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
  },
  error: {
    border: 'border-rose-200',
    bg: 'bg-rose-50',
    title: 'text-rose-900',
    icon: (
      <svg className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
      </svg>
    ),
  },
  info: {
    border: 'border-sky-200',
    bg: 'bg-sky-50',
    title: 'text-sky-900',
    icon: (
      <svg className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  loading: {
    border: 'border-slate-200',
    bg: 'bg-slate-50',
    title: 'text-slate-900',
    icon: (
      <div className="h-5 w-5 rounded-full border-2 border-slate-200 border-t-emerald-600 animate-spin shrink-0 mt-0.5" />
    ),
  },
};

/**
 * Generic state banner for idle/loading/success/empty/error states.
 * No data fetching, no business logic.
 * Text uses plain Bahasa Indonesia, no stack traces (010 § state).
 */
export function StateAlert({
  variant = 'info',
  title,
  message,
  onRetry,
  retryLabel = 'Coba Lagi',
  className = '',
  hideIcon = false,
}: StateAlertProps) {
  const c = config[variant];

  return (
    <div
      className={`rounded-xl border ${c.border} ${c.bg} p-4 ${className}`}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-start gap-3">
        {!hideIcon && c.icon}
        <div className="min-w-0 flex-1">
          {title && (
            <p className={`text-sm font-bold ${c.title}`}>{title}</p>
          )}
          <p className="text-xs text-slate-700 leading-relaxed mt-0.5">
            {message}
          </p>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="mt-2 text-xs font-semibold text-emerald-700 hover:text-emerald-800 underline underline-offset-2"
            >
              {retryLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default StateAlert;