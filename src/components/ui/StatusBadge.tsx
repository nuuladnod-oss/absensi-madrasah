/**
 * Single source of truth for attendance status labels and colors.
 * Labels MUST match exactly the 8 statuses defined in 007 §3:
 * Hadir, Terlambat, Pulang Cepat, Belum Absen Pulang, Alpa,
 * Izin Resmi, Sakit, Menunggu Approval.
 */
export type AttendanceStatusType =
  | 'HADIR'
  | 'TERLAMBAT'
  | 'PULANG_CEPAT'
  | 'BELUM_ABSEN_PULANG'
  | 'ALPA'
  | 'IZIN'
  | 'SAKIT'
  | 'IZIN_MENUNGGU_APPROVAL';

interface StatusBadgeProps {
  status: AttendanceStatusType;
  /** Optional extra Tailwind classes. */
  className?: string;
  /** When true, render a colored dot before the label. */
  withDot?: boolean;
}

interface StatusConfig {
  label: string;
  bg: string;
  dot: string;
}

const statusConfig: Record<AttendanceStatusType, StatusConfig> = {
  HADIR: {
    label: 'Hadir',
    bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dot: 'bg-emerald-600',
  },
  TERLAMBAT: {
    label: 'Terlambat',
    bg: 'bg-amber-50 text-amber-700 border-amber-200',
    dot: 'bg-amber-600',
  },
  PULANG_CEPAT: {
    label: 'Pulang Cepat',
    bg: 'bg-orange-50 text-orange-700 border-orange-200',
    dot: 'bg-orange-600',
  },
  BELUM_ABSEN_PULANG: {
    label: 'Belum Absen Pulang',
    bg: 'bg-sky-50 text-sky-700 border-sky-200',
    dot: 'bg-sky-600',
  },
  ALPA: {
    label: 'Alpa',
    bg: 'bg-rose-50 text-rose-700 border-rose-200',
    dot: 'bg-rose-600',
  },
  IZIN: {
    label: 'Izin Resmi',
    bg: 'bg-sky-50 text-sky-700 border-sky-200',
    dot: 'bg-sky-600',
  },
  SAKIT: {
    label: 'Sakit',
    bg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    dot: 'bg-indigo-600',
  },
  IZIN_MENUNGGU_APPROVAL: {
    label: 'Menunggu Approval',
    bg: 'bg-purple-50 text-purple-700 border-purple-200',
    dot: 'bg-purple-600',
  },
};

export function StatusBadge({
  status,
  className = '',
  withDot = false,
}: StatusBadgeProps) {
  const config = statusConfig[status];

  if (!config) {
    return null;
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${config.bg} ${className}`}
    >
      {withDot && (
        <span
          className={`mr-1.5 h-1.5 w-1.5 rounded-full ${config.dot}`}
          aria-hidden="true"
        />
      )}
      {config.label}
    </span>
  );
}

export default StatusBadge;