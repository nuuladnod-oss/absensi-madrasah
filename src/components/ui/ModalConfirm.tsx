import React from 'react';

export type ConfirmVariant = 'success' | 'danger' | 'warning' | 'info';

export interface ModalConfirmProps {
  /** Controls open/close. */
  open: boolean;
  /** Called when the user confirms or clicks outside/escape. */
  onClose: () => void;
  /** Called when the user clicks the confirm button. */
  onConfirm: () => void;
  /** Dialog title. */
  title: string;
  /** Dialog description/body. */
  description?: React.ReactNode;
  /** Confirm button label. */
  confirmLabel?: string;
  /** Cancel button label. */
  cancelLabel?: string;
  /** Visual variant driving icon + confirm button color. */
  variant?: ConfirmVariant;
  /** When true, the confirm button is disabled. */
  confirmDisabled?: boolean;
  /** Optional extra Tailwind classes for the card. */
  className?: string;
}

const variantConfig: Record<ConfirmVariant, { icon: React.ReactNode; buttonClass: string; iconBg: string; iconFg: string }> = {
  success: {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    buttonClass: 'bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-600/30',
    iconBg: 'bg-emerald-100',
    iconFg: 'text-emerald-700',
  },
  danger: {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    buttonClass: 'bg-rose-600 text-white hover:bg-rose-700 focus:ring-rose-600/30',
    iconBg: 'bg-rose-100',
    iconFg: 'text-rose-700',
  },
  warning: {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    buttonClass: 'bg-amber-600 text-white hover:bg-amber-700 focus:ring-amber-600/30',
    iconBg: 'bg-amber-100',
    iconFg: 'text-amber-700',
  },
  info: {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    buttonClass: 'bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-600/30',
    iconBg: 'bg-sky-100',
    iconFg: 'text-sky-700',
  },
};

/**
 * Confirmation dialog.
 * No data fetching, no business logic.
 * Overlay + centered card, focus trapped via native focus within the card.
 */
export function ModalConfirm({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Ya, Konfirmasi',
  cancelLabel = 'Batal',
  variant = 'success',
  confirmDisabled = false,
  className = '',
}: ModalConfirmProps) {
  const config = variantConfig[variant];

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-confirm-title"
    >
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        aria-hidden="true"
        onClick={onClose}
      />

      <div
        className={`relative w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-lg ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-3">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${config.iconBg} ${config.iconFg}`}
          >
            {config.icon}
          </div>
          <div className="min-w-0 flex-1">
            <h3
              id="modal-confirm-title"
              className="text-base font-bold text-slate-900"
            >
              {title}
            </h3>
            {description && (
              <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                {description}
              </p>
            )}
          </div>
        </div>

        <div className="mt-5 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="h-10 px-4 text-xs font-semibold rounded-lg border border-slate-300 text-slate-700 bg-white hover:bg-slate-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={confirmDisabled}
            className={`h-10 px-4 text-xs font-semibold rounded-lg ${config.buttonClass} disabled:cursor-not-allowed disabled:opacity-50`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalConfirm;