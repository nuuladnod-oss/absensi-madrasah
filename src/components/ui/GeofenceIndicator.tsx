export interface GeofenceIndicatorProps {
  /** Distance from the madrasah point, in meters. */
  distanceMeter: number;
  /** GPS accuracy radius, in meters. */
  accuracyMeter: number;
  /** Geofence radius configured for the madrasah (default 200m per 010 §5). */
  radiusMeter?: number;
  /** Maximum acceptable GPS accuracy (default 30m per 010 §5). */
  maxAccuracyMeter?: number;
  /** Optional extra Tailwind classes. */
  className?: string;
}

interface CheckResult {
  withinRadius: boolean;
  accuracyOk: boolean;
}

function evaluate(
  distanceMeter: number,
  accuracyMeter: number,
  radiusMeter: number,
  maxAccuracyMeter: number
): CheckResult {
  return {
    withinRadius: distanceMeter <= radiusMeter,
    accuracyOk: accuracyMeter <= maxAccuracyMeter,
  };
}

const VALIDATION_OK_LABEL = 'Memenuhi Syarat';
const VALIDATION_FAIL_LABEL = 'Tidak Memenuhi Syarat';

/**
 * Pure presentational component.
 * No network access, no device info, no business logic.
 * Only lat/long/accuracy/distance are surfaced (010 §5).
 */
export function GeofenceIndicator({
  distanceMeter,
  accuracyMeter,
  radiusMeter = 200,
  maxAccuracyMeter = 30,
  className = '',
}: GeofenceIndicatorProps) {
  const { withinRadius, accuracyOk } = evaluate(
    distanceMeter,
    accuracyMeter,
    radiusMeter,
    maxAccuracyMeter
  );

  const isValid = withinRadius && accuracyOk;
  const ringClass = isValid
    ? 'border-emerald-200 bg-emerald-50'
    : 'border-rose-200 bg-rose-50';
  const labelClass = isValid ? 'text-emerald-700' : 'text-rose-700';
  const valueClass = isValid ? 'text-emerald-600' : 'text-rose-600';

  return (
    <div
      className={`rounded-xl border p-4 ${ringClass} ${className}`}
      aria-live="polite"
    >
      <div className="flex items-center justify-between">
        <span className={`text-xs font-semibold uppercase tracking-wider ${labelClass}`}>
          Validasi Geofencing
        </span>
        <span
          className={`px-2 py-0.5 rounded text-[11px] font-semibold ${labelClass} bg-white/60 border ${isValid ? 'border-emerald-200' : 'border-rose-200'}`}
        >
          {isValid ? VALIDATION_OK_LABEL : VALIDATION_FAIL_LABEL}
        </span>
      </div>

      <div className="mt-3 space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-slate-500">Radius Madrasah</span>
          <span className="font-mono font-medium text-slate-700">{radiusMeter}m</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-500">Jarak Anda</span>
          <span className={`font-mono font-semibold ${valueClass}`}>
            {distanceMeter.toFixed(1)} meter
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-500">Akurasi GPS</span>
          <span className={`font-mono font-semibold ${valueClass}`}>
            {accuracyMeter}m {accuracyOk ? '(≤ ' + maxAccuracyMeter + 'm)' : '(> ' + maxAccuracyMeter + 'm)'}
          </span>
        </div>
      </div>

      {!isValid && (
        <p className="mt-3 text-[11px] leading-relaxed text-rose-700">
          {!withinRadius &&
            `Jarak melebihi batas ${radiusMeter}m. Silakan mendekat ke area madrasah.`}
          {!accuracyOk &&
            accuracyMeter > maxAccuracyMeter &&
            `Akurasi GPS terlalu buruk (>${maxAccuracyMeter}m). Coba lagi di lokasi terbuka.`}
        </p>
      )}
    </div>
  );
}

export default GeofenceIndicator;