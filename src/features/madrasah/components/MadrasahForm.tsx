import React, { useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { StateAlert } from '@/components/ui/StateAlert';
import type { MadrasahFormData } from '../types';
import { validateMadrasahForm, DEFAULT_GEOFENCE_RADIUS, DEFAULT_MAX_GPS_ACCURACY } from '../types';

interface MadrasahFormProps {
  initialData?: MadrasahFormData | null;
  onSubmit: (data: MadrasahFormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
  title: string;
}

export function MadrasahForm({
  initialData,
  onSubmit,
  onCancel,
  loading = false,
  title,
}: MadrasahFormProps) {
  const [formData, setFormData] = useState<MadrasahFormData>({
    name: '',
    address: '',
    latitude: 0,
    longitude: 0,
    geofence_radius_meter: DEFAULT_GEOFENCE_RADIUS,
    max_gps_accuracy_meter: DEFAULT_MAX_GPS_ACCURACY,
    ...initialData,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: '',
        address: '',
        latitude: 0,
        longitude: 0,
        geofence_radius_meter: DEFAULT_GEOFENCE_RADIUS,
        max_gps_accuracy_meter: DEFAULT_MAX_GPS_ACCURACY,
        ...initialData,
      });
    }
  }, [initialData]);

  const handleChange = (field: keyof MadrasahFormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleBlur = () => {
    const validationErrors = validateMadrasahForm(formData);
    setErrors(validationErrors);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateMadrasahForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setSubmitError(null);
    try {
      await onSubmit(formData);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {submitError && (
        <StateAlert variant="error" message={submitError} className="mb-2" />
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1.5">
          Nama Madrasah <span className="text-rose-500">*</span>
        </label>
        <input
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          onBlur={() => handleBlur('name')}
          required
          disabled={loading}
          className={`w-full h-11 px-4 text-sm border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 disabled:opacity-50 ${
            errors.name ? 'border-rose-500' : 'border-slate-300'
          }`}
          placeholder="Contoh: MAS Al-Hikmah"
        />
        {errors.name && <p className="mt-1 text-xs text-rose-600">{errors.name}</p>}
      </div>

      <div>
        <label htmlFor="address" className="block text-sm font-medium text-slate-700 mb-1.5">
          Alamat
        </label>
        <textarea
          id="address"
          value={formData.address}
          onChange={(e) => handleChange('address', e.target.value)}
          disabled={loading}
          rows={3}
          className="w-full px-4 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 disabled:opacity-50"
          placeholder="Alamat lengkap madrasah"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="latitude" className="block text-sm font-medium text-slate-700 mb-1.5">
            Latitude <span className="text-rose-500">*</span>
          </label>
          <input
            id="latitude"
            type="number"
            step="0.000001"
            value={formData.latitude}
            onChange={(e) => handleChange('latitude', parseFloat(e.target.value) || 0)}
            onBlur={() => handleBlur('latitude')}
            required
            disabled={loading}
            className={`w-full h-11 px-4 text-sm border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 disabled:opacity-50 ${
              errors.latitude ? 'border-rose-500' : 'border-slate-300'
            }`}
            placeholder="-6.123456"
          />
          {errors.latitude && <p className="mt-1 text-xs text-rose-600">{errors.latitude}</p>}
        </div>

        <div>
          <label htmlFor="longitude" className="block text-sm font-medium text-slate-700 mb-1.5">
            Longitude <span className="text-rose-500">*</span>
          </label>
          <input
            id="longitude"
            type="number"
            step="0.000001"
            value={formData.longitude}
            onChange={(e) => handleChange('longitude', parseFloat(e.target.value) || 0)}
            onBlur={() => handleBlur('longitude')}
            required
            disabled={loading}
            className={`w-full h-11 px-4 text-sm border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 disabled:opacity-50 ${
              errors.longitude ? 'border-rose-500' : 'border-slate-300'
            }`}
            placeholder="106.123456"
          />
          {errors.longitude && <p className="mt-1 text-xs text-rose-600">{errors.longitude}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="geofence_radius_meter" className="block text-sm font-medium text-slate-700 mb-1.5">
            Radius Geofence (meter) <span className="text-rose-500">*</span>
          </label>
          <input
            id="geofence_radius_meter"
            type="number"
            min="1"
            max="5000"
            value={formData.geofence_radius_meter}
            onChange={(e) => handleChange('geofence_radius_meter', parseInt(e.target.value) || DEFAULT_GEOFENCE_RADIUS)}
            onBlur={() => handleBlur('geofence_radius_meter')}
            required
            disabled={loading}
            className={`w-full h-11 px-4 text-sm border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 disabled:opacity-50 ${
              errors.geofence_radius_meter ? 'border-rose-500' : 'border-slate-300'
            }`}
            placeholder="200"
          />
          {errors.geofence_radius_meter && <p className="mt-1 text-xs text-rose-600">{errors.geofence_radius_meter}</p>}
          <p className="mt-1 text-xs text-slate-500">Default: 200m (konfigurasi standar)</p>
        </div>

        <div>
          <label htmlFor="max_gps_accuracy_meter" className="block text-sm font-medium text-slate-700 mb-1.5">
            Akurasi GPS Maksimal (meter) <span className="text-rose-500">*</span>
          </label>
          <input
            id="max_gps_accuracy_meter"
            type="number"
            min="1"
            max="100"
            value={formData.max_gps_accuracy_meter}
            onChange={(e) => handleChange('max_gps_accuracy_meter', parseInt(e.target.value) || DEFAULT_MAX_GPS_ACCURACY)}
            onBlur={() => handleBlur('max_gps_accuracy_meter')}
            required
            disabled={loading}
            className={`w-full h-11 px-4 text-sm border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 disabled:opacity-50 ${
              errors.max_gps_accuracy_meter ? 'border-rose-500' : 'border-slate-300'
            }`}
            placeholder="30"
          />
          {errors.max_gps_accuracy_meter && <p className="mt-1 text-xs text-rose-600">{errors.max_gps_accuracy_meter}</p>}
          <p className="mt-1 text-xs text-slate-500">Default: 30m (konfigurasi standar)</p>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Batal
        </Button>
        <Button type="submit" variant="primary" loading={loading}>
          {title === 'Tambah Madrasah' ? 'Simpan' : 'Perbarui'}
        </Button>
      </div>
    </form>
  );
}