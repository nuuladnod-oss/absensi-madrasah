export interface MetricCardProps {
  label: string;
  value: number | string;
  /** Optional secondary helper, e.g. "/ 420 Siswa Terdaftar". */
  helper?: string;
  /** Optional trend/comparison value shown in a small chip. */
  trend?: {
    label: string;
    tone?: 'positive' | 'neutral' | 'negative';
  };
  /** Optional footer entries rendered as small key/value pairs. */
  footer?: Array<{ key: string; value: string }>;
  /** Optional extra Tailwind classes. */
  className?: string;
}

const toneClasses: Record<string, string> = {
  positive: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  neutral: 'bg-slate-100 text-slate-600 border-slate-200',
  negative: 'bg-rose-50 text-rose-700 border-rose-200',
};

/**
 * Pure presentational card for operational summary metrics.
 * No data fetching, no business logic.
 */
export function MetricCard({
  label,
  value,
  helper,
  trend,
  footer,
  className = '',
}: MetricCardProps) {
  return (
    <div
      className={`rounded-xl border border-slate-200 bg-white p-5 shadow-xs ${className}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-500">{label}</span>
        {trend && (
          <span
            className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${
              toneClasses[trend.tone ?? 'neutral']
            }`}
          >
            {trend.label}
          </span>
        )}
      </div>

      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-3xl font-bold text-slate-900 tabular-nums">
          {value}
        </span>
        {helper && <span className="text-xs text-slate-500">{helper}</span>}
      </div>

      {footer && footer.length > 0 && (
        <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
          {footer.map((entry) => (
            <span key={entry.key}>
              {entry.key}:{' '}
              <strong className="font-mono font-semibold text-slate-800">
                {entry.value}
              </strong>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default MetricCard;